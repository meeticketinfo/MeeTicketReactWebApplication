import React, { useEffect, useState } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { useUserBookingStore } from "../../../../store/amrabad/user/userBookingStore";
import PackageShimmer from "../../shimmer/PackageShimmer";

const Packages = () => {
  const { fetchUserPackages, isUserPackagesLoading, GetUserPackages } = useUserBookingStore();
  const [activePackages, setActivePackages] = useState([]);
  useEffect(() => {
    fetchUserPackages();
  }, []);

  useEffect(() => {
    setActivePackages(GetUserPackages.filter((item) => item.isActive));
  }, [GetUserPackages]);

  return (
    <UserLayout>
      <div className="grid grid-cols-6 text-center gap-1 bg-[#F2EDE7]">
        {isUserPackagesLoading ? (
          <>
            <div className="col-span-6 md:col-span-3 w-full">
              <PackageShimmer variant="full" />
            </div>
            <div className="col-span-6 md:col-span-3 w-full">
              <PackageShimmer variant="full" />
            </div>
          </>
        ) : GetUserPackages && GetUserPackages.length > 0 ? (
          // Show actual package content when loaded
          activePackages.map((item, index) => (
            <div className={`col-span-6 ${activePackages.length % 2 !== 0 && activePackages.length - 1 === index ? "md:col-span-6" : "md:col-span-3"}`} key={index}>
              <div className="group flex flex-col content-center  items-center justify-center h-[70vh] min-h-full relative p-10 overflow-hidden">
                <img
                  src={item?.packageImages[0]?.imageUrl}
                  alt="Packages"
                  className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Overlay: smooth gradient + green tint + vignette + soft center glow */}
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.55)_35%,rgba(0,0,0,0.2)_65%,transparent_100%)]"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,31,26,0.85)_0%,rgba(26,46,40,0.35)_30%,transparent_60%)]"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_0%,rgba(0,0,0,0.35)_100%)]"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_85%,rgba(255,255,255,0.06)_0%,transparent_60%)]"
                  aria-hidden
                />
                <div className="relative z-10 max-w-[350px] flex flex-col gap-6 justify-center items-center text-center">
                  <h4 className="text-white text-2xl md:text-3xl font-bold capitalize drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    {item.packageName}
                  </h4>
                  <Link
                    to={`/amrabad-resort/packages/${item.packageId}`}
                    className="bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] px-6 py-3 rounded-lg hover:opacity-95 hover:shadow-[0_8px_24px_rgba(48,74,58,0.4)] transition-all duration-300 text-xl font-bold"
                  >
                    BOOK NOW
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show empty state with compact loading
          <div className="col-span-6 flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <PackageShimmer variant="compact" />
              <p className="text-gray-500 mt-4">No packages available at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Packages;
