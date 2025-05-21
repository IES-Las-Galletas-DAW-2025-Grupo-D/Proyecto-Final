import { useEffect, useState } from "react";
import { getWelcomePhrase } from "./services/main";

export function HomePage() {
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    getWelcomePhrase().then((data) => setPhrase(data));
  }, []);

  return (
    <>
      <p className="text-xl text-slate-300 animate-fadeIn delay-400 mb-8">
        <div className="flex items-center justify-between gap-8 animate-fadeIn delay-400">
          {/* Frase a la izquierda */}
          <div className="flex items-center max-w-md px-20">
            <svg
              className="w-5 h-5 text-indigo-400 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <span className="italic font-medium">
              Preparados para todo tipo de proyectos
            </span>
            <svg
              className="w-5 h-5 text-indigo-400 ml-2 transform rotate-180"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          {/* Imagen a la derecha */}
          <div className="w-4/6 px-20">
            <img
              src="../../../timeline-example-color.png"
              alt="Imagen de ejemplo"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </p>
    </>
  );
}
