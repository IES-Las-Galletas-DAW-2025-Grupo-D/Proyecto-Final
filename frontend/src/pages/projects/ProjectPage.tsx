import { useParams, useLocation } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Island } from "../../components/ui/containers/section/Island";
import { TimeLine } from "../../components/timeline/TimeLine";
import { Project } from "../../types/project";
import { FaTimesCircle, FaCloud } from "react-icons/fa";
import { getProject } from "../../services/projects/ProjectService";
import { DataSet, IdType } from "vis-timeline/standalone";
import {
  TimelineWSEvent,
  WebSocketMessage,
  WsMessagePayloadAction,
  WsMessagePayloadConnectionSuccess,
  WsMessagePayloadUserJoined,
} from "../../types/timeline";
import { useAuth } from "../../providers/AuthProvider";
import { toWsUrl } from "../../utils/api";
import { InviteUserForm } from "../../components/projects/InviteUserForm";

const SERVER_SENDER_ID = "timeline-server-event";

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(
    location.state?.project || null
  );
  const [loading, setLoading] = useState<boolean>(!project);
  const [error, setError] = useState<string | null>(null);
  const descriptionModalRef = useRef<HTMLDialogElement | null>(null);
  const [eventsData] = useState(() => new DataSet<TimelineWSEvent>([]));
  const webSocketRef = useRef<WebSocket | null>(null); // Use WebSocket directly
  const { getToken, getUserName } = useAuth();

  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!project && projectId) {
      const fetchProject = async () => {
        setLoading(true);
        setError(null);
        try {
          if (!projectId) {
            setError("Project ID is missing.");
            setProject(null);
            return;
          }
          const data = await getProject(projectId);
          setProject(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
          setProject(null);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    } else if (project) {
      setLoading(false);
      setError(null);
    }
  }, [projectId, project]);

  useEffect(() => {
    if (project && projectId && !webSocketRef.current) {
      const connectWebSocket = async () => {
        const token = getToken ? await getToken() : null;
        let wsUrl = toWsUrl(`/projects/${projectId}`);

        if (token) {
          wsUrl += `?token=${token}`;
        }

        console.log(`ProjectPage: Connecting to WebSocket at ${wsUrl}`);
        const ws = new WebSocket(wsUrl);
        webSocketRef.current = ws;

        ws.onopen = () => {
          console.log(
            `ProjectPage: WebSocket connected for project ${projectId}`
          );
        };

        ws.onmessage = (event) => {
          // try {
          const message = JSON.parse(event.data as string) as WebSocketMessage;
          console.log("ProjectPage: WebSocket message received:", message);

          switch (message.type) {
            // case "initial_data":
            //   if (Array.isArray(message.data)) {
            //     eventsData.clear();
            //     eventsData.add(
            //       message.data as TimelineWSEvent[],
            //       SERVER_SENDER_ID
            //     );
            //     console.log("ProjectPage: Initial data loaded into DataSet.");
            //   } else {
            //     console.warn(
            //       "ProjectPage: Received initial_data with invalid payload.",
            //       message.data
            //     );
            //   }
            //   break;
            case "connection_success": {
              const payload = message.data as WsMessagePayloadConnectionSuccess;

              console.log("Received connection success:", payload);
              setActiveUsers(
                payload.activeUsers.filter(
                  (username) => username !== getUserName()
                )
              );

              if (Array.isArray(payload.projectEvents)) {
                eventsData.clear(SERVER_SENDER_ID);
                eventsData.add(payload.projectEvents, SERVER_SENDER_ID);
                console.log(
                  "ProjectPage: Initial project events loaded into DataSet from connection_success."
                );
              } else {
                console.warn(
                  "ProjectPage: Received connection_success with invalid projectEvents payload.",
                  payload.projectEvents
                );
              }

              console.log("ProjectPage: Active users updated:", activeUsers);

              break;
            }
            case "user_left":
            case "user_joined": {
              const payload = message.data as WsMessagePayloadUserJoined;
              console.log("User joined:", payload);
              setActiveUsers(
                payload.activeUsers.filter(
                  (username) => username !== getUserName()
                )
              );
              console.log("ProjectPage: Active users updated:", activeUsers);
              break;
            }
            case "add":
              eventsData.add(
                (message.data as WsMessagePayloadAction)
                  .data as TimelineWSEvent,
                SERVER_SENDER_ID
              );
              console.log("ProjectPage: Event added to DataSet:", message.data);
              break;
            case "update":
              eventsData.update(
                (message.data as WsMessagePayloadAction)
                  .data as TimelineWSEvent,
                SERVER_SENDER_ID
              );
              console.log(
                "ProjectPage: Event updated in DataSet:",
                message.data
              );
              break;
            case "delete": {
              const idToRemove = (message.data as WsMessagePayloadAction)
                .data as TimelineWSEvent;
              if (idToRemove !== undefined && idToRemove !== null) {
                eventsData.remove(idToRemove as IdType, SERVER_SENDER_ID);
                console.log(
                  "ProjectPage: Event removed from DataSet, ID:",
                  idToRemove
                );
              } else {
                console.warn(
                  "ProjectPage: Received event_removed with invalid/missing ID.",
                  message.data,
                  idToRemove
                );
              }
              break;
            }
            default:
              console.log(
                `ProjectPage: Received unhandled WebSocket message type: ${message.type}`
              );
          }
          // } catch (e) {
          //   console.error(
          //     "ProjectPage: Error processing WebSocket message:",
          //     e,
          //     "Raw data:",
          //     event.data
          //   );
          // }
        };

        ws.onerror = (wsError) => {
          console.error(
            `ProjectPage: WebSocket error for project ${projectId}:`,
            wsError
          );
          setError("Timeline connection error. Please try refreshing.");
          webSocketRef.current = null;
        };

        ws.onclose = (closeEvent) => {
          console.log(
            `ProjectPage: WebSocket disconnected for project ${projectId}. Code: ${closeEvent.code}, Reason: ${closeEvent.reason}`
          );
          if (webSocketRef.current && closeEvent.code !== 1000) {
            // 1000 is normal closure
            setError("Timeline disconnected. Please refresh.");
          }
          webSocketRef.current = null;
        };
      };

      connectWebSocket();
    }

    return () => {
      if (webSocketRef.current) {
        console.log(
          `ProjectPage: Cleaning up WebSocket for project ${projectId}`
        );
        webSocketRef.current.onopen = null;
        webSocketRef.current.onmessage = null;
        webSocketRef.current.onerror = null;
        webSocketRef.current.onclose = null;
        webSocketRef.current.close(1000, "Component unmounting");
        webSocketRef.current = null;
      }
    };
  }, [project, projectId, eventsData, getToken, getUserName]);

  const sendTimelineEventToServer = (
    type: string,
    data: WsMessagePayloadAction
  ) => {
    if (
      webSocketRef.current &&
      webSocketRef.current.readyState === WebSocket.OPEN
    ) {
      const message: WebSocketMessage = { type, data };
      webSocketRef.current.send(JSON.stringify(message));
      console.log("ProjectPage: Sent timeline event to server:", message);
    } else {
      console.error(
        "ProjectPage: WebSocket not connected. Cannot send timeline event:",
        { type, data }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full gap-5">
        <Island>
          <div className="skeleton h-8 w-1/2 mb-4"></div>
          <div className="skeleton h-6 w-1/4"></div>
        </Island>
        <Island className="flex-grow min-h-0">
          <div className="skeleton h-full w-full"></div>
        </Island>
      </div>
    );
  }

  if (error) {
    return (
      <Island>
        <div role="alert" className="alert alert-error">
          <FaTimesCircle className="shrink-0 h-6 w-6" />
          <span>Error! {error}</span>
        </div>
      </Island>
    );
  }

  if (!project) {
    return (
      <Island>
        <p className="text-center text-lg">Project not found.</p>
      </Island>
    );
  }

  const descriptionSnippetLength = 50;
  const isDescriptionLong =
    project.description &&
    project.description.length > descriptionSnippetLength;
  const descriptionPreview = isDescriptionLong
    ? `${project.description.substring(0, descriptionSnippetLength)}...`
    : project.description;

  const openDescriptionModal = () => {
    if (descriptionModalRef.current) {
      descriptionModalRef.current.showModal();
    }
  };

  return (
    <div className="flex flex-col h-full gap-5">
      <Island>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">{project.name}</h1>
            <FaCloud className="w-5 h-5 text-base-content/70" />
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost">
              Members
              {activeUsers.length === 1 && (
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${activeUsers[0]}`}
                      alt={activeUsers[0]}
                    />
                  </div>
                </div>
              )}
              {activeUsers.length > 1 && (
                <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                  {activeUsers.slice(0, 2).map((user) => (
                    <div className="avatar" key={user}>
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user}`}
                          alt={user}
                        />
                      </div>
                    </div>
                  ))}
                  {activeUsers.length > 2 && (
                    <div className="avatar avatar-placeholder">
                      <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                        <span className="text-xs">
                          +{activeUsers.length - 2}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </button>
            <InviteUserForm
              projectId={project.id}
              onInviteSuccess={() => {
                if (projectId) {
                  getProject(projectId).then(setProject);
                }
              }}
            />
          </div>
        </div>
        {project.description && (
          <div className="mt-2">
            <p
              className={`text-base-content/80 ${
                isDescriptionLong ? "cursor-pointer hover:text-primary" : ""
              }`}
              onClick={isDescriptionLong ? openDescriptionModal : undefined}
              onKeyDown={
                isDescriptionLong
                  ? (e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      openDescriptionModal()
                  : undefined
              }
              tabIndex={isDescriptionLong ? 0 : undefined}
              role={isDescriptionLong ? "button" : undefined}
              aria-expanded={isDescriptionLong ? "false" : undefined}
              aria-controls={
                isDescriptionLong ? "description_modal_content" : undefined
              }
            >
              {descriptionPreview}
            </p>
          </div>
        )}
      </Island>
      <Island className="flex-grow min-h-0">
        {project && (
          <TimeLine
            projectId={project.id}
            eventsData={eventsData}
            sendTimelineEventToServer={sendTimelineEventToServer}
          />
        )}
      </Island>

      <dialog
        id="description_modal_content"
        ref={descriptionModalRef}
        className="modal"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Project Description</h3>
          <p className="py-4 whitespace-pre-wrap">{project.description}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
