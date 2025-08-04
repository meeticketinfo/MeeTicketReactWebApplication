import UserLayout from "../../../../../../layouts/UserLayout";
import { useLocation } from "react-router-dom";
import { FaDownload, FaPrint } from "react-icons/fa";
import Logo from "../../../../../../images/logo.jpg";
import AmrabadLogo from "../../../../../../images/user/amrabad-new-logo.png";

const TicketViewDetails = ({isScrolled = false}) => {
  const location = useLocation();
  const bookingData = location.state?.bookingData || {
    // Fallback data if no state is passed
    houseName: "Munnanur Jungle Resort, the Tiger Stay Package",
    bookingId: "ATR00089EU",
    guestName: "VENU U",
    mobileNo: "+9196877665123",
    emailId: "test123@gmail.com",
    checkIn: "14-07-2025",
    checkOut: "15-07-2025",
    checkInTime: "12:30PM",
    checkOutTime: "10:30AM",
    numberOfHouses: 2,
    paymentType: "UPI-Phone Pe",
    houses: [
      {
        name: "Chital & Otter",
        checkIn: "14-07-2025",
        checkOut: "15-07-2025",
        actualAmount: 6500,
        discount: 500,
        total: 6000
      },
      {
        name: "Farha - Tree House",
        checkIn: "14-07-2025",
        checkOut: "15-07-2025",
        actualAmount: 7500,
        discount: 500,
        total: 7000
      }
    ],
    grandTotal: 13000
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading ticket...");
  };

  const handlePrint = () => {
    // Implement print functionality
    window.print();
  };

  return (
    <UserLayout>
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        {/* Ticket Container */}
        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          {/* Header with Logos */}
          <div className="flex justify-between items-start px-8 pt-6">
            {/* Left Logo Section */}
            <div className="flex items-center gap-3 p-4">
            <img
              src={Logo}
              alt="Meeticket Logo"
              className={`transition-all duration-300 ${isScrolled ? 'w-[50px] md:w-[60px]' : 'w-[60px] md:w-[85px]'
                }`}
            />
              <div>
                <h1 className="font-bold text-[#362D86] transition-all duration-300 text-2xl md:text-3xl">MEETICKET</h1>
                <p className="text-[#515151] transition-all duration-300 text-[10px] md:text-xs">GOVERNMENT OF TELANGANA</p>
              </div>
            </div>

            {/* Right Logo Section */}
            <div className="text-right">
              <div className="bg-black rounded-full flex items-center justify-center">
              <img src={AmrabadLogo} />
              </div>
              
            </div>
          </div>

          {/* Ticket Title and QR Code */}
          <div className="text-center py-6 border-b border-gray-200">
            <h2 className="text-[#348E20] font-extrabold text-2xl mb-4">Your Ticket</h2>
            <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Code</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{bookingData.houseName}</h3>
          </div>

          {/* Guest and Booking Details */}
          <div className="bg-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Details */}
              <div className="space-y-2">
                <div className="flex">
                <span className="text-black font-bold text-[16px] leading-[24px]">GUEST NAME:</span>
                  <span className="font-semibold">{bookingData.guestName}</span>
                </div>
                <div className="flex">
                  <span className="text-black font-bold text-[16px] leading-[24px]">MOBILE NO:</span>
                  <span className="font-semibold">{bookingData.mobileNo}</span>
                </div>
                <div className="flex">
                  <span className="text-black font-bold text-[16px] leading-[24px]">EMAIL ID:</span>
                  <span className="font-semibold">{bookingData.emailId}</span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-black font-bold text-[16px] leading-[24px]">DATE:</span>
                  <span className="font-semibold">26 July 2025</span>
                </div>
                <div className="flex">
                  <span className="text-black font-bold text-[16px] leading-[24px]">Ticket ID:</span>
                  <span className="font-semibold">#{bookingData.bookingId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-medium text-base mb-4">Package Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{bookingData.houseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-In Time:</span>
                  <span className="font-medium">{bookingData.checkInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-Out Time:</span>
                  <span className="font-medium">{bookingData.checkOutTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Houses:</span>
                  <span className="font-medium">{bookingData.numberOfHouses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Type:</span>
                  <span className="font-medium">{bookingData.paymentType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Table */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-lg mb-4">Booking Details:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">S.No</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">House Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Check-in Date</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Check-out Date</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Actual Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Discount</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.houses.map((house, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="border border-gray-300 px-3 py-2 text-sm">{index + 1}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-medium">{house.name}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{house.checkIn}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{house.checkOut}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">₹{house.actualAmount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-red-600">-₹{house.discount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-semibold">₹{house.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <span className="text-lg font-bold">Grand Total: ₹{bookingData.grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Visitor Instructions */}
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">Visitor Instructions:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Check-in is at 12:30 PM and check-out is by 10:00 AM the next day. Please be punctual to join scheduled safari and trek activities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Valid Government ID proof is mandatory for all guests at the time of check-in.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Evening Jungle Safari and next morning forest trek are included in your package. Meals (dinner/breakfast) must be ordered separately at the camp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Alcohol, smoking, loud music, and plastic items are strictly prohibited inside the resort and forest areas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Follow all safety instructions given by forest staff. Do not feed or disturb wildlife.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 p-6 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaDownload />
              Download Ticket
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaPrint />
              Print Ticket
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default TicketViewDetails;