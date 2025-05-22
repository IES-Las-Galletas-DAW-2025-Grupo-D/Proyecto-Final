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
        <div>
          <div className=" items-center  gap-8 animate-fadeIn delay-400">
            <div className="w-full text-center py-12 text-black">
                <div className="flex justify-center items-center px-4">
                  <svg
                    className="w-5 h-5 text-indigo-400 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <span className="italic font-medium text-3xl">
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
            </div>

            {/* Imagen debajo de la frase */}
            <div className="w-full px-20 py-7 pb-10">
              <img
                src="/Proyecto.PNG"
                alt="Imagen de ejemplo"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-black">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-10">Pricing Plans</h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                
                {/* Free Plan */}
                <div className="card bg-base-200 shadow-xl border border-base-300 text-black">
                  <div className="card-body">
                    <h3 className="card-title">Free</h3>
                    <p className="text-3xl font-bold">$0 <span className="text-sm">USD</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ 50 agent/chat requests per month</li>
                      <li>✅ 2,000 completions per month</li>
                      <li>✅ Access to Claude 3.5, Sonnet, GPT-4.1, and more</li>
                    </ul>
                    <div className="card-actions mt-6">
                      <button className="btn btn-primary w-full">Get Started</button>
                    </div>
                  </div>
                </div>

                {/* Pro Plan */}
                <div className="card bg-base-200 shadow-xl border-2 border-primary text-black">
                  <div className="card-body">
                    <h3 className="card-title">
                      Pro <span className="badge badge-primary">Most popular</span>
                    </h3>
                    <p className="text-3xl font-bold">$10 <span className="text-sm">/mo</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Unlimited agent mode and chats with GPT-4.1</li>
                      <li>✅ Unlimited code completions</li>
                      <li>✅ Access to Claude 3.7, o1, code review</li>
                      <li>✅ 6x premium requests vs Free</li>
                    </ul>
                    <div className="card-actions mt-6">
                      <button className="btn btn-primary w-full">Try for 30 days free</button>
                    </div>
                  </div>
                </div>

                {/* Pro+ Plan */}
                <div className="card bg-base-200 shadow-xl border border-base-300 text-black">
                  <div className="card-body">
                    <h3 className="card-title">Pro+</h3>
                    <p className="text-3xl font-bold">$39 <span className="text-sm">/mo</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Access to all models incl. GPT-4.5</li>
                      <li>✅ 30x premium requests vs Free</li>
                      <li>✅ Coding agent (preview)</li>
                    </ul>
                    <div className="card-actions mt-6">
                      <button className="btn btn-primary w-full">Get Started</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </p>
    </>
  );
}
