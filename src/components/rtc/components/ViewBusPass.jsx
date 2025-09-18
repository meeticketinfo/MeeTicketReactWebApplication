import React, { useEffect } from "react";
import PopupModal from "../../utils/popup_modal/PopupModal";
import IdentityCard from "./view_bus_pass_cards/IdentityCard";
import BusPassCard from "./view_bus_pass_cards/BusPassCard";
import { useBusPassTotalTransactionStore } from "../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";

// Beautiful Loader Component
const BusPassLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div> */}
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Loading Bus Pass Details
        </h3>
        <p className="text-sm text-gray-500">
          Please wait while we fetch your information...
        </p>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>

      {/* Progress Bar */}
      {/* <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
      </div> */}
    </div>
  );
};

const ViewBusPass = ({ isOpen, onClose, AipData }) => {
  // Sample data - replace with actual data from props
  const {
    isFetchRtcViewBusPassData,
    fetchRtcRtcViewBusPassData,
    RtcViewBusPassData,
  } = useBusPassTotalTransactionStore();

  useEffect(() => {
    fetchRtcRtcViewBusPassData(AipData);
  }, [AipData]);
  // console.log("RtcViewBusPassData", RtcViewBusPassData);
  return (
    <PopupModal
      popupModalId="view-bus-pass-modal"
      isOpen={isOpen}
      onClose={onClose}
      size="small"
    >
      {isFetchRtcViewBusPassData ? (
        <BusPassLoader />
      ) : (
        <div className="space-y-6 p-4 mt-6">
          {/* Identity Card */}
          <div>
            <div className="flex items-center gap-2 mb-3 ml-2">
              {/* <FaIdCard className="text-blue-600" /> */}
              <h4 className="text-sm font-semibold text-blue-v2 bg-gray-100 px-4 shadow-md py-[2px] rounded-md ">
                Identity Card
              </h4>
            </div>
            <IdentityCard data={RtcViewBusPassData?.idDetails} />
          </div>

          {/* Latest Bus Pass */}
          {RtcViewBusPassData?.ticketDetailsList?.map((item, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-3 ml-2">
                <h4 className="text-sm font-semibold text-blue-v2 bg-gray-100 px-4 shadow-md py-[2px] rounded-md ">
                  {item.ticket_type}
                </h4>
              </div>
              <BusPassCard data={item} />
            </div>
          ))}
        </div>
      )}
    </PopupModal>
  );
};

export default ViewBusPass;
