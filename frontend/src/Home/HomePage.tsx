// import { useEffect, useState } from "react";
// import { getWelcomePhrase } from "./services/main";
import { Link } from "react-router";

export function HomePage() {
  // const [phrase, setPhrase] = useState("");

  // useEffect(() => {
  //   getWelcomePhrase().then((data) => setPhrase(data));
  // }, []);

  return (
    <>
        <div className="text-xl text-slate-300 animate-fadeIn delay-400 mb-8">
          <div className=" items-center  gap-8 animate-fadeIn delay-400">
            <div className="w-full text-center py-7 text-black">
                <div className="flex justify-center items-center px-4">
                    <h1 className="text-5xl sm:text-6xl font-bold">
                      <span className="text-black">Prepared for </span>
                      <span className="bg-gradient-to-r from-info via-primary to-secondary bg-clip-text text-transparent">
                         All 
                      </span>
                      <span className="text-black"> types of projects</span>
                    </h1>
              </div>
            </div>

            <div className="text-center py-7"> 
              <p>
                <h3 className="text-lg sm:text-3xl font-bold text-base-800">
                  Organize your tasks and projects efficiently with TimeWeaver.
                </h3>
              </p>
            </div>

            <div className="flex justify-center items-center px-4 py-7 space-x-2">
              <Link to={"/signup"} className="btn bg-white text-black hover:bg-gray-200 px-4 py-5 rounded-2xl transition duration-200 px-10 py-7 text-lg">Get started for free</Link>
              <Link to={""}  className="btn bg-neutral text-base-100 hover:bg-base-300 px-4 py-5 rounded-2xl transition duration-200 px-10 py-7 text-lg">See plans & pricing</Link>
            </div>

            <div className="w-full px-10 py-10 pb-10">
              <img
                src="/Proyecto.PNG"
                alt="Imagen de ejemplo"
                className="h-auto object-cover mx-auto shadow-2xl rounded-2xl border-2 border-content"
              />
            </div>
          </div>

          <div className="min-h-screen py-24 px-6 sm:px-12 lg:px-24 text-neutral text-lg">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-center mb-16">Pricing Plans</h2>
              <div className="grid gap-10 grid-cols-1 md:grid-cols-3">

                {/* Free Plan */}
                <div className="card bg-base-200 shadow-xl border border-base-300 text-neutral">
                  <div className="card-body h-full">
                    <h2 className="card-title">Free</h2>
                    <p>Ideal for individual use or small groups.</p>
                    <p className="text-3xl font-bold">0 <span className="text-sm">EUR</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Core features available</li>
                      <li>✅ Up to 3 members per workspace</li>
                    </ul>
                    <div className="card-actions mt-6">
                      <button className="btn btn-primary w-full">Start for Free</button>
                    </div>
                  </div>
                </div>

                {/* Intermediate Plan */}
                <div className="card bg-base-200 shadow-xl border-2 border-primary text-neutral">
                  <div className="card-body">
                    <h2 className="card-title">
                      Intermediate <span className="badge badge-primary">Most Popular</span>
                    </h2>
                    <p>More tools for small teams.</p>
                    <p className="text-3xl font-bold">€9.99 <span className="text-sm">/month</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ All features from the free version</li>
                      <li>✅ Additional tools for collaboration</li>
                      <li>✅ Up to 10 members per workspace</li>
                    </ul>
                    <div className="card-actions mt-6">
                      <button className="btn btn-primary w-full">Try Now</button>
                    </div>
                  </div>
                </div>

                {/* Business Plan */}
                <div className="card bg-base-200 shadow-xl border border-base-300 text-neutral">
                  <div className="card-body">
                    <h2 className="card-title">Business</h2>
                    <p>Comprehensive solution for companies.</p>
                    <p className="text-3xl font-bold">€59.99 <span className="text-sm">/month</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ All features from the Pro plan</li>
                      <li>✅ Unlimited members per workspace</li>
                      <li>✅ Personalized support for businesses</li>
                    </ul>
                    <div className="card-actions mt-6">
                      <button className="btn btn-primary w-full">Try Now</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
    </>
  );
}
