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
              <div className="flex flex-col content-center items-center justify-center h-[70vh] min-h-full relative p-10">
                <img src={item?.packageImages[0]?.imageUrl} alt="Packages" className="w-full h-full object-cover absolute top-0 left-0" />
                <div className="absolute top-0 left-0 w-full h-full bg-[#0A0818B2]"/>
                <div className="relative z-10 max-w-[350px] flex flex-col gap-6 justify-center items-center">
                  <h4 className="text-white text-2xl md:text-3xl font-bold capitalize">{item.packageName}</h4>
                  <Link
                    to={`/amrabad-resort/packages/${item.packageId}`}
                    className="bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] px-6 py-2 rounded-md hover:opacity-90 transition duration-300 text-xl font-bold"
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
