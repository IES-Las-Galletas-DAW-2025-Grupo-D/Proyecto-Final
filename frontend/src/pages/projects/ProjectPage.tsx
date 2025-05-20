import { useParams, useLocation } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Island } from "../../components/ui/containers/section/Island";
import { TimeLine } from "../../components/timeline/TimeLine";
import { Project } from "../../types/project";
import { FaTimesCircle, FaCloud } from "react-icons/fa";
import { getProject } from "../../services/projects/ProjectService";

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(
    location.state?.project || null
  );
  const [loading, setLoading] = useState<boolean>(!project);
  const [error, setError] = useState<string | null>(null);
  const descriptionModalRef = useRef<HTMLDialogElement | null>(null);

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
            <h1>{project.name}</h1>
            <FaCloud className="w-5 h-5 text-base-content/70" />
          </div>
          <div className="avatar-group -space-x-4 rtl:space-x-reverse">
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img src="https://picsum.photos/seed/userA/200" alt="User A" />
              </div>
            </div>
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img src="https://picsum.photos/seed/userB/200" alt="User B" />
              </div>
            </div>
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
        <TimeLine />
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
