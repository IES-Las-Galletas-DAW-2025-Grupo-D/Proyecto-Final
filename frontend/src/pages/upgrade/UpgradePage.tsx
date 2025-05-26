import { useState } from "react";
import { Link } from "react-router";
import { SubscriptionService } from "../../services/SubscriptionService";

export function UpgradePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (priceId: string) => {
    setIsLoading(true);
    try {
      const { url } = await SubscriptionService.createCheckoutSession(priceId);
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout process. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 sm:px-12 lg:px-24 text-base-content text-lg">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16">
          Choose Your Plan
        </h2>
        <div className="grid gap-10 grid-cols-1 md:grid-cols-3">
          {/* Free Plan */}
          <div className="card bg-base-200 shadow-xl border border-base-300 text-base-content">
            <div className="card-body h-full">
              <h2 className="card-title">Free</h2>
              <p>A fast way to get started with TimeLines.</p>
              <p className="text-3xl font-bold">
                $0 <span className="text-sm">USD</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✅ 50 agent/chat requests per month</li>
                <li>✅ 2,000 completions per month</li>
                <li>✅ Access to Claude 3.5, Sonnet, GPT-4.1, and more</li>
              </ul>
              <div className="card-actions mt-6">
                <Link to="/signup" className="btn btn-primary w-full">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="card bg-base-200 shadow-xl border-2 border-primary text-base-content">
            <div className="card-body">
              <h2 className="card-title">
                Pro <span className="badge badge-primary">Most popular</span>
              </h2>
              <p>Unlimited completions and chats with access to more models.</p>
              <p className="text-3xl font-bold">
                $10 <span className="text-sm">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✅ Unlimited agent mode and chats with GPT-4.1</li>
                <li>✅ Unlimited code completions</li>
                <li>✅ Access to Claude 3.7, o1, code review</li>
                <li>✅ 6x premium requests vs Free</li>
              </ul>
              <div className="card-actions mt-6">
                <button
                  className={`btn btn-primary w-full`}
                  onClick={() => handlePurchase("intermediatePriceId")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Pro+ Plan */}
          <div className="card bg-base-200 shadow-xl border border-base-300 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Pro+</h2>
              <p>Maximum flexibility and model choice.</p>
              <p className="text-3xl font-bold">
                $39 <span className="text-sm">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✅ Access to all models incl. GPT-4.5</li>
                <li>✅ 30x premium requests vs Free</li>
                <li>✅ Coding agent (preview)</li>
              </ul>
              <div className="card-actions mt-6">
                <button
                  className={`btn btn-primary w-full`}
                  onClick={() => handlePurchase("businessPriceId")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
