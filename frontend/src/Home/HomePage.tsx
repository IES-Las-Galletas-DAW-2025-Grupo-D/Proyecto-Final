import { useEffect, useState } from "react";
import { getWelcomePhrase } from "./services/main";
import { Link, Navigate, useNavigate } from "react-router";
import { SubscriptionService } from "../services/SubscriptionService";
import { environment } from "../environments/environment";
import { useAuth } from "../providers/AuthProvider";

export function HomePage() {
	const [phrase, setPhrase] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const auth = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		getWelcomePhrase().then((data) => setPhrase(data));
	}, []);

	const handlePurchase = async (priceId: string) => {
		setIsLoading(true);

		if (!auth.isAuthenticated()) {
			navigate("/login");
			return;
		}
		const stripeToken = await SubscriptionService.getStripeToken();
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
		<>
			<div className="text-xl text-slate-300 animate-fadeIn delay-400 mb-8">
				<div>
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
									Organize your tasks and projects efficiently with TimeLines.
								</h3>
							</p>
						</div>

						<div className="flex justify-center items-center px-4 py-7 space-x-2">
							<Link
								to={"/signup"}
								className="btn bg-white text-black hover:bg-gray-200 px-4 py-5 rounded-2xl transition duration-200 px-10 py-7 text-lg"
							>
								Get started for free
							</Link>
							<Link
								to={""}
								className="btn bg-neutral text-base-100 hover:bg-base-300 px-4 py-5 rounded-2xl transition duration-200 px-10 py-7 text-lg"
							>
								See plans & pricing
							</Link>
						</div>

						{/* Imagen debajo de la frase */}
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
							<h2 className="text-5xl font-bold text-center mb-16">
								Pricing Plans
							</h2>
							<div className="grid gap-10 grid-cols-1 md:grid-cols-3">
								{/* Free Plan */}
								<div className="card bg-base-200 shadow-xl border border-base-300 text-neutral">
									<div className="card-body h-full">
										<h2 className="card-title">Free</h2>
										<p>A fast way to get started with TimeLines.</p>
										<p className="text-3xl font-bold">
											$0 <span className="text-sm">USD</span>
										</p>
										<ul className="mt-4 space-y-2 text-sm">
											<li>✅ 50 agent/chat requests per month</li>
											<li>✅ 2,000 completions per month</li>
											<li>
												✅ Access to Claude 3.5, Sonnet, GPT-4.1, and more
											</li>
										</ul>
										<div className="card-actions mt-6">
											<Link to="/signup" className="btn btn-primary w-full">
												Get Started
											</Link>
										</div>
									</div>
								</div>

								{/* Pro Plan */}
								<div className="card bg-base-200 shadow-xl border-2 border-primary text-neutral">
									<div className="card-body">
										<h2 className="card-title">
											Pro{" "}
											<span className="badge badge-primary">Most popular</span>
										</h2>
										<p>
											Unlimited completions and chats with access to more
											models.
										</p>
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
												className={`btn btn-primary w-full ${
													isLoading ? "loading" : ""
												}`}
												onClick={() =>
													handlePurchase(environment.INTERMEDIATE_PRICE_ID)
												}
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
								<div className="card bg-base-200 shadow-xl border border-base-300 text-neutral">
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
												className={`btn btn-primary w-full ${
													isLoading ? "loading" : ""
												}`}
												onClick={() =>
													handlePurchase(environment.BUSINESS_PRICE_ID)
												}
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
				</div>
			</div>
		</>
	);
}
