import React from "react";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import CountUp from "react-countup";

const WalkerpassPassCategoryDetails = ({ data = [] }) => {
  // Calculate totals from the data array
  const totalCount = data.reduce((sum, item) => sum + (item.totalCount || 0), 0);
  const totalAmount = data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalNewCount = data.reduce((sum, item) => sum + (item.newCount || 0), 0);
  const totalNewAmount = data.reduce((sum, item) => sum + (item.newAmount || 0), 0);
  const totalRenewalCount = data.reduce((sum, item) => sum + (item.renewalCount || 0), 0);
  const totalRenewalAmount = data.reduce((sum, item) => sum + (item.renewalAmount || 0), 0);

  return (
    <div className="col-span-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Pass Category Details
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Count Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center gap-3 mb-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IoTicketSharp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Count
                </h3>
                <p className="text-sm text-gray-500">All Passes Count</p>
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800 mb-6">
              <CountUp
                end={totalCount}
                duration={2}
                separator=","
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                New Passes
              </span>
              <span className="text-sm font-semibold text-gray-800">
                <CountUp
                  end={totalNewCount}
                  duration={2}
                  separator=","
                />
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Renewal Passes
              </span>
              <span className="text-sm font-semibold text-gray-800">
                <CountUp
                  end={totalRenewalCount}
                  duration={2}
                  separator=","
                />
              </span>
            </div>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center gap-3 mb-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaIndianRupeeSign className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Amount
                </h3>
                <p className="text-sm text-gray-500">All Passes Amount</p>
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800 mb-6">
              ₹
              <CountUp
                end={totalAmount}
                duration={2}
                separator=","
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                New Passes
              </span>
              <span className="text-sm font-semibold text-gray-800">
                ₹
                <CountUp
                  end={totalNewAmount}
                  duration={2}
                  separator=","
                />
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F1F6FB] rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Renewal Passes
              </span>
              <span className="text-sm font-semibold text-gray-800">
                ₹
                <CountUp
                  end={totalRenewalAmount}
                  duration={2}
                  separator=","
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed breakdown by pass category and duration */}
      {data.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Detailed Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-800">
                    {item.passCategory || 'Unknown Category'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.duration || 'No Duration'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Count:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      <CountUp
                        end={item.totalCount || 0}
                        duration={1}
                        separator=","
                      />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹<CountUp
                        end={item.totalAmount || 0}
                        duration={1}
                        separator=","
                      />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Count:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      <CountUp
                        end={item.newCount || 0}
                        duration={1}
                        separator=","
                      />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Amount:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹<CountUp
                        end={item.newAmount || 0}
                        duration={1}
                        separator=","
                      />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Renewal Count:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      <CountUp
                        end={item.renewalCount || 0}
                        duration={1}
                        separator=","
                      />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Renewal Amount:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹<CountUp
                        end={item.renewalAmount || 0}
                        duration={1}
                        separator=","
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkerpassPassCategoryDetails;
