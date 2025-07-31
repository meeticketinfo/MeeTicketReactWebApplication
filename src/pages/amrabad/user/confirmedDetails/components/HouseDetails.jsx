const HouseDetails = ({ houses }) => {
  return (
    <div className="">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">House details:</h2>
      <div className="space-y-3 sm:space-y-4">
        {houses.map((house, idx) => (
          <div key={house.bookingId} className="bg-gray-50 rounded p-3 sm:p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center text-xs sm:text-sm">
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
  );
};

export default HouseDetails;