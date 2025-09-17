import React, { useState, useEffect } from "react";
import { FaDownload, FaPrint } from "react-icons/fa";
import "./IntercityTicketView.css";
import Logo from "../../../../../images/logo.jpg";
import logo2 from "../../../../../images/logo-2.png";
import { useIntercityTicketViewStore } from "./IntercityTicketViewStore";
import { useParams } from "react-router-dom";

// Beautiful Loader Component
const BeautifulLoader = ({
  size = "large",
  message = "Loading ticket details...",
  showMessage = true,
  variant = "primary",
  type = "default",
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-20 h-20",
  };

  const variantClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  const renderTicketLoader = () => (
    <div className="ticket-loader">
      <div className="ticket-loader-card">
        <div className="ticket-loader-header">
          <div className="ticket-loader-logo"></div>
          <div className="ticket-loader-title">
            <div className="ticket-loader-line"></div>
            <div className="ticket-loader-line short"></div>
          </div>
          <div className="ticket-loader-logo"></div>
        </div>
        <div className="ticket-loader-content">
          <div className="ticket-loader-section">
            <div className="ticket-loader-line"></div>
            <div className="ticket-loader-line"></div>
            <div className="ticket-loader-line"></div>
          </div>
          <div className="ticket-loader-section">
            <div className="ticket-loader-line"></div>
            <div className="ticket-loader-line"></div>
            <div className="ticket-loader-line"></div>
          </div>
        </div>
        <div className="ticket-loader-footer">
          <div className="ticket-loader-line"></div>
          <div className="ticket-loader-line short"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="beautiful-loader-container">
      <div className="beautiful-loader-overlay">
        <div className="beautiful-loader-content">
          {type === "ticket" ? (
            renderTicketLoader()
          ) : (
            <>
              {/* Main Spinner */}
              <div
                className={`beautiful-spinner ${sizeClasses[size]} ${variantClasses[variant]}`}
              >
                <div className="spinner-ring">
                  <div className="spinner-ring-inner"></div>
                </div>
                <div className="spinner-dots">
                  <div className="spinner-dot"></div>
                  <div className="spinner-dot"></div>
                  <div className="spinner-dot"></div>
                </div>
              </div>

              {/* Pulsing Circle */}
              <div className="pulsing-circle"></div>
            </>
          )}

          {/* Loading Message */}
          {showMessage && (
            <div className="loading-message">
              <h3 className="loading-title">{message}</h3>
              <div className="loading-dots">
                <span className="loading-dot">.</span>
                <span className="loading-dot">.</span>
                <span className="loading-dot">.</span>
              </div>
            </div>
          )}

          {/* Animated Background Elements */}
          <div className="loader-bg-elements">
            <div className="bg-circle bg-circle-1"></div>
            <div className="bg-circle bg-circle-2"></div>
            <div className="bg-circle bg-circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntercityTicketView = ({ isScrolled = true }) => {
  const { id } = useParams();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    IntercityTicketViewData,
    isFetchIntercityTicketViewData,
    fetchIntercityTicketViewData,
  } = useIntercityTicketViewStore();
  console.log(IntercityTicketViewData, "IntercityTicketViewData");
  useEffect(() => {
    fetchIntercityTicketViewData(id);
  }, []);

  // Download handler
  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // Implement PDF download logic here
      console.log("Downloading ticket PDF...");

      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For now, just trigger browser print
      window.print();
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Show download loader if downloading
  if (isDownloading) {
    return (
      <BeautifulLoader
        size="medium"
        message="Preparing your ticket for download..."
        variant="success"
        type="default"
      />
    );
  }

  // Show loader while data is being fetched
  if (isFetchIntercityTicketViewData) {
    return (
      <BeautifulLoader
        size="large"
        message="Loading ticket details..."
        variant="primary"
        type="ticket"
      />
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
          }
          .bg-gray-100 {
            background: white !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
          .overflow-auto {
            overflow: visible !important;
          }
          .h-screen {
            height: auto !important;
          }
          .print-hide {
            display: none !important;
          }
          .border {
            border: none !important;
          }
        }
      `}</style>

      <div className=" overflow-auto h-screen bg-gray-100 px-2 sm:px-4 py-2 sm:py-4 border">
        {/* Ticket Container */}
        <div className="bg-white border rounded-md shadow-lg w-full max-w-5xl mx-auto">
          {/* Download button */}
          {/* <div className="flex justify-end p-4 print-hide">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDownloading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <FaDownload />
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>
          </div> */}
          {/* Header with Logos */}
          <div className="flex flex-col lg:flex-row justify-between items-center px-2 sm:px-4 lg:px-8 pt-4 sm:pt-6 gap-4 lg:gap-6">
            {/* Left Logo Section */}
            <div className="flex-shrink-0 order-1 lg:order-1">
              <div className="flex items-center justify-center gap-2 sm:gap-3 p-2 sm:p-4">
                <img
                  src={logo2}
                  alt="Meeticket Logo"
                  className={`transition-all duration-300 ${
                    isScrolled
                      ? "w-[50px] sm:w-[60px] md:w-[70px] lg:w-[60px]"
                      : "w-[70px] sm:w-[80px] md:w-[90px] lg:w-[100px]"
                  }`}
                />
              </div>
            </div>
            
            {/* Middle Content */}
            <div className="flex flex-col items-center justify-center text-center order-2 lg:order-2 flex-1 px-2">
              <h1 className="text-xs sm:text-sm lg:text-sm font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                తెలంగాణ రాష్ట్ర రహదారి రవాణా సంస్థ
              </h1>
              <h1 className="text-xs sm:text-sm lg:text-sm font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                TELANGANA STATE ROAD TRANSPORT CORPORATION
              </h1>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                <span className="break-all">Email: online.support@tgsrtcbus.in</span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span className="break-all">Customer care: 040 69440000</span>
              </div>
            </div>

            {/* Right Logo Section */}
            <div className="flex-shrink-0 order-3 lg:order-3">
              <div className="flex items-center justify-center gap-2 sm:gap-3 p-2 sm:p-4">
                <img
                  src={Logo}
                  alt="Meeticket Logo"
                  className={`transition-all duration-300 ${
                    isScrolled
                      ? "w-[50px] sm:w-[60px] md:w-[70px] lg:w-[60px]"
                      : "w-[70px] sm:w-[80px] md:w-[90px] lg:w-[100px]"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="px-2 sm:px-4 lg:px-8 py-0">
            <div className="p-3 sm:p-4 border-t-2 border-gray-200">
              <p className="text-xs sm:text-sm text-gray-900 font-semibold leading-relaxed">
                <strong>Please Note:</strong> It is mandatory to follow the
                travel guidelines of your source and destination state for
                travel.
              </p>
              <p className="text-xs sm:text-sm text-black mt-2">
                <strong>View Guidelines:</strong>
                <a
                  href="https://bit.ly/meeticket-guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline ml-1 break-all"
                >
                  https://bit.ly/meeticket-guidelines
                </a>
              </p>
            </div>
          </div>

          {/* Reservation Voucher */}
          <div className="px-2 sm:px-4 lg:px-8 py-0">
            <h2 className="text-sm sm:text-base font-extrabold text-start text-gray-900 mb-3 sm:mb-4 border-b border-t border-gray-400 py-3 sm:py-4">
              INTERCITY TICKET DETAILS
            </h2>

          {/* .. */}
            <div className="overflow-x-auto">
              <table className="w-full border border-none min-w-full">
                <tbody>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-[15px] text-black w-48">
                      PNR No.
                    </td>
                    <td className="px-1 py-2  text-gray-900 w-2">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.pnrnumber
                        ? IntercityTicketViewData.pnrnumber
                        : "N/A"}
                    </td>

                    <td className="px-3 py-2 text-[15px] font-bold text-black w-48">
                      Date of Journey
                    </td>
                    <td className="px-1 py-2 text-gray-900 w-2">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.trvaelDate
                        ? IntercityTicketViewData.trvaelDate
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b border-none">
                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Ticket No.
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.ticketNumber
                        ? IntercityTicketViewData.ticketNumber
                        : "N/A"}
                    </td>

                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Coach Type
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.busType
                        ? IntercityTicketViewData.busType
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b border-none">
                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Depot Name
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.depo
                        ? IntercityTicketViewData.depo
                        : "N/A"}
                    </td>

                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Drop Off
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.dropOffName
                        ? IntercityTicketViewData.dropOffName
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b border-none">
                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Service Number
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.serviceNumber
                        ? IntercityTicketViewData.serviceNumber
                        : "N/A"}
                    </td>

                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Arrival On
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.arrivelTime
                        ? IntercityTicketViewData.arrivelTime
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b border-none">
                    <td className="px-3 py-2 text-[15px] font-bold text-black">From</td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.fromStationName
                        ? IntercityTicketViewData.fromStationName
                        : "N/A"}
                    </td>

                    <td className="px-3 py-2 text-[15px] font-bold text-black">To</td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.toStationName
                        ? IntercityTicketViewData.toStationName
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b border-none">
                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Boarding
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.pickUpName
                        ? IntercityTicketViewData.pickUpName
                        : "N/A"}
                    </td>

                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Depart On
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.departureTime
                        ? IntercityTicketViewData.departureTime
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b border-none">
                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Status
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                      <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.ticketStatus
                        ? IntercityTicketViewData.ticketStatus
                        : "N/A"}
                    </td>

                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      No. of Seats
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">
                      {IntercityTicketViewData.totalNoOfSeats
                        ? IntercityTicketViewData.totalNoOfSeats
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b border-none">
                    <td className="px-3 py-2 text-[15px] font-bold text-black">
                      Concession
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">GENERAL PUBLIC</td>

                    <td className="px-3 py-2 font-bold text-black">
                      Booked By
                    </td>
                    <td className="px-1 py-2 text-gray-900">:</td>
                    <td className="px-3 py-2 text-[15px] text-gray-900">MeeTicket</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 pb-2">
              PASSENGER DETAILS
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left text-sm font-bold text-blue-v1">
                      S.No
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-blue-v1">
                      Name
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-blue-v1">
                      Age
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-blue-v1">
                      Gender
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-blue-v1">
                      Seat No.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {IntercityTicketViewData?.seats &&
                  IntercityTicketViewData.seats.length > 0 ? (
                    IntercityTicketViewData.seats.map((passenger, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-3 py-2 text-sm text-center">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium">
                          {passenger.passengers[0].passengerName || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {passenger.passengers[0].passengerAge || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {passenger.passengers[0].passengerGender || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {passenger.seatNumber}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-8 text-center">
                        <div className="no-seats-inline">
                          <div className="no-seats-icon-inline">
                            <div className="seat-icon-inline">
                              <div className="seat-icon-body-inline">
                                <div className="seat-icon-line-inline"></div>
                                <div className="seat-icon-line-inline"></div>
                                <div className="seat-icon-line-inline short"></div>
                              </div>
                              <div className="seat-icon-armrest-inline"></div>
                            </div>
                          </div>
                          <div className="no-seats-message-inline">
                            <h4 className="no-seats-title-inline">
                              No Passenger Data Available
                            </h4>
                            <p className="no-seats-subtitle-inline">
                              No seat information found for this ticket.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fare Details */}
          <div className="px-2 sm:px-4 lg:px-8 py-4">
            <h3 className="text-base sm:text-lg text-gray-900 font-bold mb-3 sm:mb-4 pb-2">
              FARE DETAILS
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-[15px] text-black">Basic Fare</span>
                  <span className="text-gray-900 text-[15px]">
                    : ₹{" "}
                    {IntercityTicketViewData?.total?.basicFare
                      ? IntercityTicketViewData?.total?.basicFare
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[15px] text-black">
                    Reservation & Levy Fee
                  </span>
                  <span className="text-gray-900 text-[15px]">
                    : ₹{" "}
                    {IntercityTicketViewData?.total?.reservationFee
                      ? IntercityTicketViewData?.total?.reservationFee
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-black text-[15px]">GST</span>
                  <span className="text-gray-900 text-[15px]">
                    : ₹{" "}
                    {IntercityTicketViewData?.total?.gstSum
                      ? IntercityTicketViewData?.total?.gstSum
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2 text-[15px]">
                <div className="flex justify-between text-[15px]">
                  <span className="font-bold text-black">Toll Fee</span>
                  <span className="text-gray-900">
                    : ₹{" "}
                    {IntercityTicketViewData?.total?.tollSum
                      ? IntercityTicketViewData?.total?.tollSum
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-black">Service Fee</span>
                  <span className="text-gray-900">
                    : ₹{" "}
                    {IntercityTicketViewData?.total?.serviceSum
                      ? IntercityTicketViewData?.total?.serviceSum
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-black">
                    Concession Amt
                  </span>
                  <span className="text-gray-900">
                    : ₹{" "}
                    {IntercityTicketViewData?.total?.concessionAmt
                      ? IntercityTicketViewData?.total?.concessionAmt
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
            {/* Horizontal Line */}
            <div className="mt-4 mb-4 "></div>
            {/* Total Fare */}
            <div className="flex justify-center  p-2 shadow-md sm:justify-end gap-4 sm:gap-14 mt-4">
              <span className="font-bold text-[15px] text-black">
                TOTAL FARE
              </span>
              <span className="text-[15px] font-bold text-gray-800">
                : ₹
                {(() => {
                  const basicFare =
                    parseFloat(IntercityTicketViewData?.total?.basicFare) || 0;
                  const reservationFee =
                    parseFloat(
                      IntercityTicketViewData?.total?.reservationFee
                    ) || 0;
                  const gstSum =
                    parseFloat(IntercityTicketViewData?.total?.gstSum) || 0;
                  const tollSum =
                    parseFloat(IntercityTicketViewData?.total?.tollSum) || 0;
                  const serviceSum =
                    parseFloat(IntercityTicketViewData?.total?.serviceSum) || 0;
                  const concessionAmt =
                    parseFloat(IntercityTicketViewData?.total?.concessionAmt) ||
                    0;

                  const total =
                    basicFare +
                    reservationFee +
                    gstSum +
                    tollSum +
                    serviceSum +
                    concessionAmt;
                  return total.toFixed(2);
                })()}
              </span>
            </div>
          </div>

          {/* ID Proof Note */}
          <div className="px-2 sm:px-4 lg:px-8 py-4">
            <h3 className="text-base sm:text-lg font-bold text-black pb-2">
              ID Proof Note
            </h3>
            <div className=" rounded-lg">
              <p className="text-xs sm:text-sm font-thin text-gray-500">
                During bus journey, one of the passenger on an e-ticket appears
                should carry the original identity card such as Driving License,
                Election Card, Ration Card, Photo ID card issued by
                Central/State Govt./Private Organisations, adhaarCard, Pan Card,
                Passport, Credit Card with Photo identification, Student ID
                issued by any Institute, Pass Book with Photo issued by any
                Nationalised Bank, CAT CARD issued by APSRTC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntercityTicketView;
