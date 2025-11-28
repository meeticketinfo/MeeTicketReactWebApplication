import React from "react";
import OverviewStats from "./OverviewStats";
import CounterWiseTickets from "./CounterWiseTickets";
import AdvanceBookings from "./AdvanceBookings";
import TodaysVisitors from "./TodaysVisitors";
import VisitorsBarGraph from "./VisitorsBarGraph";
import MonthlyVisitors from "./MonthlyVisitors";

const LocationsDashboardHome = () => {
  return (
    <>
    <div className="flex flex-col gap-8">
      <OverviewStats />
      <CounterWiseTickets /> 
      <AdvanceBookings />
      <TodaysVisitors />
      {/* <VisitorsBarGraph /> */}
      <MonthlyVisitors />
    </div>
    </>
  );
};

export default LocationsDashboardHome;
