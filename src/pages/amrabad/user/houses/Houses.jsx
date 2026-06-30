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
import { getFormattedDate } from "../../../../utils/Helper";

const Houses = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [userPackage, setUserPackage] = useState(null);
  const { packageId } = useParams();

  // Date state management
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Get current date string for min attribute
  const getCurrentDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get next day string for default toDate
  const getNextDayString = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get max date (3 days from fromDate)
  const getMaxDateString = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 3);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const {
    fetchRoomsByPackageId,
    GetRoomsByPackageId,
    isRoomsByPackageIdLoading,
    fetchUserPackages,
    GetUserPackages,
    isUserPackagesLoading,
  } = useUserBookingStore();

  // Initialize dates on component mount
  useEffect(() => {
    const currentDateString = getCurrentDateString();
    const tomorrowDateString = getNextDayString(currentDateString);

    setFromDate(currentDateString);
    setToDate(tomorrowDateString);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      const formattedFromDate = getFormattedDate(new Date(fromDate));
      const formattedToDate = getFormattedDate(new Date(toDate));
      fetchRoomsByPackageId(packageId, formattedFromDate, formattedToDate);
    }
  }, [packageId, fromDate, toDate]);

  useEffect(() => {
    fetchUserPackages();
  }, []);

  useEffect(() => {
    if (GetUserPackages) {
      setUserPackage(GetUserPackages?.find(packageDetail => packageDetail?.packageId == packageId));
    }
  }, [GetUserPackages, packageId]);

  const handleSearch = () => {
    if (fromDate && toDate) {
      const formattedFromDate = getFormattedDate(new Date(fromDate));
      const formattedToDate = getFormattedDate(new Date(toDate));
      fetchRoomsByPackageId(packageId, formattedFromDate, formattedToDate);
    }
  };

  const handleHouseClick = (house) => {
    setSelectedHouse(house);
  };

  return (
    <UserLayout>
      <div className="container mx-auto py-3 px-3">
        <div className="flex items-center gap-1 flex-wrap text-sm">
          <Link
            className="text-[#304A3A] hover:text-[#2E3929] font-semibold"
            to="/amrabad-resort/packages"
          >
            Amrabad Resorts
          </Link>
          <span className="text-[#4A6360]"> &gt; </span>
          <span className="text-[#4A6360] capitalize">{userPackage?.packageName}</span>
        </div>
      </div>

      <div className="text-center min-h-[130px] flex items-center justify-center relative p-3 overflow-hidden">
        <img
          src={userPackage?.packageImages?.[0]?.imageUrl}
          alt="Packages"
          className="absolute inset-0 w-full h-full object-cover "
        />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.15)_100%)]" aria-hidden />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(15,31,26,0.75)_0%,rgba(26,46,40,0.25)_50%,transparent_100%)]" aria-hidden />
        <div className="container mx-auto relative z-20">
          <h1 className="text-2xl  md:text-3xl xl:text-4xl font-bold text-white uppercase">
            {userPackage?.packageName}
          </h1>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="container mx-auto px-3">
        <div className="flex flex-col md:flex-row justify-between items-center my-3 gap-3">
          <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
            <div className="flex flex-row gap-4 flex-1 text-sm w-full">
              <div className="flex flex-col w-full">
                <label className="text-xs font-medium text-gray-700 mb-1">Check-in Date</label>
                <input
                  type="date"
                  min={getCurrentDateString()}
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    // Automatically set toDate to one day after fromDate
                    const nextDay = getNextDayString(e.target.value);
                    setToDate(nextDay);
                  }}
                  className="px-3 py-2 border-none shadow-md  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#304A3A] focus:border-transparent"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-xs font-medium text-gray-700 mb-1">Check-out Date</label>
                <input
                  type="date"
                  min={fromDate ? getNextDayString(fromDate) : getCurrentDateString()}
                  max={fromDate ? getMaxDateString(fromDate) : ""}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 border-none shadow-md rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#304A3A] focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSearch}
              className="bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] hover:opacity-90 px-6 py-2 rounded-md shadow-md transition-colors duration-200 font-medium text-sm w-full sm:w-auto"
            >
              Search Cottages
            </button>
          </div>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Content */}
        <div className="">
          {viewMode === "list" ? (
            <ListView houses={GetRoomsByPackageId} isRoomsByPackageIdLoading={isRoomsByPackageIdLoading} userPackage={userPackage} fromDate={fromDate} toDate={toDate} />
          ) : (
            <MapView houses={GetRoomsByPackageId} onHouseClick={handleHouseClick} fromDate={fromDate} toDate={toDate} />
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Houses;
