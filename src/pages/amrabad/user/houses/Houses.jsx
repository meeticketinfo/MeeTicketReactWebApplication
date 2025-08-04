import React, { useEffect, useState } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import PackagesImage1 from "../../../../images/user/package-1.png";
import { Link, useNavigate, useParams } from "react-router-dom";

// Import components and data
import { housesData } from "./housesData";
import MapView from "./MapView";
import ListView from "./ListView";
import ViewToggle from "./ViewToggle";
import { useUserBookingStore } from "../../../../store/amrabad/user/userBookingStore";

const Houses = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("map"); // 'list' or 'map'
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [userPackage, setUserPackage] = useState(null);
  const { packageId } = useParams();

  const {
    fetchRoomsByPackageId,
    GetRoomsByPackageId,
    isRoomsByPackageIdLoading,
    fetchUserPackages,
    GetUserPackages,
    isUserPackagesLoading,
  } = useUserBookingStore();
  
  useEffect(() => {
    fetchRoomsByPackageId(packageId);
    fetchUserPackages();
  }, [packageId]);

  useEffect(() => {
    if (GetUserPackages) {
      setUserPackage(GetUserPackages?.find(packageDetail => packageDetail.packageId == packageId));
      console.log(userPackage, "userPackage");
    }
  }, [GetUserPackages, packageId]);


  const handleHouseClick = (house) => {
    setSelectedHouse(house);
  };
  

  return (
    <UserLayout>
      <div>
        <div className="container mx-auto py-3 px-3">
          <div className="flex items-center gap-1 flex-wrap">
            <Link
              className="text-[#362D86] hover:text-[#362D86]/80 font-semibold"
              to="/amarabad/packages"
            >
              Amrabad Resorts
            </Link>
            <span className="text-gray-500"> &gt; </span>
            <span className="text-gray-500 capitalize">{GetRoomsByPackageId[0]?.packageName}</span>
          </div>
        </div>
      </div>

      <div className="text-center min-h-[130px] flex items-center justify-center relative p-3">
        <img
          src={PackagesImage1}
          alt="Packages"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[#1b1065af] z-10 backdrop-blur-sm"></div>
        <div className="container mx-auto relative z-20">
          <h1 className="text-2xl  md:text-3xl xl:text-4xl font-bold text-white uppercase">
            {GetRoomsByPackageId[0]?.packageName}
          </h1>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="container mx-auto p-3">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

        {/* Content */}
        <div className="">
          {viewMode === "list" ? (
            <ListView houses={GetRoomsByPackageId} isRoomsByPackageIdLoading={isRoomsByPackageIdLoading} userPackage={userPackage} />
          ) : (
            <MapView houses={GetRoomsByPackageId} onHouseClick={handleHouseClick} />
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Houses;
