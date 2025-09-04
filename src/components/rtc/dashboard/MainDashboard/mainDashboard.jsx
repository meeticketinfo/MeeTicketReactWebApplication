import React, { useState } from "react";
import BuspassDasboard from "../BuspassDashboard/BuspassDasboard";
import IntercitypassDasboard from "../IntercityDashboard/intercityDashboard";

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState("buspass");
  return (
    <div>
           <div className="col-span-full">
          <div className="relative">
            <div className="flex">
              <button
                onClick={() => setActiveTab("buspass")}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "buspass"
                    ? "text-blue-700 border-b-2 border-b-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bus Pass
              </button>
              {/* <button
                onClick={() => setActiveTab("intercity")}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "intercity"
                    ? "text-blue-700 border-b-2 border-b-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Intercity
              </button> */}
            </div>
            {/* Half line under tabs */}
            <div className="w-1/2 h-px bg-gray-300 mt-0"></div>
          </div>
        </div>
        <div className="col-span-full p-2">
      {activeTab === "buspass" && <BuspassDasboard />}
      {/* {activeTab === "intercity" && <IntercitypassDasboard />} */}
      </div>
    </div>
  );
};

export default MainDashboard;
