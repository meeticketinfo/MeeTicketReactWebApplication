import React, { useEffect } from "react";
import CountUp from "react-countup";
import { FaTicketAlt, FaRupeeSign, FaMobileAlt, FaMapMarkerAlt } from "react-icons/fa";
import { LoginDashboardStore } from "../store/amarabad/login_dashboard/LoginDashboardStore";
import { formatCount } from "./Helper";


const MeeTicketInfo = () => {

  const { fetchLoginDashboardData, LoginDashboardData, isLoginDashboardDataLoading } = LoginDashboardStore();
  // const isLoginDashboardDataLoading=false
  console.log("LoginDashboardData", LoginDashboardData)
  useEffect(() => {
    fetchLoginDashboardData()
  }, []);

  const kpis = [
    {
      label: "No of Transactions",
      // value: "4.4L+",
      value: LoginDashboardData.ticketsSold,
      sub: "Tickets",
      icon: <FaTicketAlt className="text-green-500 text-lg" />
    },
    {
      label: "Transacted Amount",
      // value: "₹2.69Cr+",
      value: LoginDashboardData.totalRevenue,
      sub: "Amount",
      icon: <FaRupeeSign className="text-red-500 text-lg" />
    },
    {
      label: "App Downloads",
      // value: "1.9L+",
      value: LoginDashboardData.appDownloads,
      sub: "Android & iOS",
      icon: <FaMobileAlt className="text-yellow-500 text-lg" />
    },
    {
      label: "Locations",
      value: LoginDashboardData.activeVenues,
      sub: "Active venues",
      icon: <FaMapMarkerAlt className="text-blue-500 text-lg" />
    }
  ];



  const locationsData = [
    { label: "Forest Department", value: 98, color: "bg-blue-100 text-blue-700" },
    { label: "Tourism Development Corp (Boating)", value: 52, color: "bg-purple-100 text-purple-700" },
    { label: "Metro Stations", value: 51, color: "bg-orange-100 text-orange-700" },
    { label: "HMDA", value: 18, color: "bg-green-100 text-green-700" },
    { label: "Endowments Department", value: 16, color: "bg-teal-100 text-teal-700" },
    { label: "CDMA", value: 16, color: "bg-yellow-100 text-yellow-700" },
    { label: "GHMC", value: 11, color: "bg-red-100 text-red-700" },
    { label: "Dept. of Heritage Telangana", value: 9, color: "bg-indigo-100 text-indigo-700" },
  ];
  const getDeptColor = (department) => {
    const colors = locationsData.map(d => d.color);

    const match = locationsData.find(d => d.label === department);

    // If department matches → use its color
    if (match) return match.color;

    // If not matched → random color
    return colors[Math.floor(Math.random() * colors.length)];
  };



  const InlineLoader = ({ width = "w-10" }) => (
    <div className={`h-4 ${width} bg-gray-200  rounded-xl animate-pulse`} />
  );

  return (
    <div className="w-full mx-auto shadow-xl ">

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {kpis.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border px-4 py-2 flex justify-between items-start shadow-sm transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
          >
            <div>
              <div className="text-xs text-gray-500 font-medium">
                {item.label}
              </div>
              <div className="text-lg font-bold text-gray-900 mt-1 min-h-[20px]">
                {isLoginDashboardDataLoading ? (
                  <InlineLoader width="w-16" />
                ) : item.label !== "Locations" ? (
                  formatCount(item.value)
                ) : (
                  <CountUp end={formatCount(item.value) || "0"} duration={1.8}
                    delay={0.2} separator="," />
                )}
              </div>
              <div className="text-xs text-gray-400">
                {item.sub}
              </div>
            </div>

            <div className="p-2 rounded-lg shadow-md bg-gray-100">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* LOCATIONS BY DEPARTMENT */}
      <div className="bg-white  rounded-lg border overflow-hidden">

        {/* Header */}
        <div className="px-3 py-2 border-b">
          <h3 className="text-xs font-semibold text-gray-800">
            Locations by Department
          </h3>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 text-[11px] leading-tight">

          {LoginDashboardData.departmentParks?.map((item, idx) => (
            <div
              key={idx}
              className={`
        flex items-center justify-between
        px-3 py-2
        border-gray-200
        ${idx < 4 ? "border-b" : ""}
        ${idx % 4 !== 3 ? "border-r" : ""}
      `}
            >
              <span className="font-medium text-gray-800">
                {item.department}
              </span>

              <span
                className={`font-semibold px-2 py-[2px] shadow-md rounded-full ${getDeptColor(item.department)} `}
              >

                {isLoginDashboardDataLoading ? (
                  <InlineLoader width="w-8" />
                ) : (
                  <CountUp end={item.parkCount || "0"} duration={1.8}
                    delay={0.2} separator="," />
                )}
              </span>
            </div>
          ))}

        </div>
      </div>



    </div>
  );
};

export default MeeTicketInfo;
