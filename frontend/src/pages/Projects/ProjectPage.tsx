import { useParams } from "react-router";
import { Island } from "../../components/ui/containers/section/Island";
import { TimeLine } from "../../components/timeline/TimeLine";

export function ProjectPage() {
  const { projectId } = useParams();

  return (
    <div className="flex flex-col h-full gap-5">
      <Island>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1>Project {projectId}</h1>
            {/* Cloud-like icon */}
            <svg
              className="w-5 h-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M19 17a4 4 0 1 0-7.09-2.83A3 3 0 0 0 6 16h13Z" />
              <path d="M5 17H4a4 4 0 0 1 0-8 4 4 0 0 1 1.07.14A5 5 0 0 1 19 11h1a4 4 0 0 1 0 8H5Z" />
            </svg>
          </div>
          {/* Connected users */}
          <div className="avatar-group -space-x-4">
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img src="https://picsum.photos/200" alt="User A" />
              </div>
            </div>
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img src="https://picsum.photos/200" alt="User B" />
              </div>
            </div>
          </div>
        </div>
      </Island>
      <Island className="flex-grow min-h-0">
        <TimeLine />
      </Island>
    </div>
  );
}
