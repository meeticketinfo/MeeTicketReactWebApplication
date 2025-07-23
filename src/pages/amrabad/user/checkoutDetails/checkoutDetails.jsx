import React, { useState } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { BsTrash } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

// Demo data for houses and rooms
const initialHouses = [
  {
    id: 1,
    name: "CHITAL AND OTTER",
    image: "https://amrabadtigerreserve.com/wp-content/uploads/2023/01/20230412_162323-1024x768.jpg",
    checkIn: "18-May-2025",
    checkOut: "21-May-2025",
    rooms: [
      {
        id: 1,
        name: "Chital & Otter",
        numRooms: 1,
        actualPrice: 6250,
        discount: 625,
        total: 5625,
      },
      {
        id: 2,
        name: "Partha - TreeHouse",
        numRooms: 1,
        actualPrice: 7000,
        discount: 350,
        total: 6650,
      },
    ],
  },
];

const CheckoutDetails = () => {
  const [houses, setHouses] = useState(initialHouses);
  const navigate = useNavigate();
  // Calculate totals
  const subTotal = houses.reduce(
    (sum, house) =>
      sum +
      house.rooms.reduce((rSum, r) => rSum + r.actualPrice, 0),
    0
  );
  const discount = houses.reduce(
    (sum, house) =>
      sum +
      house.rooms.reduce((rSum, r) => rSum + r.discount, 0),
    0
  );
  const totalPayable = subTotal - discount;

  // Check if all rooms are removed
  const allRoomsRemoved = houses.every(house => house.rooms.length === 0);

  // Remove a room
  const handleRemoveRoom = (houseId, roomId) => {
    setHouses((prev) =>
      prev
        .map((house) => {
          if (house.id !== houseId) return house;
          return {
            ...house,
            rooms: house.rooms.filter((room) => room.id !== roomId),
          };
        })
        .filter((house) => house.rooms.length > 0)
    );
  };

  // Proceed to checkout

  return (
    <UserLayout>
      <div className="container mx-auto">
        <div className="p-4 md:p-8 bg-[#F6F7FB]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link
              className="text-[#362D86] hover:text-[#362D86]/80 font-semibold"
              to="/amarabad"
            >
              Home
            </Link>
            <span className="text-gray-400"> &gt; </span>
            <Link
              className="text-[#362D86] hover:text-[#362D86]/80 font-semibold"
              to="/amarabad/packages"
            >
              Amrabad Resorts
            </Link>
            <span className="text-gray-400"> &gt; </span>
            <Link
              className="text-[#362D86] hover:text-[#362D86]/80 font-semibold"
              to="/amarabad/packages/munnanur-jungle-resort-the-tiger-stay-package"
            >
              Munnar Jungle resort
            </Link>
            <span className="text-gray-400"> &gt; </span>
            <Link
              className="text-[#362D86] hover:text-[#362D86]/80 font-semibold"
              to="/amarabad/houses/chital-and-otter"
            >
              List of houses
            </Link>
            <span className="text-gray-400"> &gt; </span>
            <span className="text-gray-800 font-semibold">Chital & Otter</span>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Left: House & Room Details */}
            <div className="flex-1 min-w-[320px]">
              {allRoomsRemoved ? (
                // Show Add House button when all rooms are removed
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">No houses selected</div>

                  <Link to={`/amarabad/houses/munnar-jungle-resort-the-tiger-stay-package`} className="ml-auto text-blue-700 text-sm font-semibold hover:underline">
                    + Add Houses
                  </Link>
                </div>
              ) : (
                houses.map((house) => (
                  <div key={house.id}>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={house.image}
                        alt={house.name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div>
                        <div className="font-bold text-lg text-gray-800">{house.name}</div>
                        <div className="text-xs text-gray-500">
                          Check-in: {house.checkIn} &nbsp; | &nbsp; Check-out: {house.checkOut}
                        </div>
                      </div>
                      <Link to={`/amarabad/houses/munnar-jungle-resort-the-tiger-stay-package`} className="ml-auto text-blue-700 text-sm font-semibold hover:underline">
                        + Add Houses
                      </Link>
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border rounded-lg mb-4">
                        <thead className="bg-[#F6F7FB]">
                          <tr>
                            <th className="p-2 text-left font-semibold">Name</th>
                            <th className="p-2 text-center font-semibold">No. of Houses</th>
                            <th className="p-2 text-center font-semibold">Actual Price</th>
                            <th className="p-2 text-center font-semibold">Discount</th>
                            <th className="p-2 text-center font-semibold">Total</th>
                            <th className="p-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {house.rooms.map((room) => (
                            <tr key={room.id} className="border-t">
                              <td className="p-2">{room.name}</td>
                              <td className="p-2 text-center">{room.numRooms}</td>
                              <td className="p-2 text-center">₹{room.actualPrice.toLocaleString()}</td>
                              <td className="p-2 text-center text-red-600">-₹{room.discount.toLocaleString()}</td>
                              <td className="p-2 text-center font-semibold">₹{room.total.toLocaleString()}</td>
                              <td className="p-2 text-center">
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveRoom(house.id, room.id)}
                                  title="Remove"
                                >
                                  <BsTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Summary */}
                    <div className="bg-[#F6F7FB] rounded-lg p-4 mb-4">
                      <div className="flex justify-between text-gray-700 mb-1">
                        <span>Sub total</span>
                        <span>₹{subTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 mb-1">
                        <span>Discount</span>
                        <span className="text-red-600">-₹{discount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-2">
                        <span>TOTAL PAYABLE AMOUNT</span>
                        <span className="text-blue-900">₹{totalPayable.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Cart Total */}
            <div className="w-full max-w-[400px]">
              <div className="bg-[#F6F7FB] rounded-lg p-6">
                <div className="text-lg font-semibold mb-4">CART TOTAL</div>
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Sub-total</span>
                  <span>₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mb-6">
                  <span>Total</span>
                  <span>₹{totalPayable.toLocaleString()}</span>
                </div>
                <button
                  className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold transition ${allRoomsRemoved
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#362D86] hover:bg-blue-800'
                    }`}
                  onClick={() => navigate("/amarabad/booking-details")}
                  disabled={allRoomsRemoved}
                >
                  Proceed to checkout
                  <IoArrowForward className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutDetails;