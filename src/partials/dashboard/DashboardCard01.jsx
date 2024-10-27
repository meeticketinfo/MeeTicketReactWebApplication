import React from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

function DashboardCard01({ lableName, count, percentageChange, icon: Icon }) {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 py-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {lableName}
          </h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          {/* Sales */}
        </div>
        <div className="flex items-start ">
          <div>
            <Icon className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2" />
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            <CountUp end={count} duration={2} prefix="" separator="," />
          </div>
          <div
            className={`text-sm font-medium px-1.5 rounded-full ${
              percentageChange >= 0
                ? "text-green-700 bg-green-500/20"
                : "text-red-700 bg-red-500/20"
            }`}
          >
            {/* {percentageChange >= 0
              ? `+${percentageChange}%`
              : `${percentageChange}%`} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard01;
