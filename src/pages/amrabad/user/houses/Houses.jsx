import React from "react";
import UserLayout from "../../../../layouts/UserLayout";

const PropertyCard = ({ image, title, price, duration, checkIn, checkOut, description, offer }) => {
  return (
    <div className="bg-white rounded-[20px] shadow-lg border border-gray-200 overflow-hidden w-full max-w-[1180px] mx-auto">
      <div className="flex flex-col lg:flex-row" style={{minHeight: '508px'}}>
        {/* Image Section */}
        <div className="w-full lg:w-[400px] h-64 lg:h-[508px] flex-shrink-0 p-4">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover rounded-[16px]"
          />
        </div>
        
        {/* Content Section */}
        <div className="flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8 flex flex-col">
          {/* Header with Title and Price */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold" style={{color: '#494747FF'}}>{title}</h3>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold" style={{color: '#362D86'}}>₹{price.toLocaleString()}</div>
              <div className="text-sm text-gray-500 font-medium">/ {duration}</div>
            </div>
          </div>
          
          {/* Check-in/Check-out Box - Responsive */}
          <div className="bg-blue-50 rounded-lg px-3 sm:px-4 py-3 mb-4 border border-blue-100 inline-block w-fit">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div>
                <div className="text-xs text-gray-600 mb-1 font-medium">Check-In Time:</div>
                <div className="text-sm sm:text-base font-bold text-gray-900">{checkIn}</div>
              </div>
              <div className="hidden sm:flex w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1 font-medium">Check-Out Time:</div>
                <div className="text-sm sm:text-base font-bold text-gray-900">{checkOut}</div>
              </div>
            </div>
          </div>
          
          {/* Overview Section */}
          <div className="mb-4 flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Overview:</h4>
            <p className="text-gray-700 leading-relaxed mb-3 text-sm">{description}</p>
            <div className="text-gray-700 text-sm">
              <div className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1">•</span>
                <span>Each cottage is thoughtfully designed to accommodate <strong>2 guests comfortably</strong>.</span>
              </div>
            </div>
          </div>
          
          {/* Special Offer Section */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Special Offer:</h4>
            <div className="text-sm sm:text-base">
              <span>Enjoy a <strong>5% discount</strong> on bookings from <strong>Monday to Friday!</strong></span>
            </div>
          </div>
          
          {/* Book Now Button - Fully Responsive */}
          <button 
            className="
              text-white 
              py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-8 
              text-sm sm:text-base 
              transition-all duration-200 
              flex items-center justify-between 
              shadow-lg 
              w-full 
              max-w-full sm:max-w-md md:max-w-lg
              rounded-[12px]
              hover:shadow-xl
              active:scale-95
              focus:outline-none focus:ring-4 focus:ring-purple-300
              min-h-[48px] md:min-h-[62px]
            "
            style={{
              backgroundColor: '#362D86'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2266'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#362D86'}
          >
            <span className="font-medium">Book Now</span>
            <svg 
              className="fill-none stroke-current ml-2 flex-shrink-0" 
              viewBox="0 0 24 24"
              style={{
                width: '20px',
                height: '20px',
                strokeWidth: '2.5px'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const Houses = () => {
  const properties = [
    {
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=508&fit=crop",
      title: "Chital And Otter",
      price: 6500,
      duration: "For 2 Guests",
      checkIn: "12:30 PM",
      checkOut: "10:00 AM (Next Day)",
      description: "These two charming cottages offer a peaceful forest view from the balcony, ideal for nature lovers. Named after local wildlife — the spotted deer (Chital) and smooth-coated otter — both species are signs of a healthy river ecosystem.",
      offer: "Enjoy a 5% discount on bookings from Monday to Friday!"
    },
    {
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=508&fit=crop",
      title: "Elephant Paradise Villa",
      price: 8500,
      duration: "For 3 Guests",
      checkIn: "1:00 PM",
      checkOut: "11:00 AM (Next Day)",
      description: "A luxurious villa nestled in the heart of Munnar's tea gardens. This spacious accommodation offers panoramic mountain views and is perfect for families. The villa features traditional Kerala architecture with modern amenities.",
      offer: "Book for 3+ nights and get 10% discount plus complimentary breakfast!"
    },
    {
      image: "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=400&h=508&fit=crop",
      title: "Misty Mountain Retreat",
      price: 5200,
      duration: "For 2 Guests",
      checkIn: "2:00 PM",
      checkOut: "10:30 AM (Next Day)",
      description: "Experience tranquility at this cozy mountain retreat surrounded by eucalyptus forests. Wake up to the sounds of chirping birds and misty mountain views. Perfect for couples seeking a romantic getaway in nature's embrace.",
      offer: "Weekend bookings include complimentary evening tea and local snacks!"
    },
    {
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=508&fit=crop",
      title: "Tea Garden Cottage",
      price: 7200,
      duration: "For 4 Guests",
      checkIn: "12:00 PM",
      checkOut: "10:00 AM (Next Day)",
      description: "Stay amidst lush tea plantations in this authentic cottage experience. The property offers guided tea garden walks, tea tasting sessions, and stunning sunrise views over the Western Ghats. Ideal for nature enthusiasts and photography lovers.",
      offer: "Early bird special: 15% off for bookings made 30 days in advance!"
    },
  ];

  return (
      <div className="bg-gray-100 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>

    <UserLayout>
      {/* Main scrollable container */}
        {/* Property Cards */}
        <div className="space-y-8 p-4 pb-8">
          {properties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>
    </UserLayout>
          </div>

  );
};

export default Houses;