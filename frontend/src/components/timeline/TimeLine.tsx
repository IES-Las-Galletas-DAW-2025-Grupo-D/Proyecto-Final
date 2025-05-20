import { useEffect, useRef, useState } from "react";
import { DataItem, Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";

type TimelineItemData = DataItem & {
  details: string;
};

const timelineItems: TimelineItemData[] = [
  {
    content: "Milestone A",
    start: new Date(2025, 4, 20),
    details: "More info about Milestone A.",
  },
  {
    content: "Milestone B",
    start: new Date(2025, 4, 24),
    details: "More info about Milestone B.",
  },
];

export function TimeLine() {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItemData | null>(
    null
  );

  useEffect(() => {
    if (refContainer.current && !timelineRef.current) {
      const instance = new Timeline(refContainer.current, timelineItems, {
        selectable: true,
        editable: true,
      });
      instance.on("select", ({ items }) => {
        console.log(items);

        if (items.length === 0) {
          setSelectedItem(null);
          return;
        }

        // @ts-expect-error itemsData exists at runtime but not in type definitions
        const found = instance.itemsData.get(items[0]) as TimelineItemData;
        if (found) {
          setSelectedItem(found);
          modalRef.current?.showModal();
        }
      });
      timelineRef.current = instance;
    }
    return () => {
      timelineRef.current?.destroy();
      timelineRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-[300px]">
      <div ref={refContainer} className="h-full" />
      {selectedItem && (
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <form method="dialog" className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-2">{selectedItem.content}</h3>
            <p className="whitespace-pre-wrap">{selectedItem.details}</p>
            <div className="modal-action">
              <button className="btn">Close</button>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
