import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../../../providers/ThemeProvider";
import { FaFolder, FaArrowUp, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router";

export function Header() {
  const [width, setWidth] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newWidth = e.clientX;
      if (newWidth >= 180 && newWidth <= 400) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const startResize = () => {
    setIsDragging(true);
  };

  const toggleCurrentTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      ref={headerRef}
      className={`bg-base-200 h-full relative flex flex-col ${
        isDragging ? "select-none cursor-ew-resize" : ""
      } `}
      style={{ width: `${width}px` }}
    >
      <div className="p-4">
        <h1 className="text-xl font-bold text-center">TimeWeaver</h1>
        <div className="divider"></div>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-4">
          <Link
            to={"/dashboard/projects"}
            className="btn btn-block justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary mb-3"
          >
            <FaFolder className="h-5 w-5" />
            Projects
          </Link>
          <div className="ml-4 py-2">
            <ul className="relative border-l border-dashed border-base-content/25 space-y-2">
              {[
                "TimeWeaver Redesign",
                "Mobile App Beta",
                "API Documentation",
                "User Feedback Collection",
              ]
                .slice(0, 4)
                .map((projectName, index) => (
                  <li key={index} className="relative h-9 flex items-center">
                    <span
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/8 w-2 h-2 bg-primary rounded-full"
                      style={{ left: "calc(-0.25rem + 0.5px)" }}
                    ></span>
                    <div className="w-full px-5">
                      <p className="btn btn-ghost btn-sm justify-start w-full text-base-content hover:bg-base-content/10 whitespace-nowrap overflow-hidden text-ellipsis">
                        {projectName}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="indicator w-full">
          <span className="indicator-item indicator-top indicator-end badge badge-warning text-xs p-2">
            -10%
          </span>
          <button className="btn btn-block justify-center gap-2 bg-accent">
            <FaArrowUp className="h-5 w-5" />
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src="https://picsum.photos/200/300" alt="User avatar" />
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="font-medium truncate">John Doe</p>
            <p className="text-sm opacity-70 truncate">Administrator</p>
          </div>
          <div className="dropdown dropdown-top ml-auto">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
              <FaChevronDown className="h-4 w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={toggleCurrentTheme}>
                  Switch to {theme === "light" ? "Dark" : "Light"} Mode
                </a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-primary hover:opacity-50 ${
          isDragging ? "bg-primary opacity-50" : ""
        }`}
        onMouseDown={startResize}
      ></div>
    </div>
  );
}
