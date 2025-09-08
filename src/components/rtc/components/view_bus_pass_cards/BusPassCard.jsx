import React from "react";
import idCardBg from "../../../../images/user/idCardBg.png";
import tsrtclogo from "../../../../images/user/tsrtclogo.png";
import passQr from "../../../../images/user/passQr.png";
const BusPassCard = ({data}) => {
  const obj = {
    mrNo: "MR17612409",
    idNo: "8EFF6944-D6BF-46ED-BBB7-6A48-011F27D5",
    name: "MS. BOLUGODDU AKHILA",
    ageSex: "26, Male",
    amount: "₹50.00",
    phone: "9876543210",
    dob: "12/03/1997",
    validityFrom: "12-MAR-2025",
    validityTo: "11-APR-2026",
    photoUrl: "https://i.pravatar.cc/86?img=47",
  };

  return (
    <div className="w-full flex justify-center  ">
      <div className={`relative w-full max-w-[400px] h-[260px] rounded-xl overflow-hidden border-2  border-[#B7BD72]`}>
       <div className={`${data.MainTitle==="Expired Bus Pass" ? "bg-gray-100" : ""} `}>
        {/* Watermark - Government of Telangana emblem */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <img
            src={idCardBg}
            alt="idCardBg"
            className={`w-full h-full object-cover ${data.MainTitle==="Expired Bus Pass" ? "opacity-40" : ""}`}
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
        {data.MainTitle==="Expired Bus Pass" && (
          <div className="absolute inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center ">
            <div className="text-white text-center bg-[#DA4761] px-4 py-1 rounded-lg rotate-2">
              <div className="text-3xl font-bold ">EXPIRED</div>
             
            </div>
          </div>
        )}

        {/* Main content */}
        <div className={`relative z-10 ${data.MainTitle==="Expired Bus Pass" ? "opacity-40" : ""}`}>
          <div className="relative z-10 flex items-center gap-2 mb-4 px-2 py-1 bg-[#ECF0C6] w-full  ">
            {/* Government of Telangana circular logo */}
            <div className="w-8 h-8 grid place-items-center ">
              <img src={tsrtclogo} alt="tsrtclogo" />
            </div>

            <div className="text-[13px] font-bold tracking-wide text-black">
              IDENTITY CARD
            </div>
          </div>
          <div className="relative z-10 px-4 pt-2">
            <div className="flex justify-between">
              {/* left part */}
              <div>
                <div className="flex flex-col items-start  text-xs mb-1.5">
                  <h1 className="font-medium text-[11px] text-black">
                    MR17612409
                  </h1>
                  <p className="text-gray-500 text-[11px]">MR No</p>
                </div>
                <div className="flex flex-col items-start  text-xs mb-1.5">
                  <h1 className="font-medium text-[11px] text-black">
                    8EFF6944-D6BF-46ED-BBB7-6A48-011F27D5
                  </h1>
                  <p className="text-gray-500 text-[11px]">ID No</p>
                </div>
                <div className="flex flex-col items-start  text-xs mb-1.5">
                  <h1 className="font-medium text-[11px] text-black">
                    MS. BOLUGODDU AKHILA
                  </h1>
                  <p className="text-gray-500 text-[11px]">Name</p>
                </div>
                <div className="flex flex-col items-start  text-xs">
                  <h1 className="font-medium text-[11px] text-black">
                    26, Male
                  </h1>
                  <p className="text-gray-500 text-[11px]">Age & Sex</p>
                </div>
              </div>
              {/* right part */}
              <div className="relative z-10 bottom-11">
                <div className="relative border-2  border-white mb-3 overflow-hidden">
                  {/* Main Image */}
                  <img src={passQr} alt="photo" className="w-full h-20 object-fill" />
                </div>

                <div className="flex  text-end gap-1 mb-1 text-xs">
                  <h1 className="font-medium text-[11px] text-black">
                    Amount:
                  </h1>
                  <p className="text-gray-500 text-[11px] text-end">₹50.00</p>
                </div>
                <div className="flex  items-start gap-1 mb-1 text-xs">
                  <h1 className="font-medium text-[11px] text-black">Ph:</h1>
                  <p className="text-gray-500 text-[11px]">9876543210</p>
                </div>
                <div className="flex  items-start gap-1 mb-1 text-xs">
                  <h1 className="font-medium text-[11px] text-black">DOB:</h1>
                  <p className="text-gray-500 text-[11px]">12/03/1997</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom validity bar */}
        <div className="absolute bottom-0 left-0 right-0  bg-gradient-to-r from-[#EFF1D9] via-[#B1B867] to-[#EFF1D9]">
          <div className="px-3 py-1 text-center text-[11px] font-bold tracking-wide">
            <span className="text-black">
              VALIDITY: {obj.validityFrom} TO {obj.validityTo}
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BusPassCard;
