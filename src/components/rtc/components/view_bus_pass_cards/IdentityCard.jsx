import React from "react";
import idCardBg from "../../../../images/user/idCardBg.png";
import tsrtclogo from "../../../../images/user/tsrtclogo.png";
import { formatToStandardDate } from "../../../../utils/TypographyHelper";
/**
 * Exact Identity Card UI (JSX + Tailwind CSS)
 * Matches the provided image exactly
 */
export default function IdentityCard({ data }) {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[400px] h-[260px] rounded-xl overflow-hidden border-2 border-[#B7BD72]">
        {/* Watermark - Government of Telangana emblem */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <img
            src={idCardBg}
            alt="idCardBg"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 px-4 pt-2">
          <div className="flex justify-between">
            {/* left part */}
            <div>
              <div className="relative z-10 flex items-center gap-2 pb-4  ">
                {/* Government of Telangana circular logo */}
                <div className="w-8 h-8 grid place-items-center ">
                  <img src={tsrtclogo} alt="tsrtclogo" />
                </div>

                <div className="text-[13px] font-bold tracking-wide text-black">
                  IDENTITY CARD
                </div>
              </div>
              <div className="flex flex-col items-start  text-xs mb-1.5">
                <h1 className="font-medium text-[11px] text-black">
                  {data?.mr_no ? data.mr_no : "N/A"}
                </h1>
                <p className="text-gray-500 text-[11px]">MR No</p>
              </div>
              <div className="flex flex-col items-start  text-xs mb-1.5">
                <h1 className="font-medium text-[11px] text-black">
                  {data?.id_no ? data?.id_no : "N/A"}
                </h1>
                <p className="text-gray-500 text-[11px]">ID No</p>
              </div>
              <div className="flex flex-col items-start  text-xs mb-1.5">
                <h1 className="font-medium text-[11px] text-black">
                  {data?.employee_name ? data?.employee_name : "N/A"}
                </h1>
                <p className="text-gray-500 text-[11px]">Name</p>
              </div>
              <div className="flex flex-col items-start  text-xs">
                <h1 className="font-medium text-[11px] text-black">
                  {data?.Age ? data?.Age : "N/A"},
                  {data?.employee_gender ? data?.employee_gender : "N/A"}
                </h1>
                <p className="text-gray-500 text-[11px]">Age & Sex</p>
              </div>
            </div>
            {/* right part */}
            <div>
              <div className="relative border-2 border-white mb-3 overflow-hidden w-24 h-20">
                {/* Main Image */}
                <img
                  src={`data:image/jpeg;base64,${data?.employee_photo}`}
                  alt="photo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

                {/* Watermark Layer */}
                <div className="absolute inset-0 flex flex-wrap text-black text-[5px] font-bold opacity-10 pointer-events-none">
                  {Array.from({ length: 500 }).map((_, i) => (
                    <span key={i} className="mx-[1px]">
                      GOVERNMENT OF TELANGANA
                    </span>
                  ))}
                </div>

                {/* Logo */}
                <img
                  src={tsrtclogo}
                  alt="logo"
                  className="absolute bottom-0 right-0 opacity-40"
                />
              </div>

              <div className="flex  text-end gap-1 mb-1 text-xs">
                <h1 className="font-medium text-[11px] text-black">Amount:</h1>
                <p className="text-gray-500 text-[11px] text-end">
                  ₹ {data?.amount ? data?.amount : "N/A"}
                </p>
              </div>
              <div className="flex  items-start gap-1 mb-1 text-xs">
                <h1 className="font-medium text-[11px] text-black">Mobile No:</h1>
                <p className="text-gray-500 text-[11px]">
                  {data?.employee_cellno ? data?.employee_cellno : "N/A"}
                </p>
              </div>
              <div className="flex  items-start gap-1 mb-1 text-xs">
                <h1 className="font-medium text-[11px] text-black">DOB:</h1>
                <p className="text-gray-500 text-[11px]">
                  {data?.employee_dob ? formatToStandardDate(data?.employee_dob) : "N/A"}
                </p>
              </div>
              <div className="flex  items-start gap-1 mb-1 text-xs">
                <h1 className="font-medium text-[11px] text-black">Address:</h1>
                <p className="text-gray-500 text-[11px]">
                  {data?.applicantaddress ? data?.applicantaddress : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom validity bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="px-3 py-1 text-center text-[11px] font-bold tracking-wide">
            <span className="text-black">
              VALIDITY: {data?.id_valid_from ? data?.id_valid_from : "N/A"} TO{" "}
              {data?.id_valid_to ? data?.id_valid_to : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
