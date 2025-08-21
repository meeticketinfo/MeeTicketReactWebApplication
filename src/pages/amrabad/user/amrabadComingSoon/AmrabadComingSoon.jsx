import UserLayout from "../../../../layouts/UserLayout";
import { Link } from "react-router-dom";

export default function AmrabadComingSoon() {
	return (
		<UserLayout>
			<section className="relative min-h-[70vh] flex items-center justify-center text-center">
				<div className="absolute inset-0">
					<div className="w-full h-full bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-700 opacity-90"></div>
				</div>
				<div className="relative z-10 px-6 py-16 max-w-3xl">
					<h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">Coming Soon</h1>
					<p className="mt-6 text-indigo-100 text-lg md:text-xl">
						We’re crafting an amazing experience at Amrabad Resort. Stay tuned!
					</p>
					<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
						<Link to="/amrabad-resort" className="bg-white text-[#362D86] font-bold px-6 py-3 rounded-md hover:bg-indigo-800 hover:text-white transition">
							Explore Packages
						</Link>
					</div>
				</div>
			</section>
		</UserLayout>
	);
}