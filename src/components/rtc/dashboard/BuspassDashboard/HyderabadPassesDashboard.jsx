import React from "react";
import { FaBus } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const HyderabadPassesDashboard = () => {
  // Sample data - replace with actual data from your store
  
  const passData = {
    ordinary: {
      totalCount: 2145,
      totalAmount: 321750,
      newCount: 2145,
      newAmount: 321750,
      renewalCount: 2145,
      renewalAmount: 321750,
    },
    metroExpress: {
      totalCount: 2145,
      totalAmount: 321750,
      newCount: 2145,
      newAmount: 321750,
      renewalCount: 2145,
      renewalAmount: 321750,
    },
    metroDeluxe: {
      totalCount: 2145,
      totalAmount: 321750,
      newCount: 2145,
      newAmount: 321750,
      renewalCount: 2145,
      renewalAmount: 321750,
    },
  };

  const PassCard = ({ title, icon, data, iconStyle = "" }) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full lg:flex-1 min-w-0 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className={`text-xl sm:text-2xl text-blue-600 ${iconStyle}`}>
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">{title}</h3>
      </div>
      
      {/* Total Section */}
      <div className="bg-[#F1F6FB] rounded-lg p-3 mb-3">
        <div className="mb-3">
          <h4 className="text-sm sm:text-base font-semibold text-blue-600">Total</h4>
        </div>
        <div className="flex justify-between items-end">
          <div >
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{data.totalCount.toLocaleString()}</div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Total Count</div>
          </div>
          <div >
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-1">
              <FaIndianRupeeSign className="text-green-600 text-xs sm:text-sm" />
              {data.totalAmount.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Total Amount</div>
          </div>
        </div>
      </div>

      {/* New Passes Section */}
      <div className="bg-[#F1F6FB] rounded-lg p-3 mb-3">
        <div className="mb-3">
          <h4 className="text-sm sm:text-base font-semibold text-blue-600">New Passes</h4>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{data.newCount.toLocaleString()}</div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">New Pass Count</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-1">
              <FaIndianRupeeSign className="text-green-600 text-xs sm:text-sm" />
              {data.newAmount.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">New Pass Amount</div>
          </div>
        </div>
      </div>

      {/* Renewal Passes Section */}
      <div className="bg-[#F1F6FB] rounded-lg p-3">
        <div className="mb-3">
          <h4 className="text-sm sm:text-base font-semibold text-blue-600">Renewal Passes</h4>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{data.renewalCount.toLocaleString()}</div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Renewal Count</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-1">
              <FaIndianRupeeSign className="text-green-600 text-xs sm:text-sm" />
              {data.renewalAmount.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Renewal Amount</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Hyderabad Passes</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <PassCard
          title="Ordinary Bus Pass"
          icon={<FaBus />}
          data={passData.ordinary}
        />
        <PassCard
          title="Metro Express Bus Pass"
          icon={<FaBus />}
          data={passData.metroExpress}
          iconStyle="border-b-2 border-gray-400"
        />
        <PassCard
          title="Metro Deluxe Bus Pass"
          icon={<FaBus />}
          data={passData.metroDeluxe}
          iconStyle="border-b-2 border-gray-400 border-t-2"
        />
      </div>
    </div>
  );
};

export default HyderabadPassesDashboard;
