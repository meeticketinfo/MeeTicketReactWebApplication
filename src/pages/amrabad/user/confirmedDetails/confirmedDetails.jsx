import UserLayout from "../../../../layouts/UserLayout";
import { FaCheckCircle, FaQrcode, FaDownload } from "react-icons/fa";

const ConfirmedDetails = () => {
  // Static data
  const bookingData = {
    customer: {
      name: "Venu",
      phone: "+91 0000000521",
      email: "venu.r18@gmail.com",
    },
    booking: {
      package: "Mrunmar Jungle Resort, the Tiger Stay Package",
      checkIn: "14 JULY 2025, 12:30 PM",
      checkOut: "16 JULY 2025, 10:00 AM",
    },
    houses: [
      {
        name: "Chital and Otter",
        category: "Standard",
        price: 8450,
        bookingId: "MTI000124",
      },
      {
        name: "Fanha – Tree House",
        category: "Standard",
        price: 8250,
        bookingId: "MTI000164",
      },
    ],
    payment: {
      houseCharges: 17000,
      discount: "N/A",
      totalPaid: 11700,
    },
  };

  return (
    <UserLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg p-6">
          {/* Confirmation Banner */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-center gap-3 mb-6">
            <div>
              <div className="font-semibold text-black flex items-center gap-2 mb-3"><FaCheckCircle className="text-green-600 text-2xl" /> Booking Confirmed!</div>
              <div className="text-black text-sm">
                Thank you for your reservation. Your stay has been successfully booked.
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Customer Details */}
                <div className="max-w-[400px] flex-1">
                  <h2 className="text-lg font-semibold mb-4 text-black">Customer details:</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{bookingData.customer.name} U</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">+91 9000456321</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">venu 111@gmail.com</span>
                    </div>
                  </div>
                </div>


                {/* QR and Download Section */}
                <div className="flex flex-col gap-6 min-w-[220px]">
                  <div className=" p-6 flex flex-col items-center">
                    <img src="https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg" alt="logo" className="w-[150px] h-[150px] object-cover" />
                    <div className="text-xs text-gray-500 mb-2">Scan to view booking</div>
                    <button className="bg-[#362D86] hover:bg-indigo-800  text-white px-4 py-2 rounded flex items-center gap-2 mt-2">
                      <FaDownload />
                      Download Ticket
                    </button>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="">
                <h2 className="text-lg font-semibold mb-4 text-black">Booking details:</h2>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-bold text-black">Package:</span> {bookingData.booking.package}
                  </div>
                  <div>
                    <span className="font-bold text-black">Check-in:</span> {bookingData.booking.checkIn}
                  </div>
                  <div>
                    <span className="font-bold text-black">Check-out:</span> {bookingData.booking.checkOut}
                  </div>
                </div>
              </div>

              {/* House Details */}
              <div className="">
                <h2 className="text-lg font-semibold mb-4 text-black">House details:</h2>
                <div className="space-y-4">
                  {bookingData.houses.map((house, idx) => (
                    <div key={house.bookingId} className="bg-gray-50 rounded p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center  text-sm">
                        <div>
                          <div className="font-bold text-black mb-2">
                            House {idx + 1}: {house.name}
                          </div>
                          <div className="text-gray-500">Category: {house.category}</div>
                          <div className="text-gray-500">Price: ₹{house.price.toLocaleString()}</div>
                          <div className="text-gray-500">Booking#: {house.bookingId}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="max-w-[400px]">
                <h2 className="text-lg font-semibold mb-4 text-black">Payment Summary:</h2>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-black">House charges:</span>
                    <span className="font-bold text-black">₹{bookingData.payment.houseCharges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Discount Applied:</span>
                    <span className="font-bold">{bookingData.payment.discount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span className="font-bold text-black">TOTAL PAID:</span>
                    <span className="font-bold text-black">₹{bookingData.payment.totalPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ConfirmedDetails;