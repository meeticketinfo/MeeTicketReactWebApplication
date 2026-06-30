import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Skeleton loader component for BookingSummary
const BookingSummarySkeleton = () => {
  return (
    <div className="bg-[#EEEDFA] rounded-lg p-3 border border-[#C0C0C5] shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-gray-300 rounded animate-pulse w-32"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
      </div>

      {/* Booking Item Card Skeleton */}
      <div className="mb-1">
        <div className="bg-white rounded-md p-2 border border-[#D0D7CE] shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-2 mb-2">
            {/* Image skeleton */}
            <div className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="flex-1 min-w-0">
              {/* House name skeleton */}
              <div className="h-4 bg-gray-300 rounded animate-pulse w-24 mb-1"></div>
              {/* Package name skeleton */}
              <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
            </div>
          </div>

          {/* Date grid skeleton */}
          <div className="grid grid-cols-3 gap-1 text-xs mb-2">
            <div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-12 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-14 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-12 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-8"></div>
            </div>
          </div>

          {/* Amount section skeleton */}
          <div className="flex justify-between items-center text-xs border-t border-gray-200 pt-1">
            <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
            <div className="text-right">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-16 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Summary Skeleton */}
      <div className="pt-3 space-y-1">
        <div className="flex justify-between items-center text-xs">
          <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
          <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div className="h-3 bg-gray-300 rounded animate-pulse w-14"></div>
          <div className="h-3 bg-gray-300 rounded animate-pulse w-10"></div>
        </div>
        
        <div className="flex justify-between items-center pt-1 border-t border-[#C0C0C5]">
          <div className="h-4 bg-gray-300 rounded animate-pulse w-12"></div>
          <div className="h-5 bg-gray-300 rounded animate-pulse w-20"></div>
        </div>
      </div>
    </div>
  );
};

const BookingSummary = ({ bookingData, loadingCart }) => {
  if (loadingCart) {
    return <BookingSummarySkeleton />;
  }

  // If no booking data or empty data array
  if (!bookingData?.data || bookingData?.data?.length === 0) {
    return (
      <div className="bg-[#EEEDFA] rounded-lg p-3 border border-[#C0C0C5] shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="text-center text-gray-600 py-3 text-sm">
          No booking items found <br/>
          <Link to="/amrabad-resort">
            <button className="text-[#304A3A] text-sm rounded-md underline font-semibold">
              Go to Cottages
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Get data from API response
  const cartItems = bookingData?.data || [];
  const totalAmount = bookingData?.amount || 0;
  const totalDiscount = bookingData?.discountAmount || 0;
  const grandTotal = bookingData?.grandTotal || 0;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
      
    }).toUpperCase();
  };

  return (
    <div className="bg-[#EEEDFA] rounded-lg p-3 border border-[#C0C0C5] shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-base text-gray-800">Booking Summary</h3>
        {cartItems?.length > 1 && (
          <span className="text-xs text-gray-600">
            {cartItems?.length} items
          </span>
        )}
      </div>

      {/* Swiper for multiple items */}
      {cartItems?.length > 1 ? (
        <div className="mb-0">
          <Swiper
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            className="booking-swiper"
          >
            {cartItems?.map((item) => (
              <SwiperSlide key={item?.cartId}>
                <BookingItemCard item={item} formatDate={formatDate} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        // Single item display
        <div className="mb-0">
          <BookingItemCard item={cartItems?.[0]} formatDate={formatDate} />
        </div>
      )}

      {/* Total Summary */}
      <div className="pt-3 space-y-1">
        {totalDiscount > 0 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Sub-total</span>
            <span className="text-gray-700">₹{totalAmount?.toLocaleString()}</span>
          </div>
        )}
        
        {totalDiscount > 0 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Discount</span>
            <span className="text-red-600">-₹{totalDiscount?.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-1 border-t border-[#C0C0C5]">
          <span className="font-bold text-gray-800 text-sm">TOTAL</span>
          <span className="font-bold text-[#304A3A] text-lg">
            ₹{grandTotal?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx>{`
        .booking-swiper .swiper-pagination-bullet {
          background: #C0C0C5;
          opacity: 1;
          width: 8px;
          height: 8px;
        }
        
        .booking-swiper .swiper-pagination-bullet-active {
          background: #304A3A;
        }
        
        .booking-swiper .swiper-pagination {
          bottom: 10px;
        }
        
        .booking-swiper .swiper-pagination .swiper-pagination-bullet {
          transform: scale(1);
        }
      `}</style>
    </div>
  );
};

// Compact individual booking item card component
const BookingItemCard = ({ item, formatDate }) => {
  if (!item) return null;

  return (
    <div className="bg-white rounded-md p-2 border border-[#D0D7CE] shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-2 mb-2">
        <img 
          src={item?.houseImageUrl} 
          alt={item?.houseName || 'Cottage'} 
          className="w-10 h-10 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-800 truncate">
            {item?.houseName || 'Cottage Name'}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {item?.packageName || 'Package Name'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-xs mb-2">
        <div>
          <div className="font-medium text-gray-600 mb-0.5">Check-in</div>
          <div className="text-gray-700">{formatDate(item?.roomFromDate)}</div>
        </div>
        <div>
          <div className="font-medium text-gray-600 mb-0.5">Check-out</div>
          <div className="text-gray-700">{formatDate(item?.roomToDate)}</div>
        </div>
        <div>
          <div className="font-medium text-gray-600 mb-0.5">Cottages</div>
          <div className="text-gray-700">{item?.roomCount || 0}</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs border-t border-gray-200 pt-1">
        <span className="text-gray-600">Amount</span>
        <div className="text-right flex gap-1 items-end">
          <div className="font-semibold text-[#304A3A] text-sm">
            ₹{((item?.amount || 0) - (item?.discountAmount || 0))?.toLocaleString()}
          </div>
          {(item?.discountAmount || 0) > 0 && (
            <div className="text-xs text-gray-400 line-through">
              ₹{item?.amount?.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;