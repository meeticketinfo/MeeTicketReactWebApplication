import React, { useEffect, useState } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { BsTrash } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../../store/amrabad/user/userCartStore";
import CheckoutDetailsShimmer from "../../shimmer/CheckoutDetailsShimmer";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";

const CheckoutDetails = () => {
  const { 
    cartItems, 
    loadingCart, 
    fetchCartItems, 
    removeFromCart, 
    removingCartItems,
    clearCart, 
    loadingClearCart 
  } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Show shimmer while loading
  if (loadingCart) {
    return (
      <UserLayout>
        <CheckoutDetailsShimmer />
      </UserLayout>
    );
  }

  // Show empty state if no cart items - handle API response structure
  if (!cartItems?.data || cartItems?.data?.length === 0) {
    return (
      <UserLayout>
        <div className="container mx-auto">
          <div className="p-2 sm:p-4 bg-[#F6F7FB]">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-gray-500 text-lg mb-4">Your cart is empty</div>
              <Link
                to="/amrabad-resort/packages"
                className="text-blue-600 hover:text-blue-800 underline font-semibold"
              >
                Browse Packages
              </Link>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Get data from API response with optional chaining
  const cartData = cartItems?.data || [];
  const subTotal = cartItems?.amount || 0;
  const discount = cartItems?.discountAmount || 0;
  const totalPayable = cartItems?.grandTotal || 0;

  // Group cart items by package for better display
  const groupedCartItems = cartData?.reduce((groups, item) => {
    const key = item?.packageId;
    if (!groups[key]) {
      groups[key] = {
        packageId: item?.packageId,
        packageName: item?.packageName,
        houseName: item?.houseName,
        houseImageUrl: item?.houseImageUrl,
        items: []
      };
    }
    groups[key].items.push(item);
    return groups;
  }, {}) || {};

  const handleRemoveFromCart = async (cartItemId) => {
    const response = await removeFromCart(cartItemId);
    // console.log(response, "response");
    if (response?.statusCode === 200) {
      toast.success(response?.message || "Item removed from cart");
      fetchCartItems();
    } else {
      toast.error(response?.response?.data?.message || "Something went wrong");
    }
  };

  const handleClearCart = async () => {
    const response = await clearCart();
    if (response?.statusCode === 200) {
      toast.success(response?.message || "Cart cleared");
      fetchCartItems();
    } else {
      toast.error(response?.response?.data?.message || "Something went wrong");
    }
  };
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

  return (
    <UserLayout>
      <div className="container mx-auto py-4">
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left: House & Room Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <Link to={`/amrabad-resort`} className="text-blue-700 text-sm font-semibold hover:underline self-start sm:self-center mb-4 block">
                + Add More Packages
              </Link>
              <button onClick={handleClearCart} className="bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:underline self-start sm:self-center ms-auto mb-4 flex items-center whitespace-nowrap">
                Clear Cart
                {loadingClearCart ? <CgSpinner className="animate-spin ml-2" /> : null}
              </button>
            </div>

            {Object.values(groupedCartItems).map((group) => {
              // Calculate totals for this specific group
              const groupTotals = group.items?.reduce((totals, item) => {
                totals.amount += item?.amount || 0;
                totals.discountAmount += item?.discountAmount || 0;
                totals.cartTotalAmount += item?.cartTotalAmount || 0;
                return totals;
              }, { amount: 0, discountAmount: 0, cartTotalAmount: 0 });

              return (
                <div key={group?.packageId} className="mb-6">
                  {/* Package Header */}

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm border rounded-lg mb-4">
                      <thead className="bg-[#F6F7FB]">
                        <tr>
                          <th className="p-2 text-left font-semibold min-w-[260px]">House Name</th>
                          <th className="p-2 text-center font-semibold whitespace-nowrap">Room Count</th>
                          <th className="p-2 text-center font-semibold whitespace-nowrap">Check-in</th>
                          <th className="p-2 text-center font-semibold whitespace-nowrap">Check-out</th>
                          <th className="p-2 text-center font-semibold">Amount</th>
                          <th className="p-2 text-center font-semibold">Discount</th>
                          <th className="p-2 text-center font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group?.items?.map((item) => {
                          const isRemoving = removingCartItems?.[item?.cartId];
                          return (
                            <tr key={item?.cartId} className="border-t">
                              <td className="p-2">
                                <div className="flex items-center gap-1 sm:gap-3">
                                  <button 
                                    className={`text-red-600 text-sm font-semibold hover:bg-red-50 p-1 border border-red-600 rounded-md ${isRemoving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => handleRemoveFromCart(item?.cartId)}
                                    disabled={isRemoving}
                                  >
                                    {isRemoving ? <CgSpinner className="animate-spin" /> : <BsTrash />}
                                  </button>
                                  <img
                                    src={item?.houseImageUrl}
                                    alt={item?.houseName || 'House'}
                                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/images/placeholder-house.jpg';
                                    }}
                                  />
                                  <div className="flex-1">
                                    <div className="font-bold text-base sm:text-lg text-gray-800">{item?.houseName || 'House Name'}</div>
                                    <div className="text-xs text-gray-500">{item?.packageName || 'Package Name'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 text-center">{item?.roomCount || 0}</td>
                              <td className="p-2 text-center">
                                {item?.roomFromDate ? formatDateTime(item.roomFromDate) : '-'}
                              </td>
                              <td className="p-2 text-center">
                                {item?.roomToDate ? formatDateTime(item.roomToDate) : '-'}
                              </td>
                              <td className="p-2 text-center">₹{(item?.amount || 0)?.toLocaleString()}</td>
                              <td className="p-2 text-center text-red-600">
                                -₹{(item?.discountAmount || 0)?.toLocaleString()}
                              </td>
                              <td className="p-2 text-center font-semibold">
                                ₹{(item?.cartTotalAmount || 0)?.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="bg-[#F6F7FB] rounded-lg p-3 sm:p-4 mb-4">
                    <div className="flex justify-between text-gray-700 mb-1 text-sm sm:text-base">
                      <span>Sub total</span>
                      <span>₹{groupTotals.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 mb-1 text-sm sm:text-base">
                      <span>Discount</span>
                      <span className="text-red-600">
                        -₹{groupTotals.discountAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-base sm:text-lg mt-2">
                      <span>TOTAL PAYABLE AMOUNT</span>
                      <span className="text-blue-900">
                        ₹{groupTotals.cartTotalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Cart Total */}
          <div className="w-full lg:max-w-[300px]">
            <div className="bg-[#F6F7FB] rounded-lg p-4 sm:p-6">
              <div className="text-base sm:text-lg font-semibold mb-4">CART TOTAL</div>
              <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                <span>Sub-total</span>
                <span>₹{subTotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                <span>Discount</span>
                <span className="text-red-600">-₹{discount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-base sm:text-lg border-t border-gray-200 pt-2 mb-6">
                <span>Total</span>
                <span>₹{totalPayable?.toLocaleString()}</span>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold transition text-sm sm:text-base bg-[#362D86] hover:bg-blue-800"
                onClick={() => navigate("/amrabad-resort/booking-details")}
              >
                Proceed to checkout
                <IoArrowForward className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutDetails;