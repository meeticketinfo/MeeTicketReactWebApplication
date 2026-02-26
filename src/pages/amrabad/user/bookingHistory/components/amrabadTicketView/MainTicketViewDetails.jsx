import UserLayout from "../../../../../../layouts/UserLayout";
import { useLocation, useParams } from "react-router-dom";
import { FaDownload, FaPrint } from "react-icons/fa";
import Logo from "../../../../../../images/logo.jpg";
import AmrabadLogo from "../../../../../../images/user/amrabad-new-logo.png";
import { useUserBookingStore } from "../../../../../../store/amrabad/user/userBookingStore";
import { useEffect, useState } from "react";
import { formatDateTimeToReadable } from "../../../../../../utils/Helper";
import { downloadTicketReliable } from "../amrabadBookingHistory/pdfDownloader";
import DeccaanTrailsLogo from "../../../../../../images/user/DeccanTrailsLogo.png";

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();
};

const TicketViewDetails = ({ isScrolled = false }) => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false); // Prevent multiple auto-downloads

  const {
    fetchTicketViewDetails,
    GetTicketViewDetails,
    isTicketViewDetailsLoading,
  } = useUserBookingStore();

  useEffect(() => {
    fetchTicketViewDetails(bookingId);
  }, []);

  // Auto-trigger PDF download when page loads with download parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const shouldDownload = urlParams.get('download');
    
    if (shouldDownload === 'true' && GetTicketViewDetails && !isTicketViewDetailsLoading && !isDownloading && !hasAutoDownloaded) {
      setIsDownloading(true);
      setHasAutoDownloaded(true);
      
      setTimeout(async () => {
        try {
          const filename = `amrabad-ticket-${GetTicketViewDetails?.bookingItems?.[0]?.bookingId||'unknown'}.pdf`;
          console.log('Auto-downloading PDF:', filename);
          
          const success = await downloadTicketReliable(filename);
          
          if (success) {
            console.log('Auto-download successful');
          } else {
            console.log('Auto-download failed');
            alert('PDF download failed. Please try the manual download button.');
          }
        } catch (error) {
          console.error('Auto-download error:', error);
          alert('PDF download failed. Please try the manual download button.');
        } finally {
          setIsDownloading(false);
        }
      }, 2500);
    }
  }, [GetTicketViewDetails, isTicketViewDetailsLoading, location.search, isDownloading, hasAutoDownloaded]);

  // Manual download handler
  const handleManualDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const filename = `amrabad-ticket.pdf`;
      console.log('Manual downloading PDF:', filename);
      
      const success = await downloadTicketReliable(filename);
      
      if (!success) {
        alert('PDF download failed. Please try again or refresh the page.');
      }
      
    } catch (error) {
      console.error('Manual download error:', error);
      alert('PDF download failed. Please try again or refresh the page.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Show loading state while data is being fetched
  if (isTicketViewDetailsLoading || !GetTicketViewDetails || !GetTicketViewDetails.bookingItems) {
    return (
      <div className="font-manrope overflow-auto h-screen bg-gray-100 px-2 sm:px-4 py-2 sm:py-4 border">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isDownloading ? 'Preparing PDF download...' : 'Loading ticket details...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .bg-gray-100 { background: white !important; }
          .shadow-lg { box-shadow: none !important; }
          .overflow-auto { overflow: visible !important; }
          .h-screen { height: auto !important; }
          .print-hide { display: none !important; }
          .border { border: none !important; }
        }
      `}</style>
      
      <div className="font-manrope overflow-auto h-screen bg-gray-100 px-2 sm:px-4 py-2 sm:py-4 border">
        {/* Ticket Container */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto ticket-container">
          {/* Download button */}
          <div className="flex justify-end p-4 print-hide">
            <button
              onClick={handleManualDownload}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDownloading 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-[#C4A97A] text-white hover:bg-[#e7cb9a] hover:text-white'
              }`}
            >
              <FaDownload />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>

          {/* Show downloading indicator */}
          {/* {isDownloading && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating PDF...</p>
              </div>
            </div>
          )} */}

          {/* Header with Logos */}
          <div className="flex sm:flex-row justify-between items-start px-4 sm:px-6 lg:px-8  gap-4">
            {/* Left Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4">
              <img
                src={DeccaanTrailsLogo}
                alt="Meeticket Logo"
                className={`transition-all duration-300 ${isScrolled ? "w-[40px] sm:w-[50px] md:w-[60px]" : "w-[50px] sm:w-[60px] md:w-[85px]"
                  }`}
              />
              {/* <div>
                <h1 className="font-bold text-[#362D86] transition-all duration-300 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  MEETICKET
                </h1>
                <p className="text-[#515151] transition-all duration-300 text-[8px] sm:text-[10px] md:text-xs">
                  GOVERNMENT OF TELANGANA
                </p>
              </div> */}
            </div>

            {/* Right Logo Section */}
            {/* <div className="text-right">
              <div className="bg-black rounded-full flex items-center justify-center w-[80px] h-[75px] sm:w-[129px] sm:h-[125px]">
                <img src={AmrabadLogo} />
              </div>
            </div> */}
          </div>

          {/* Ticket Title and QR Code */}
          <div className="text-center pb-4 sm:pb-6">
            {/* <h2 className="text-[#348E20] font-extrabold text-xl sm:text-2xl">
              Your Ticket
            </h2> */}
            <div className="w-[100px] h-[100px] sm:w-[139px] sm:h-[139px] bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <img
                src={GetTicketViewDetails?.qrCodeBase64 || ''}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-800 px-2">
              {GetTicketViewDetails?.bookingItems?.[0]?.packageName || 'Package Name Not Available'}
            </h3>
          </div>
          <div className="px-3 sm:px-6">
            {/* Guest and Booking Details */}
            <div className="bg-[#FDFAF7] border bordder-[#C8BFB2] py-2 px-3 sm:px-4 rounded-sm shadow-md">
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                {/* Guest Details */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="text-[#3f2508]/80 font-bold text-sm leading-[20px] sm:leading-[24px]">
                      GUEST NAME:
                    </span>
                    <span className="font-medium text-black text-sm sm:text-base">
                      {GetTicketViewDetails?.bookingItems?.[0]?.fullName || 'Not Available'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="text-[#3f2508]/80 font-bold text-sm  leading-[20px] sm:leading-[24px]">
                      MOBILE NO:
                    </span>
                    <span className="font-medium text-black text-sm sm:text-base">
                      {GetTicketViewDetails?.bookingItems?.[0]?.mobileNumber || 'Not Available'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="text-[#3f2508]/80 font-bold text-sm  leading-[20px] sm:leading-[24px]">
                      EMAIL ID:
                    </span>
                    <span className="font-medium text-black text-sm sm:text-base">
                      {GetTicketViewDetails?.bookingItems?.[0]?.emailId || 'Not Available'}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="text-[#3f2508]/80 font-bold text-sm  leading-[20px] sm:leading-[24px]">
                      DATE:
                    </span>
                    <span className="font-medium text-black text-sm sm:text-base">
                      {GetTicketViewDetails?.bookingItems?.[0]?.bookingDate ? formatDateTime(GetTicketViewDetails?.bookingItems?.[0]?.bookingDate) : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="text-[#3f2508]/80 font-bold text-sm  leading-[20px] sm:leading-[24px]">
                      Ticket ID:
                    </span>
                    <span className="font-medium text-black text-sm sm:text-base">#{GetTicketViewDetails?.bookingItems?.[0]?.bookingId}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="text-[#3f2508]/80 font-bold text-sm  leading-[20px] sm:leading-[24px]">
                      PAYMENT TYPE:
                    </span>
                    <span className="font-medium text-black text-sm sm:text-base">
                      {GetTicketViewDetails?.bookingItems?.[0]?.paymentMode || 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            {/* <div className="py-4 sm:py-6 flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <h3 className="font-medium text-gray-500 text-sm mb-1">
                  Package Details:
                </h3>
                <span className="font-medium text-black text-sm sm:text-base">
                  {GetTicketViewDetails?.bookingItems?.[0]?.packageName || 'Package Name Not Available'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-48">
                <div className="flex flex-col gap-2 sm:gap-4 pr-0 sm:pr-6">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-500 text-sm mb-1">
                      Payment Type:
                    </span>
                    <span className="font-medium text-black text-sm sm:text-base">
                      {GetTicketViewDetails?.bookingItems?.[0]?.paymentMode || 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Booking Details Table */}
            <div className="py-3 mt-4">
              <h3 className="font-bold text-base sm:text-lg mb-4 text-[#C4A97A]">
                Booking Details:
              </h3>
              <div className="overflow-x-auto shadow-md rounded-md">
                <table className="w-full border border-gray-100 min-w-[600px]">
                  <thead>
                    <tr className="bg-[#FDFAF7] shadow text-[#3f2508]/80">
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold">
                        S.No
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold">
                        Package Name
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">
                        House Name
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold whitespace-nowrap" >
                        House Count
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold">
                        Check-in Date
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold">
                        Check-out Date
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">
                        Actual Amount
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold">
                        Discount
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {GetTicketViewDetails?.bookingItems?.map((house, index) => (
                      <tr key={index} className="">
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-xs">{index + 1}</td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-xs font-medium ">
                          {house.packageName ? house.packageName : "N/A"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-xs font-medium">
                          {house.roomName ? house.roomName : "N/A"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-xs">{house.roomCount}</td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-xs">{house.checkIn ? formatDateTime(house.checkIn) : "N/A"}</td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-xs">{house.checkOut ? formatDateTime(house.checkOut) : "N/A"}</td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-xs">
                          {house.totalTariff
                            ? `₹${house.totalTariff.toLocaleString()}`
                            : "0"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-red-600">
                          -{house.discountValuePerRecord
                            ? `₹${house.discountValuePerRecord.toLocaleString()}`
                            : "0"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold">
                          {house.amountAfterDiscount
                            ? `₹${house.amountAfterDiscount.toLocaleString()}`
                            : "0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <div className="flex justify-end gap-8 sm:gap-16 lg:gap-24  ">
                  <span className="text-base sm:text-lg font-bold text-black">
                    Grand Total:
                  </span>
                  <span className="text-base sm:text-lg font-bold text-black pr-2 sm:pr-8">
                    ₹
                    {GetTicketViewDetails?.totals.totalAfterDiscount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Visitor Instructions */}
            <div className="py-4">
              <h3 className="font-bold text-[#C4A97A] text-sm sm:text-base mb-3 sm:mb-4">
                Visitor Instructions:
              </h3>
              <ul className="space-y-2 text-xs sm:text-[14px] text-gray-700">
                <li className="flex items-start gap-2 text-[#7B7979]">
                  <span className="text-black mt-1">•</span>
                  <span>
                    Check-in is at 12:30 PM and check-out is by 10:00 AM the next
                    day. Please be punctual to join scheduled safari and trek
                    activities.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-[#7B7979]">
                  <span className="text-black mt-1">•</span>
                  <span>
                    Valid Government ID proof is mandatory for all guests at the
                    time of check-in.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-[#7B7979]">
                  <span className="text-black mt-1">•</span>
                  <span>
                    Evening Jungle Safari and next morning forest trek are
                    included in your package. Meals (dinner/breakfast) must be
                    ordered separately at the camp.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-[#7B7979]">
                  <span className="text-black mt-1">•</span>
                  <span>
                    Alcohol, smoking, loud music, and plastic items are strictly
                    prohibited inside the resort and forest areas.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-[#7B7979]">
                  <span className="text-black mt-1">•</span>
                  <span>
                    Follow all safety instructions given by forest staff. Do not
                    feed or disturb wildlife.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketViewDetails;
