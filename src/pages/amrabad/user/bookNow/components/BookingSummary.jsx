import { CgSpinner } from "react-icons/cg";
import { useCartStore } from "../../../../../store/amrabad/user/userCartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookingSummary = ({ houseCount, house, discount, finalAmount, isLoading = false, startDate, endDate, userPackage }) => {
  const { addToCart, loadingAddToCart } = useCartStore();
  const navigate = useNavigate();
  
  // Shimmer loading component
  const ShimmerLine = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`}></div>
  );

  // Helper function to combine date with time
  const combineDateWithTime = (date, time) => {
    if (!date || !time) return date;
    
    // Get the date string in YYYY-MM-DD format
    const dateString = date instanceof Date ? 
      date.toISOString().split('T')[0] : 
      new Date(date).toISOString().split('T')[0];
    
    // Combine date and time in local format (YYYY-MM-DDTHH:MM:SS)
    const combinedDateTime = `${dateString}T${time}`;
    
    return combinedDateTime;
  };

  const handleAddToCart = async () => {
    try {
      // Combine dates with check-in and check-out times from userPackage
      const roomFromDateTime = combineDateWithTime(startDate, userPackage?.checkInTime);
      const roomToDateTime = combineDateWithTime(endDate, userPackage?.checkOutTime);

      const response = await addToCart({
        packageId: house?.packageId,
        roomId: house?.roomId,
        roomFromDate: roomFromDateTime,
        roomToDate: roomToDateTime,
        roomCount: houseCount,
        discountAmount: discount,
        amount: finalAmount,
      });
      console.log(response, "response");
      if (response.statusCode === 200) {
        navigate("/amrabad/checkout-details");
        toast.success("Item added to cart");
      } else {
        toast.error(response.response.data.message || "something went wrong");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <ShimmerLine className="w-20" />
              <ShimmerLine className="w-24" />
            </div>

            <div className="flex justify-between items-center">
              <ShimmerLine className="w-16" />
              <ShimmerLine className="w-20" />
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between items-center pt-2">
              <ShimmerLine className="w-40" />
              <ShimmerLine className="w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Booking Summary</h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sub total:</span>
            <span className="text-sm font-medium text-gray-800">
              {houseCount}X ₹{house?.tariffPerDay?.toLocaleString()}
            </span>
          </div>

          {house?.hasDiscount && discount > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Discount:</span>
                <span className="text-sm font-medium text-red-600">
                  -₹{discount.toLocaleString()}
                </span>
              </div>
              <hr className="border-gray-200" />
            </>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold text-gray-800">TOTAL PAYABLE AMOUNT:</span>
            <span className="text-lg font-bold text-[#362D86]">
              ₹{finalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-[#362D86] text-white py-3 rounded-lg font-semibold hover:bg-[#362D86]/90 transition-colors flex items-center justify-between px-4 sm:px-6"
      >
        <span className="text-lg sm:text-xl font-bold">₹{finalAmount.toLocaleString()}</span>
        {loadingAddToCart && <CgSpinner className="animate-spin" />}
        <span className="text-sm sm:text-base">Continue</span>
      </button>
    </>
  );
};

export default BookingSummary; 