import { useState, useEffect } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import PageHeader from "./components/amrabadBookingHistory/PageHeader";
import SearchAndFilter from "./components/amrabadBookingHistory/SearchAndFilter";
import AllBookings from "./components/amrabadBookingHistory/AllBookings";
import UpcomingBookings from "./components/amrabadBookingHistory/UpcomingBookings";
import CancelledBookings from "./components/amrabadBookingHistory/CancelledBookings";
import PastBookings from "./components/amrabadBookingHistory/PastBookings";
import { useBookingHistoryStore } from "../../../../store/amrabad/user/userBookingHistoryStore";

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // console.log("searchQuery", searchQuery);
  const { fetchUserBookingHistory, GetUserBookingHistory, isUserBookingHistoryLoading } = useBookingHistoryStore();

  // Fetch booking history on component mount
  useEffect(() => {
    fetchUserBookingHistory();
  }, [fetchUserBookingHistory]);

  const tabs = [
    { id: "all", label: "All Bookings", count: GetUserBookingHistory.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: GetUserBookingHistory.filter((booking) => booking.historyStatus === "Upcoming").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: GetUserBookingHistory.filter((booking) => booking.historyStatus === "Cancelled")
        .length,
    },
    {
      id: "past",
      label: "Past",
      count: GetUserBookingHistory.filter((booking) => booking.historyStatus === "Past").length,
    },
  ];

  const config = {
    all: { component: <AllBookings data={GetUserBookingHistory} searchQuery={searchQuery} /> },
    upcoming: {
      component: (
        <UpcomingBookings
          data={GetUserBookingHistory.filter((booking) => booking.historyStatus === "Upcoming")}
          searchQuery={searchQuery}
        />
      ),
    },
    cancelled: {
      component: (
        <CancelledBookings
          data={GetUserBookingHistory.filter((booking) => booking.historyStatus === "Cancelled")}
          searchQuery={searchQuery}
        />
      ),
    },
    past: {
      component: (
        <PastBookings
          data={GetUserBookingHistory.filter((booking) => booking.historyStatus === "Past")}
          searchQuery={searchQuery}
        />
      ),
    },
  };

  return (
    <UserLayout>
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <PageHeader />

          {/* Tabs and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          {/* Booking Cards */}
          {isUserBookingHistoryLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-500 mt-2">Loading bookings...</p>
            </div>
          ) : (
            config[activeTab].component
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default BookingHistory;
