import React, { useEffect } from "react";
import { Link } from "react-router";
import ReactDOMServer from "react-dom/server";
import { FiAlertTriangle } from "react-icons/fi";

export const NotFoundErrorPage: React.FC = () => {
  useEffect(() => {
    const dots = document.querySelectorAll(".timeline-dot");
    const paths = document.querySelectorAll(".timeline-path");
    const dotInitialContent = ["1", "2", "3", ""];

    const errorIconHTML = ReactDOMServer.renderToStaticMarkup(
      <FiAlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
    );

    dots.forEach((dot, index) => {
      const dotElement = dot as HTMLElement;
      setTimeout(() => {
        dotElement.classList.remove("bg-base-300");
        dotElement.textContent = dotInitialContent[index];

        if (index < dots.length - 1) {
          dotElement.classList.add(
            "bg-primary",
            "text-primary-content",
            "animate-ping"
          );
        } else {
          dotElement.classList.add("bg-error", "text-error-content");
          dotElement.innerHTML = errorIconHTML;
        }

        if (index < paths.length) {
          const pathElement = paths[index] as HTMLElement;
          setTimeout(() => {
            dotElement.classList.remove("animate-ping");

            pathElement.classList.remove("bg-base-300", "scale-x-0");
            if (index < paths.length - 1) {
              pathElement.classList.add("bg-primary", "scale-x-100");
            } else {
              pathElement.classList.add("bg-error", "scale-x-50", "opacity-70");

              const lastDot = dots[index + 1] as HTMLElement;
              lastDot.classList.remove(
                "bg-base-300",
                "bg-primary",
                "text-primary-content",
                "animate-ping"
              );
              lastDot.classList.add("bg-error", "text-error-content");
              lastDot.innerHTML = errorIconHTML;
            }
          }, 600);
        } else {
          dotElement.classList.remove("animate-ping");
        }
      }, index * 500);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4 sm:p-6 text-base-content">
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold text-error">
          404
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl mt-3 sm:mt-4 font-semibold">
          Page Not Found
        </p>
        <p className="text-sm sm:text-base mt-2 text-base-content/80">
          It seems the timeline took an unexpected turn.
        </p>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-10 sm:mb-16 px-2">
        <ul className="flex items-start">
          <li className="flex flex-col items-center px-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full timeline-dot bg-base-300 flex items-center justify-center text-xs sm:text-sm font-medium text-base-content transition-colors duration-300"></div>
            <p className="mt-2 text-[10px] sm:text-xs text-center">Searching</p>
          </li>
          <li className="flex-1 pt-[10px] sm:pt-[12px] px-1">
            <div className="h-1 timeline-path bg-base-300 w-full origin-left transition-all duration-500 ease-in-out transform scale-x-0"></div>
          </li>
          <li className="flex flex-col items-center px-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full timeline-dot bg-base-300 flex items-center justify-center text-xs sm:text-sm font-medium text-base-content transition-colors duration-300"></div>
            <p className="mt-2 text-[10px] sm:text-xs text-center">Routing</p>
          </li>
          <li className="flex-1 pt-[10px] sm:pt-[12px] px-1">
            <div className="h-1 timeline-path bg-base-300 w-full origin-left transition-all duration-500 ease-in-out transform scale-x-0"></div>
          </li>
          <li className="flex flex-col items-center px-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full timeline-dot bg-base-300 flex items-center justify-center text-xs sm:text-sm font-medium text-base-content transition-colors duration-300"></div>
            <p className="mt-2 text-[10px] sm:text-xs text-center">
              Connecting
            </p>
          </li>
          <li className="flex-1 pt-[10px] sm:pt-[12px] px-1">
            <div className="h-1 timeline-path bg-base-300 w-full origin-left transition-all duration-500 ease-in-out transform scale-x-0"></div>
          </li>
          <li className="flex flex-col items-center px-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full timeline-dot bg-base-300 flex items-center justify-center text-xs sm:text-sm font-medium text-base-content transition-colors duration-300"></div>
            <p className="mt-2 text-[10px] sm:text-xs text-center text-error font-semibold">
              Lost!
            </p>
          </li>
        </ul>
      </div>

      <Link to="/" className="btn btn-primary btn-md sm:btn-lg">
        Back to Timelines
      </Link>
    </div>
  );
};

export default NotFoundErrorPage;
