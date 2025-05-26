import { Link } from "react-router";
import { UpgradePage } from "../pages/upgrade/UpgradePage";

export function HomePage() {
  return (
    <>
      <div className="text-xl text-base-content animate-fadeIn delay-400 mb-8">
        <div className="items-center gap-8 animate-fadeIn delay-400">
          {/* Título principal */}
          <div className="w-full text-center py-7 text-base-content">
            <div className="flex justify-center items-center px-4">
              <h1 className="text-5xl sm:text-6xl font-bold">
                <span className="text-base-content">Prepared for </span>{" "}
                {/* Updated class */}
                <span className="bg-gradient-to-r from-info via-primary to-secondary bg-clip-text text-transparent">
                  All
                </span>
                <span className="text-base-content"> types of projects</span>{" "}
                {/* Updated class */}
              </h1>
            </div>
          </div>

          {/* Subtítulo */}
          <div className="text-center py-7">
            {/* <p> wrapping h3 removed for semantic correctness, h3 is a block element */}
            <h3 className="text-lg sm:text-3xl font-bold text-base-content">
              Organize your tasks and projects efficiently with TimeWeaver.{" "}
              {/* Updated text */}
            </h3>
            {/* </p> */}
          </div>

          {/* Botones */}
          <div className="flex justify-center items-center px-4 py-7 space-x-2">
            <Link
              to={"/signup"}
              className="btn bg-base-100 text-base-content hover:bg-base-200 px-10 py-7 text-lg rounded-2xl transition duration-200"
            >
              Get started for free
            </Link>
            <Link
              to={"/pricing"}
              className="btn bg-neutral text-neutral-content hover:bg-neutral-focus px-10 py-7 text-lg rounded-2xl transition duration-200"
            >
              See plans & pricing
            </Link>
          </div>

          {/* Imagen debajo de la frase */}
          <div className="w-full px-10 py-10 pb-10">
            <img
              src="/Proyecto.PNG"
              alt="Imagen de ejemplo"
              className="h-auto object-cover mx-auto shadow-2xl rounded-2xl border-2 border-base-content"
            />
          </div>
        </div>

        {/* Sección de Precios */}
        <UpgradePage />
      </div>
    </>
  );
}
