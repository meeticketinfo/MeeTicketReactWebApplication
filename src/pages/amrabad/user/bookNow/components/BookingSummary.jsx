import { useState, useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { useCartStore } from "../../../../../store/amrabad/user/userCartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookingSummary = ({ houseCount, house, discount, finalAmount, subTotal, isLoading = false, startDate, endDate, userPackage }) => {
  const { addToCart, loadingAddToCart, cartItems, fetchCartItems } = useCartStore();
  const navigate = useNavigate();
  const [conflictModal, setConflictModal] = useState(null); // { existingPackageName, existingPackageId }

  useEffect(() => {
    fetchCartItems();
  }, []);

  const ShimmerLine = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`}></div>
  );
  // Calculate discount percentage
  const discountPercentage = subTotal && discount > 0 ? Math.round((discount / subTotal) * 100) : 0;

  // Nights between check-in and check-out
  const nights = (() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate); start.setHours(0, 0, 0, 0);
    const end = new Date(endDate); end.setHours(0, 0, 0, 0);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  })();

  const pricePerNight = house?.tariffPerDay || 0;

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
    // Check if cart has items from a different package
    const existingItems = cartItems?.data || [];
    if (existingItems.length > 0) {
      const existingPackageId = existingItems[0]?.packageId;
      if (existingPackageId && existingPackageId !== house?.packageId) {
        setConflictModal({
          existingPackageName: existingItems[0]?.packageName || "another package",
        });
        return;
      }
    }

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
        navigate("/amrabad-resort/checkout-details");
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
      <div className="bg-white rounded-lg p-4 mb-4 border border-[#D0D7CE] shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
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
      {/* Package conflict modal */}
      {conflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-gray-800 mb-2">Different Package in Cart</h3>
            <p className="text-sm text-gray-600 mb-4">
              You already have rooms from <span className="font-semibold text-gray-800">"{conflictModal.existingPackageName}"</span> in your cart.
              To book a different package, please complete or clear your current booking first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/amrabad-resort/checkout-details")}
                className="flex-1 bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                Go to Cart
              </button>
              <button
                onClick={() => setConflictModal(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 mb-4 border border-[#D0D7CE] shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Booking Summary</h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Cottages:</span>
            <span className="text-sm font-medium text-gray-800">{houseCount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cottage Fare:</span>
            <span className="text-sm font-medium text-gray-800">
              {nights} {nights === 1 ? "night" : "nights"} × ₹{pricePerNight.toLocaleString()}
            </span>
          </div>

          {discount > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Discount:</span>
                <span className="text-sm font-medium text-red-600">
                  -₹{discount.toLocaleString()} ({discountPercentage}%)
                </span>
              </div>
              <hr className="border-gray-200" />
            </>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold text-gray-800">TOTAL PAYABLE AMOUNT:</span>
            <span className="text-lg font-bold text-[#c4a97a]">
              ₹{finalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={houseCount === 0}
        className="w-full bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] hover:opacity-90 py-3 rounded-lg font-semibold transition-colors flex items-center justify-between px-4 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-lg sm:text-xl font-bold">₹{finalAmount.toLocaleString()}</span>
        {loadingAddToCart && <CgSpinner className="animate-spin" />}
        <span className="text-sm sm:text-base">Add to Cart</span>
      </button>
    </>
  );
};

export default BookingSummary; 