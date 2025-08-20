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
            className="text-[#362D86] hover:text-[#362D86]/80 font-semibold"
            to="/amrabad/packages"
          >
            Amrabad Resorts
          </Link>
          <span className="text-gray-500"> &gt; </span>
          <span className="text-gray-500 capitalize">{userPackage?.packageName}</span>
        </div>
      </div>

      <div className="text-center min-h-[130px] flex items-center justify-center relative p-3">
        <img
          src={userPackage?.packageImages?.[0]?.imageUrl}
          alt="Packages"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[#1b1065af] z-10 backdrop-blur-sm"></div>
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
                <label className="text-xs font-medium text-gray-700 mb-1">From Date</label>
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
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#362D86] focus:border-transparent"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-xs font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  min={fromDate ? getNextDayString(fromDate) : getCurrentDateString()}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#362D86] focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSearch}
              className="bg-[#362D86] text-white px-6 py-2 rounded-md hover:bg-[#362D86]/90 transition-colors duration-200 font-medium text-sm w-full sm:w-auto"
            >
              Search Houses
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
