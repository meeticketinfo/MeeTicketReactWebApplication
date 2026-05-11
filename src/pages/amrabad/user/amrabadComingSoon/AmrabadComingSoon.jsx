import UserLayout from "../../../../layouts/UserLayout";
import { Link } from "react-router-dom";

export default function AmrabadComingSoon() {
	return (
		<UserLayout>
			<section className="relative min-h-[70vh] flex items-center justify-center text-center">
				<div className="absolute inset-0">
					<div className="w-full h-full bg-gradient-to-b from-[#1A1F1A] via-[#262F20] to-[#394D48] opacity-90"></div>
				</div>
				<div className="relative z-10 px-6 py-16 max-w-3xl">
					<h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">Coming Soon</h1>
					<p className="mt-6 text-[#D0D7CE] text-lg md:text-xl">
						We’re crafting an amazing experience at Amrabad Resort. Stay tuned!
					</p>
					<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
						<Link to="/amrabad-resort" className="bg-[#FDFAF7] text-[#304A3A] font-bold px-6 py-3 rounded-md hover:bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] hover:text-[#FDFAF7] transition">
							Explore Packages
						</Link>
					</div>
				</div>
			</section>
		</UserLayout>
	);
}