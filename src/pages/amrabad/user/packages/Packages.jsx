import React from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../../../layouts/UserLayout";

const packagesData = [
  {
    titleLine1: "Munnanur Jungle",
    titleLine2: "Resort, The Tiger Stay",
    titleLine3: "Package",
    image: "/src/images/resort1.jpg",
    house: "munnanur-jungle-resort" // URL-friendly identifier
  },
  {
    titleLine1: "Domalapenta Akkamaha",
    titleLine2: "Devi Stay Package",
    image: "/src/images/resort2.jpg",
    house: "domalapenta-akkamaha-devi" // URL-friendly identifier
  },
];

const Packages = () => {
  const navigate = useNavigate();

  const handleBookNow = (propertyCard) => {
    const route = `/amarabad/packages/:houses}`;
    navigate(route);
    console.log("Navigating to:", route);
  };

  return (
    <UserLayout>
      <div className="bg-gray-50 h-screen overflow-y-auto overflow-x-hidden">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {packagesData.map((resort, idx) => (
              <div
                key={idx}
                className="group cursor-pointer relative w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[550px] overflow-hidden"
                onClick={() => console.log("Clicked:", resort.titleLine1)}
              >
                {/* Optimized image with WebP format support and compression */}
                <picture>
                  {/* Fallback to original format */}
                  <img
                    className="w-full h-full object-cover"
                    src={resort.image}
                    alt={resort.titleLine1}
                    loading="lazy"
                    decoding="async"
                    style={{
                      imageRendering: 'auto',
                      filter: 'brightness(0.9) contrast(1.1)'
                    }}
                    // Responsive image sizes for better performance
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </picture>
                
                <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-20">
                  <h3
                    className="text-white font-bold text-lg sm:text-lg md:text-2xl leading-snug mb-4"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {resort.titleLine1}
                    <br />
                    {resort.titleLine2}
                    <br />
                    {resort.titleLine3}
                  </h3>
                  <button
                    className="bg-white text-blue-900 text-sm font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(resort);
                    }}
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Packages;