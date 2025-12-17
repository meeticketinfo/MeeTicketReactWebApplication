import React from "react";
import idCardBg from "../../../../images/user/idCardBg.png";
import tsrtclogo from "../../../../images/user/tsrtclogo.png";
import ExpiryLogo from "../../../../images/user/ExpiryLogo.png";
const BusPassCard = ({ data,data1 }) => {
  return (
    <div className="w-full flex justify-center ">
      <div
        className={`relative w-full max-w-[400px] h-[290px] rounded-xl overflow-hidden border-2  border-[#B7BD72]`}
      >
        <div className={`${data.status !== "Active" ? "bg-gray-100" : ""} `}>
          {/* Watermark - Government of Telangana emblem */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <img
              src={idCardBg}
              alt="idCardBg"
              className={`w-full h-full object-cover ${
                data.status !== "Active" ? "opacity-40" : ""
              }`}
            />
          </div>
          <div className="absolute inset-0 flex flex-wrap text-black text-[5px] font-bold opacity-10 pointer-events-none">
            {Array.from({ length: 500 }).map((_, i) => (
              <span key={i} className="mx-[1px]">
                MEETICKET
              </span>
            ))}
          </div>

          {/* Expired Overlay */}
          {data.status !== "Active" && (
            <div className="absolute inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center ">
              {/* <div className="text-white text-center bg-[#DA4761] px-4 py-1 rounded-lg rotate-2">
                <div className="text-3xl font-bold ">EXPIRED</div>
              </div> */}
              <img
                src={ExpiryLogo}
                alt="ExpiryLogo"
                className="w-40 h-40 object-cover"
              />
            </div>
          )}

          {/* Main content */}
          <div
            className={`relative z-10 ${
              data.status !== "Active" ? "opacity-40" : ""
            }`}
          >
            <div className="relative z-10 flex items-center gap-2 mb-4 px-2 py-1 bg-[#ECF0C6] w-full  ">
              {/* Government of Telangana circular logo */}
              <div className="w-8 h-8 grid place-items-center ">
                <img src={tsrtclogo} alt="tsrtclogo" />
              </div>

              <div className="text-[13px] font-bold tracking-wide text-black">
                {data.pass_name ? data.pass_name : "N/A"}
              </div>
            </div>
            <div className="relative z-10 px-4 ">
              <div className="flex justify-between">
                {/* left part */}
                <div>
                  <div className="flex flex-col items-start  text-xs mb-1.5">
                    <h1 className="font-medium text-[11px] text-black">
                      {data.id_no ? data.id_no : "N/A"}
                    </h1>
                    <p className="text-gray-500 text-[11px]">ID No</p>
                  </div>
                  <div className="flex flex-col items-start  text-xs mb-1.5">
                    <h1 className="font-medium text-[11px] text-black">
                       {data1?.employee_name ? data1?.employee_name : "N/A"}
                    </h1>
                    <p className="text-gray-500 text-[11px]">Name</p>
                  </div>
                  <div className="flex flex-col items-start  text-xs mb-1.5">
                    <h1 className="font-medium text-[11px] text-black">
                      {data.tkt_generated_time
                        ? data.tkt_generated_time
                        : "N/A"}
                    </h1>
                    <p className="text-gray-500 text-[11px]">Date & Time</p>
                  </div>
                  <div className="flex flex-col items-start  text-xs">
                    <h1 className="font-medium text-[11px] text-black">
                      {data.ticket_no ? data.ticket_no : "N/A"}
                    </h1>
                    <p className="text-gray-500 text-[11px]">Ticket No</p>
                  </div>
                  <div className="flex flex-col items-start  text-xs">
                    <h1 className="font-medium text-[11px] text-black">
                      {data.pass_name ? data.pass_name : "N/A"}
                    </h1>
                    <p className="text-gray-500 text-[11px]">Pass Type</p>
                  </div>
                </div>
                {/* right part */}
                <div className="relative z-10 bottom-1">
                  {/* <div className="relative border-2   mb-3 overflow-hidden">
                    
                    <img
                      src={passQr}
                      alt="photo"
                      className="w-full h-20 object-fill"
                    />
                  </div> */}

                  <div className="flex  text-end gap-1 mb-2 text-xs">
                    <h1 className="font-medium text-[11px] text-black">
                      Amount:
                    </h1>
                    <p className="text-gray-500 text-[11px] text-end">
                      ₹{data.amount ? data.amount : "N/A"}
                    </p>
                  </div>
                  <div className="flex  items-start gap-1 mb-2 text-xs">
                    <h1 className="font-medium text-[11px] text-black">
                      Late fee:
                    </h1>
                    <p className="text-gray-500 text-[11px]">
                      {data.late_fee ? data.late_fee : "0"}
                    </p>
                  </div>
                  <div className="flex  items-start gap-1 mb-2 text-xs">
                    <h1 className="font-medium text-[11px] text-black">
                      Service charges:
                    </h1>
                    <p className="text-gray-500 text-[11px]">
                      {data.service_charges ? data.service_charges : "0"}
                    </p>
                  </div>
                  <div className="flex  items-start gap-1 mb-1 text-xs">
                    <h1 className="font-medium text-[11px] text-black">
                      Total:
                    </h1>
                    <p className="text-gray-500 text-[11px]">
                      {data.total_amount ? data.total_amount : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom validity bar */}
          <div className="absolute bottom-0 left-0 right-0 py-1  bg-gradient-to-r from-[#EFF1D9] via-[#B1B867] to-[#EFF1D9]">
            <div className="px-3 py-1 text-center text-[11px] font-bold tracking-wide">
              <span className="text-black">
                VALIDITY: {data.ticket_valid_from} TO {data.ticket_valid_to}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusPassCard;
