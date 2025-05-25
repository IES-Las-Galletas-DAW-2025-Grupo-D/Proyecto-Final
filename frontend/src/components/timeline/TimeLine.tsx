import { useEffect, useRef, useState } from "react";
import {
  DataSet,
  IdType,
  Timeline,
  TimelineOptions,
} from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import TimelineWebSocketService from "../../services/timeline/WebSocket";
import { TimelineWSEvent } from "../../types/timeline";

type TimeLineProps = {
  projectId?: number; // Keep for context if needed, though primary ID is string from service
  eventsData: DataSet<TimelineWSEvent>; // Use TimelineWSEvent from WebSocket service
  timelineService: TimelineWebSocketService | null; // WebSocket service instance
};

export function TimeLine({
  projectId,
  eventsData,
  timelineService,
}: TimeLineProps) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineWSEvent | null>(
    null
  );

  useEffect(() => {
    let timelineInstance: Timeline | null = null;

    if (refContainer.current && eventsData && !timelineRef.current) {
      const options: TimelineOptions = {
        selectable: true,
        editable: {
          add: true, // allow adding new items by double tapping
          updateTime: true, // allow dragging items horizontally
          updateGroup: false,
          remove: true, // allow removing items by clicking the delete button
        },
        // snap: (date, scale, step) => { // Optional: custom snapping
        //   const hour = 60 * 60 * 1000;
        //   return Math.round(date.valueOf() / hour) * hour;
        // }
      };

      timelineInstance = new Timeline(
        refContainer.current,
        eventsData,
        options
      );
      timelineRef.current = timelineInstance;

      timelineInstance.on("select", ({ items }) => {
        console.log(items);

        if (items.length === 0) {
          setSelectedItem(null);
          return;
        }

        const found = eventsData.get(items[0]) as unknown as TimelineWSEvent;
        if (found) {
          setSelectedItem(found);
          modalRef.current?.showModal();
        }
      });

      // Listen to DataSet changes triggered by user UI interactions
      // These will then be sent to the server via the WebSocket service

      const handleAdd = (
        _event: string,
        properties: { items: IdType[] } | null
      ) => {
        if (timelineService && properties && properties.items) {
          properties.items.forEach((itemId) => {
            const newItemData = eventsData.get(
              itemId
            ) as TimelineWSEvent | null;
            if (newItemData) {
              // When vis-timeline adds an item, it might have a temporary client-generated ID.
              // The server should assign the final ID.
              const { id, ...dataToSend } = newItemData; // Exclude temporary ID
              console.log(
                "TimeLine: User added item, requesting server add:",
                dataToSend
              );
              timelineService.requestAddTimelineEvent(
                dataToSend as Omit<TimelineWSEvent, "id">
              );
              // The item with the temporary ID might be removed/updated once the server broadcasts the confirmed item.
              // For a smoother UX, you might leave the temporary item and have the server's broadcast update it if IDs match,
              // or remove the temp and add the new one. This depends on server implementation.
            }
          });
        }
      };

      const handleUpdate = (
        _event: string,
        properties: { items: IdType[]; data: Partial<TimelineWSEvent>[] } | null
      ) => {
        if (
          timelineService &&
          properties &&
          properties.items &&
          properties.data
        ) {
          properties.items.forEach((itemId) => {
            const updatedItemData = eventsData.get(
              itemId
            ) as TimelineWSEvent | null; // Get the full updated item
            if (updatedItemData) {
              console.log(
                "TimeLine: User updated item, requesting server update:",
                updatedItemData
              );
              timelineService.requestUpdateTimelineEvent(updatedItemData);
            }
          });
        }
      };

      const handleRemove = (
        _event: string,
        properties: { items: IdType[] } | null
      ) => {
        if (timelineService && properties && properties.items) {
          properties.items.forEach((itemId) => {
            console.log(
              "TimeLine: User removed item, requesting server remove, ID:",
              itemId
            );
            timelineService.requestRemoveTimelineEvent(itemId);
          });
        }
      };

      eventsData.on("add", handleAdd);
      eventsData.on("update", handleUpdate);
      eventsData.on("remove", handleRemove);
    }

    console.log(
      "Timeline initialized for project:",
      projectId,
      "Service available:",
      !!timelineService
    );

    return () => {
      if (timelineInstance) {
        // Clean up DataSet listeners when component unmounts or timeline is re-created
        // eventsData.off("add", handleAdd);
        // eventsData.off("update", handleUpdate);
        // eventsData.off("remove", handleRemove);
        timelineInstance.destroy();
        timelineRef.current = null;
        timelineService?.close();
        console.log("Timeline destroyed for project:", projectId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsData, timelineService]); // projectId is for logging/context, not direct timeline re-init

  return (
    <div className="w-full h-[300px]">
      <div ref={refContainer} className="h-full" />
      {selectedItem && (
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-2">{selectedItem.content}</h3>
            <p className="whitespace-pre-wrap">{selectedItem.details}</p>
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
      )}
    </div>
  );
}
