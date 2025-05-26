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
                0€ <span className="text-sm"></span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✅ up to 3 members at a time</li>
                <li>✅ all features, for free!</li>
                <li>Personal use only</li>
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
              <p>The best for small and even medium teams.</p>
              <p className="text-3xl font-bold">
                12,99€ <span className="text-sm">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✅ Up to 10 slots per project!</li>
                <li>✅ Monetize your work - charge clients</li>
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
              <p>Maximum flexibility and capacity.</p>
              <p className="text-3xl font-bold">
                59,99€ <span className="text-sm">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✅ Unlimited slots! Unlimited Projects!</li>
                <li>✅ Enterprise License</li>
                <li>✅ Advanced security and encryption</li>
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
