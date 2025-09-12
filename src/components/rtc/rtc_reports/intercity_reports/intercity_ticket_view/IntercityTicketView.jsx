import React, { useState } from "react";
import { FaDownload, FaPrint } from "react-icons/fa";
import "./IntercityTicketView.css";
import Logo from "../../../../../images/logo.jpg";
import logo2 from "../../../../../images/logo-2.png";

const IntercityTicketView = ({ ticketData, isScrolled = false }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Default data structure based on the image
  const defaultData = {
    pnrNo: "2040674936",
    ticketNo: "TU9R20117906",
    rjTicketNo: "TU9R20117906",
    serviceCode: "MBXR-ATNR-3612/3612",
    from: "Hyderabad",
    pickPoint: "GACHIBOWLI CITY BUS STOP AXIS BANK HP PETROL BUNK",
    pickupPointAddress: "GACHIBOWLI CITY BUS STOP AXIS BANK HP PETROL BUNK",
    status: "CONFIRMED",
    startTimeAtOrigin: "27-Aug-2025 21:00 hrs",
    uidNumber: "3579",
    dateOfJourney: "27-Aug-2025",
    serviceCategory: "SUPER LUXURY",
    to: "Bengaluru",
    droppingPoint: "Rtc bus stand",
    arrivalOn: "28-Aug-2025 04:30",
    departOn: "27-Aug-2025 21:55",
    noOfSeats: "1",
    concession: "GENERAL PUBLIC",
    passengers: [
      {
        sno: 1,
        name: "MYANA SAI KRISHNA",
        age: 27,
        gender: "MALE",
        seatNo: 31,
      },
    ],
    fareDetails: {
      basicFare: 469,
      reservationLevyFee: 27,
      gst: 27.3,
      tollFee: 36,
      serviceFee: 14,
      concessionAmt: "N/A",
      totalFare: 573.3,
    },
  };

  const data = ticketData || defaultData;

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

      <div className="font-manrope overflow-auto h-screen bg-gray-100 px-2 sm:px-4 py-2 sm:py-4 border">
        {/* Ticket Container */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto">
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
          <div className="flex sm:flex-row justify-between items-start px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 gap-4">
            {/* Left Logo Section */}
            <div className="text-right">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4">
                <img
                  src={logo2}
                  alt="Meeticket Logo"
                  className={`transition-all duration-300 ${
                    isScrolled
                      ? "w-[40px] sm:w-[50px] md:w-[60px]"
                      : "w-[80px] sm:w-[85px] md:w-[100px]"
                  }`}
                />
              </div>
            </div>

            {/* Right Logo Section */}

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4">
              <img
                src={Logo}
                alt="Meeticket Logo"
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "w-[40px] sm:w-[50px] md:w-[60px]"
                    : "w-[80px] sm:w-[85px] md:w-[100px]"
                }`}
              />
            </div>
          </div>

          {/* Important Note */}
          <div className="px-4 sm:px-6 lg:px-8 py-0">
            <div className=" p-4  border-t-2 border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Please Note:</strong> It is mandatory to follow the
                travel guidelines of your source and destination state for
                travel.
              </p>
              <p className="text-sm">
                <strong>View Guidelines:</strong>
                <a
                  href="https://bit.ly/meeticket-guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline ml-1"
                >
                  https://bit.ly/meeticket-guidelines
                </a>
              </p>
            </div>
          </div>

          {/* Reservation Voucher */}
          <div className="px-4 sm:px-6 lg:px-8 py-0">
            <h2 className="text-xl font-bold text-start text-gray-900 mb-4 border-b-2 border-t-2 border-gray-300 pb-2 pt-2">
              RESERVATION VOUCHER
            </h2>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border border-none">
                <tbody>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900 w-48">
                      PNR No.
                    </td>
                    <td className="px-3 py-2 text-gray-900">{data.pnrNo}</td>
                    <td className="px-3 py-2 font-bold text-gray-900 w-48">
                      UID Number
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.uidNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Ticket No.
                    </td>
                    <td className="px-3 py-2 text-gray-900">{data.ticketNo}</td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Date of Journey
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.dateOfJourney}
                    </td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">
                      RJ Ticket No.
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.rjTicketNo}
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Service Category
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.serviceCategory}
                    </td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Service Code/Name
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.serviceCode}
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-900">To</td>
                    <td className="px-3 py-2 text-gray-900">{data.to}</td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">From</td>
                    <td className="px-3 py-2 text-gray-900">{data.from}</td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Dropping Point
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.droppingPoint}
                    </td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Pick Point
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.pickPoint}
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Arrival On
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.arrivalOn}
                    </td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Pickup Point Address
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.pickupPointAddress}
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Depart On
                    </td>
                    <td className="px-3 py-2 text-gray-900">{data.departOn}</td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Status
                    </td>
                    <td className="px-3 py-2 text-gray-900">{data.status}</td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      No. of Seats
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.noOfSeats}
                    </td>
                  </tr>
                  <tr className="border-b border-none">
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Start Time at Origin
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.startTimeAtOrigin}
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      Concession
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {data.concession}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">PNR No.</span>
                    <span className="text-gray-900">{data.pnrNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Ticket No.</span>
                    <span className="text-gray-900">{data.ticketNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      RJ Ticket No.
                    </span>
                    <span className="text-gray-900">{data.rjTicketNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      Service Code/Name
                    </span>
                    <span className="text-gray-900 text-right">
                      {data.serviceCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">From</span>
                    <span className="text-gray-900">{data.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Pick Point</span>
                    <span className="text-gray-900 text-right">
                      {data.pickPoint}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">
                      Pickup Point Address
                    </span>
                    <span className="text-gray-900 text-sm mt-1">
                      {data.pickupPointAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Status</span>
                    <span className="text-gray-900">{data.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      Start Time at Origin
                    </span>
                    <span className="text-gray-900 text-right">
                      {data.startTimeAtOrigin}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">UID Number</span>
                    <span className="text-gray-900">{data.uidNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      Date of Journey
                    </span>
                    <span className="text-gray-900">{data.dateOfJourney}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      Service Category
                    </span>
                    <span className="text-gray-900">
                      {data.serviceCategory}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">To</span>
                    <span className="text-gray-900">{data.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      Dropping Point
                    </span>
                    <span className="text-gray-900">{data.droppingPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Arrival On</span>
                    <span className="text-gray-900">{data.arrivalOn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Depart On</span>
                    <span className="text-gray-900">{data.departOn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      No. of Seats
                    </span>
                    <span className="text-gray-900">{data.noOfSeats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Concession</span>
                    <span className="text-gray-900">{data.concession}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              PASSENGER DETAILS
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left text-sm font-semibold text-blue-600">
                      S.No
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-blue-600">
                      Name
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-semibold text-blue-600">
                      Age
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-semibold text-blue-600">
                      Gender
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-semibold text-blue-600">
                      Seat No.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.passengers.map((passenger, index) => (
                    <tr key={index} className="border-b border-gray-200 md:table-row block bg-gray-50 mb-3 rounded-lg">
                      <td className="px-3 py-2 text-sm md:table-cell block">
                        <div className="flex justify-between md:contents">
                          <span className="font-bold text-gray-900 md:hidden">S.No</span>
                          <span>{passenger.sno}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm font-medium md:table-cell block">
                        <div className="flex justify-between md:contents">
                          <span className="font-bold text-gray-900 md:hidden">Name</span>
                          <span className="text-right md:text-left">{passenger.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-center md:table-cell block">
                        <div className="flex justify-between md:contents">
                          <span className="font-bold text-gray-900 md:hidden">Age</span>
                          <span>{passenger.age}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-center md:table-cell block">
                        <div className="flex justify-between md:contents">
                          <span className="font-bold text-gray-900 md:hidden">Gender</span>
                          <span>{passenger.gender}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-center md:table-cell block">
                        <div className="flex justify-between md:contents">
                          <span className="font-bold text-gray-900 md:hidden">Seat No.</span>
                          <span>{passenger.seatNo}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fare Details */}
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h3 className="text-lg text-gray-900 font-bold mb-4 border-b-2 border-gray-300 pb-2">
              FARE DETAILS
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Basic Fare</span>
                  <span className="text-gray-900">
                    ₹ {data.fareDetails.basicFare}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">
                    Reservation & Levy Fee
                  </span>
                  <span className="text-gray-900">
                    ₹ {data.fareDetails.reservationLevyFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">GST</span>
                  <span className="text-gray-900">
                    ₹ {data.fareDetails.gst}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Toll Fee</span>
                  <span className="text-gray-900">
                    ₹ {data.fareDetails.tollFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Service Fee</span>
                  <span className="text-gray-900">
                    ₹ {data.fareDetails.serviceFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">
                    Concession Amt
                  </span>
                  <span className="text-gray-900">
                    {data.fareDetails.concessionAmt}
                  </span>
                </div>
              </div>
            </div>
            {/* Horizontal Line */}
            <div className="mt-4 mb-4 border-t border-gray-300"></div>
            {/* Total Fare */}
            <div className="flex justify-center sm:justify-end gap-4 sm:gap-14 mt-4">
              <span className="text-lg font-bold text-gray-900">
                TOTAL FARE :
              </span>
              <span className="text-xl font-bold text-gray-900">
                ₹ {data.fareDetails.totalFare}
              </span>
            </div>
          </div>

          {/* ID Proof Note */}
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              ID Proof Note
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
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
