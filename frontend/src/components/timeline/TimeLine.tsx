import { useEffect, useRef, useState, useCallback } from "react";
import {
  DataSet,
  IdType,
  Timeline,
  TimelineOptions,
} from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import { TimelineWSEvent, WsMessagePayloadAction } from "../../types/timeline";
import { debounce } from "../../utils/debounce";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SERVER_SENDER_ID = "timeline-server-event";

type TimeLineProps = {
  projectId?: number | string;
  eventsData: DataSet<TimelineWSEvent>;
  sendTimelineEventToServer: (
    type: string,
    payload: WsMessagePayloadAction
  ) => void;
};

export function TimeLine({
  projectId,
  eventsData,
  sendTimelineEventToServer,
}: TimeLineProps) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineWSEvent | null>(
    null
  );
  const selectedItemRef = useRef<TimelineWSEvent | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [isEditingContent, setIsEditingContent] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    selectedItemRef.current = selectedItem;
  }, [selectedItem]);

  const handleModalClose = () => {
    setSelectedItem(null);
    setIsEditingContent(false);
    setSaveStatus("");
    setIsPreviewMode(false);
  };

  const performSave = useCallback(
    (currentContent: string) => {
      if (!selectedItemRef.current) return;

      const trimmedContent = currentContent.trim();
      if (!trimmedContent) {
        setSaveStatus("Event name cannot be empty.");
        setTimeout(() => {
          setSaveStatus((prevStatus) =>
            prevStatus === "Event name cannot be empty." ? "" : prevStatus
          );
        }, 2000);
        return;
      }

      const baseItem = selectedItemRef.current;
      const updatedEvent: TimelineWSEvent = {
        ...baseItem,
        content: trimmedContent,
      };

      setSaveStatus("Saving...");
      sendTimelineEventToServer("update", {
        data: updatedEvent,
        timestamp: Date.now(),
      });
      console.log(
        "TimeLine: Debounced save, item content update requested:",
        updatedEvent
      );
      setTimeout(() => {
        setSaveStatus("Saved!");
        setTimeout(() => {
          setSaveStatus((prevStatus) =>
            prevStatus === "Saved!" ? "" : prevStatus
          );
        }, 1500);
      }, 700);
    },
    [sendTimelineEventToServer]
  );

  const debouncedSave = useCallback(debounce(performSave, 1200), [performSave]);

  const performSaveDetails = useCallback(
    (detailsContentToSave: string) => {
      if (!selectedItemRef.current) {
        console.warn(
          "performSaveDetails called but selectedItemRef.current is null"
        );
        return;
      }

      const baseItem = selectedItemRef.current;
      const updatedEvent: TimelineWSEvent = {
        ...baseItem,
        id: baseItem.id,
        details: detailsContentToSave,
      };

      setSaveStatus("Saving details...");
      sendTimelineEventToServer("update", {
        data: updatedEvent,
        timestamp: Date.now(),
      });
      console.log(
        "TimeLine: Debounced save, item details update requested:",
        updatedEvent
      );
      setTimeout(() => {
        setSaveStatus("Details saved!");
        setTimeout(() => {
          setSaveStatus((prevStatus) =>
            prevStatus === "Details saved!" ? "" : prevStatus
          );
        }, 1500);
      }, 700);
    },
    [sendTimelineEventToServer]
  );

  const debouncedSaveDetails = useCallback(debounce(performSaveDetails, 1200), [
    performSaveDetails,
  ]);

  const handleEditedContentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newContent = e.target.value;
    setEditedContent(newContent);
    if (selectedItemRef.current) {
      setSaveStatus("");
      debouncedSave(newContent);
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDetails = e.target.value;

    setSelectedItem((prev) => (prev ? { ...prev, details: newDetails } : null));

    if (selectedItemRef.current) {
      setSaveStatus("");
      debouncedSaveDetails(newDetails);
    }
  };

  useEffect(() => {
    if (isEditingContent && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingContent]);

  useEffect(() => {
    let timelineInstance: Timeline | null = null;

    const handleAdd = (
      _event: string,
      properties: { items: IdType[] } | null,
      senderId: IdType | null
    ) => {
      if (senderId === SERVER_SENDER_ID) {
        console.log("TimeLine: Add event ignored, originated from server.");
        return;
      }
      if (properties && properties.items) {
        properties.items.forEach((itemId) => {
          const newItemData = eventsData.get(itemId) as TimelineWSEvent | null;
          if (newItemData) {
            const payload = {
              ...newItemData,
              content: newItemData.content || `Event ${Date.now()}`,
            };
            console.log(
              "TimeLine: User added item via UI, requesting server add:",
              payload
            );
            sendTimelineEventToServer("add", {
              data: payload as TimelineWSEvent,
              timestamp: Date.now(),
            });
          }
        });
      }
    };

    const handleUpdate = (
      _event: string,
      properties: {
        items: IdType[];
        data: Partial<TimelineWSEvent>[];
      } | null,
      senderId: IdType | null
    ) => {
      if (senderId === SERVER_SENDER_ID) {
        console.log("TimeLine: Update event ignored, originated from server.");
        return;
      }
      if (properties && properties.items && properties.data) {
        properties.items.forEach((itemId) => {
          const updatedItemData = eventsData.get(
            itemId
          ) as TimelineWSEvent | null;
          if (updatedItemData) {
            console.log(
              "TimeLine: User updated item via UI (drag/resize), requesting server update:",
              updatedItemData
            );

            sendTimelineEventToServer("update", {
              data: updatedItemData as TimelineWSEvent,
              timestamp: Date.now(),
            });
          }
        });
      }
    };

    const handleRemove = (
      _event: string,
      properties: { items: IdType[] } | null,
      senderId: IdType | null
    ) => {
      if (senderId === SERVER_SENDER_ID) {
        console.log("TimeLine: Remove event ignored, originated from server.");
        return;
      }
      if (properties && properties.items) {
        properties.items.forEach((itemId) => {
          console.log(
            "TimeLine: User removed item via UI, requesting server remove, ID:",
            itemId
          );
          sendTimelineEventToServer("delete", {
            data: { id: itemId } as { id: IdType },
            timestamp: Date.now(),
          });
        });
      }
    };

    let previouslySelectedItem: TimelineWSEvent | null = null;

    const onSelect = ({ items }: { items: IdType[] }) => {
      if (items.length > 0) {
        const itemId = items[0];
        const foundItem = eventsData.get(itemId) as TimelineWSEvent | null;
        if (foundItem) {
          setSelectedItem(foundItem);
          setEditedContent(foundItem.content || "");

          setIsEditingContent(false);
          setSaveStatus("");
          setIsPreviewMode(false);

          if (previouslySelectedItem !== foundItem) {
            previouslySelectedItem = foundItem;

            if (modalRef.current && !modalRef.current.open) {
            }
            return;
          } else {
            previouslySelectedItem = null;
          }

          if (modalRef.current && !modalRef.current.open) {
            modalRef.current.showModal();
          }
        } else {
          if (modalRef.current?.open) modalRef.current.close();
          else setSelectedItem(null);
        }
      } else {
        if (modalRef.current?.open) {
          modalRef.current.close();
        } else {
          setSelectedItem(null);
        }
      }
    };

    if (refContainer.current && eventsData && !timelineRef.current) {
      const options: TimelineOptions = {
        selectable: true,
        editable: {
          add: true,
          updateTime: true,
          updateGroup: false,
          remove: true,
        },
        locale: "en",
      };

      timelineInstance = new Timeline(
        refContainer.current,
        eventsData,
        options
      );
      timelineRef.current = timelineInstance;

      timelineInstance.on("select", onSelect);
      eventsData.on("add", handleAdd);
      eventsData.on("update", handleUpdate);
      eventsData.on("remove", handleRemove);

      console.log("Timeline initialized for project:", projectId);
    }

    return () => {
      if (timelineRef.current) {
        eventsData.off("add", handleAdd);
        eventsData.off("update", handleUpdate);
        eventsData.off("remove", handleRemove);

        timelineRef.current.destroy();
        timelineRef.current = null;
        console.log("Timeline destroyed for project:", projectId);
      }
      debouncedSave.cancel?.();
      debouncedSaveDetails.cancel?.();
    };
  }, []);

  return (
    <div className="w-full h-[300px]">
      <div ref={refContainer} className="h-full" />
      {selectedItem && (
        <dialog
          ref={modalRef}
          className="modal modal-bottom sm:modal-middle"
          onClose={handleModalClose}
        >
          <div className="modal-box w-11/12 max-w-2xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <div className="mb-3">
              {isEditingContent ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editedContent}
                  onChange={handleEditedContentChange}
                  onBlur={() => {
                    setIsEditingContent(false);
                    if (
                      editedContent.trim() &&
                      editedContent !== selectedItem.content
                    ) {
                      performSave(editedContent);
                    } else if (!editedContent.trim()) {
                      setEditedContent(selectedItem.content || "");
                      setSaveStatus("Event name cannot be empty.");
                      setTimeout(
                        () =>
                          setSaveStatus((prev) =>
                            prev === "Event name cannot be empty." ? "" : prev
                          ),
                        2000
                      );
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setIsEditingContent(false);
                      if (editedContent.trim()) {
                        performSave(editedContent);
                      } else {
                        setEditedContent(selectedItem.content || "");
                        setSaveStatus("Event name cannot be empty.");
                        setTimeout(
                          () =>
                            setSaveStatus((prev) =>
                              prev === "Event name cannot be empty." ? "" : prev
                            ),
                          2000
                        );
                      }
                    } else if (e.key === "Escape") {
                      setIsEditingContent(false);
                      setEditedContent(selectedItem.content || "");
                      setSaveStatus("");
                      debouncedSave.cancel?.();
                    }
                  }}
                  className="input input-bordered w-full text-lg font-bold"
                  placeholder="Enter event name"
                />
              ) : (
                <h3
                  className="font-bold text-lg p-2 -m-2 rounded hover:bg-base-200 focus:bg-base-200 focus:outline-none cursor-pointer"
                  onClick={() => setIsEditingContent(true)}
                  onFocus={() => setIsEditingContent(true)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Event name: ${
                    editedContent || "Unnamed Event"
                  }. Click or press Enter to edit.`}
                >
                  {editedContent || "Unnamed Event"}
                </h3>
              )}
              {saveStatus && (
                <p
                  className={`text-xs mt-1 ${
                    saveStatus.includes("empty")
                      ? "text-error"
                      : saveStatus.includes("Saving")
                      ? "text-info"
                      : saveStatus.includes("saved") ||
                        saveStatus.includes("Saved")
                      ? "text-success"
                      : "text-base-content/70"
                  }`}
                >
                  {saveStatus}
                </p>
              )}
            </div>

            <div className="py-2">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-base-content/70">Details:</p>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  {isPreviewMode ? "Edit" : "Preview"}
                </button>
              </div>
              {isPreviewMode ? (
                <div className="prose max-w-none p-2 border border-base-300 rounded-md bg-base-200 min-h-[10rem]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedItem.details || "*No details provided.*"}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  className="textarea textarea-bordered w-full h-40"
                  value={selectedItem.details || ""}
                  onChange={handleDetailsChange}
                  placeholder="Enter event details (Markdown supported)"
                />
              )}
            </div>
            <div className="modal-action mt-4">
              <form method="dialog" className="flex gap-2 w-full justify-end">
                <button className="btn btn-ghost">Close</button>
              </form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
