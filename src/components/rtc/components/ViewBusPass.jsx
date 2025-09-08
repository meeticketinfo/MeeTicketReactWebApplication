import React from "react";
import PopupModal from "../../utils/popup_modal/PopupModal";

import IdentityCard from "./view_bus_pass_cards/IdentityCard";
import BusPassCard from "./view_bus_pass_cards/BusPassCard";

const ViewBusPass = ({ isOpen, onClose }) => {
  // Sample data - replace with actual data from props

  return (
    <PopupModal
      popupModalId="view-bus-pass-modal"
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      
    >
      <div className="space-y-6 p-4 mt-6">
        {/* Identity Card */}
        <div>
          <div className="flex items-center gap-2 mb-3 ml-2">
            {/* <FaIdCard className="text-blue-600" /> */}
            <h4 className="text-sm font-semibold text-blue-v2 bg-gray-100 px-4 shadow-md py-[2px] rounded-md ">
              Identity Card
            </h4>
          </div>
          <IdentityCard />
        </div>

        {/* Latest Bus Pass */}
        {[
          { MainTitle: "Latest Bus Pass", passTitle: "ONE DAY BUS PASS" },
          { MainTitle: "Expired Bus Pass", passTitle: "ONE DAY BUS PASS" },
        ].map((item, index) => (
          <div>
            <div key={index} className="flex items-center gap-2 mb-3 ml-2">
              <h4 className="text-sm font-semibold text-blue-v2 bg-gray-100 px-4 shadow-md py-[2px] rounded-md ">
                {item.MainTitle}
              </h4>
            </div>
            <BusPassCard data={item} />
          </div>
        ))}

        {/* Expired Bus Pass */}
        {/* <div>
          <div className="flex items-center gap-2 mb-3">
            <FaTicketAlt className="text-red-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Expired Bus Pass
            </h4>
          </div>
          <BusPassCard
            passData={data.expiredPass}
            title="ONE DAY BUS PASS"
            isExpired={true}
          />
        </div> */}
      </div>
    </PopupModal>
  );
};

export default ViewBusPass;
