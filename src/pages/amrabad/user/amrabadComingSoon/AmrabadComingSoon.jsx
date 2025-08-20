import UserLayout from "../../../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AmrabadComingSoon() {
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	useEffect(() => {
		const launchAt = new Date();
		launchAt.setDate(launchAt.getDate() + 14);

		const tick = () => {
			const now = new Date();
			const diffMs = Math.max(0, launchAt.getTime() - now.getTime());
			const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
			const seconds = Math.floor((diffMs / 1000) % 60);
			setTimeLeft({ days, hours, minutes, seconds });
		};

		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	const format = (n) => String(n).padStart(2, "0");

	return (
		<UserLayout>
			<section className="relative min-h-[70vh] flex items-center justify-center">
				{/* Background gradient */}
				<div className="absolute inset-0">
					<div className="w-full h-full bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-700" />
				</div>

				{/* Decorative blurred blobs */}
				<div className="pointer-events-none absolute -top-20 -left-10 w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-purple-500/30 blur-3xl" />

				<div className="relative z-10 w-full max-w-4xl px-6">
					<div className="mx-auto backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl px-8 py-10 text-center">
						<p className="text-indigo-200 uppercase tracking-[0.25em] text-xs md:text-sm">Amrabad Resort</p>
						<h1 className="mt-3 text-white text-4xl md:text-6xl font-extrabold tracking-tight">Coming Soon</h1>
						<p className="mt-5 text-indigo-100 text-base md:text-lg max-w-2xl mx-auto">
							We’re crafting an amazing booking experience. Get ready to explore serene stays, curated packages, and seamless reservations.
						</p>

						{/* Countdown */}
						<div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div className="rounded-xl bg-white/10 border border-white/20 py-4">
								<div className="text-3xl md:text-4xl font-bold text-white">{format(timeLeft.days)}</div>
								<div className="text-indigo-200 text-xs md:text-sm mt-1">Days</div>
							</div>
							<div className="rounded-xl bg-white/10 border border-white/20 py-4">
								<div className="text-3xl md:text-4xl font-bold text-white">{format(timeLeft.hours)}</div>
								<div className="text-indigo-200 text-xs md:text-sm mt-1">Hours</div>
							</div>
							<div className="rounded-xl bg-white/10 border border-white/20 py-4">
								<div className="text-3xl md:text-4xl font-bold text-white">{format(timeLeft.minutes)}</div>
								<div className="text-indigo-200 text-xs md:text-sm mt-1">Minutes</div>
							</div>
							<div className="rounded-xl bg-white/10 border border-white/20 py-4">
								<div className="text-3xl md:text-4xl font-bold text-white">{format(timeLeft.seconds)}</div>
								<div className="text-indigo-200 text-xs md:text-sm mt-1">Seconds</div>
							</div>
						</div>

						{/* CTAs */}
						<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								to="/amrabad-resort"
								className="bg-white text-[#362D86] font-bold px-6 py-3 rounded-md hover:bg-indigo-800 hover:text-white transition"
							>
								Explore Packages
							</Link>
							<Link
								to="/"
								className="bg-transparent text-white border border-white/60 px-6 py-3 rounded-md hover:bg-white/10 transition"
							>
								Back to Home
							</Link>
						</div>
					</div>
				</div>
			</section>
		</UserLayout>
	);
}