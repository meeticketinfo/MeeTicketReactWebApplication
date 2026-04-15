import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MapView = ({ houses, onHouseClick, fromDate, toDate }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHouseList, setShowHouseList] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  // Marker icon constants - will be defined after Google Maps API loads
  const [markerIcons, setMarkerIcons] = useState(null);

  // Helper function to validate coordinates
  const isValidCoordinate = (lat, lng) => {
    if (lat === null || lat === undefined || lng === null || lng === undefined) {
      return false;
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    return !isNaN(latNum) && !isNaN(lngNum) &&
      latNum >= -90 && latNum <= 90 &&
      lngNum >= -180 && lngNum <= 180;
  };

  // Helper function to filter houses with valid coordinates
  const getValidHouses = () => {
    if (!houses || houses.length === 0) return [];

    return houses.filter(house => {
      const isValid = isValidCoordinate(house.latitude, house.longitude);
      if (!isValid) {
        console.warn(`House ${house.roomId || house.roomName} has invalid coordinates: lat=${house.latitude}, lng=${house.longitude}`);
      }
      return isValid;
    });
  };

  // Function to format date for display
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const weekday = weekdays[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];

    return `${weekday}, ${day} ${month}`;
  };

  // Function to check availability for a specific date
  const checkAvailabilityForDate = (house, targetDate) => {
    if (!house?.calendar || !targetDate) return false;
    
    const calendarItem = house.calendar.find(item => item.date === targetDate);
    return calendarItem && calendarItem.housesLeft > 0;
  };

  // Function to handle Book Now click with validation
  const handleBookNowClick = (house, e) => {
    // Check if the fromDate has available rooms
    if (!checkAvailabilityForDate(house, fromDate)) {
      e.preventDefault();
      toast.error(`No room available on ${formatDate(fromDate)}`);
      return false;
    }
    
    // If available, proceed with normal navigation
    localStorage.setItem("bookingDate", JSON.stringify({"fromDate": fromDate, "toDate": toDate}));
    return true;
  };

  // Function to handle house selection from list
  const handleHouseSelect = (house) => {
    setSelectedHouse(house);

    // Find the corresponding marker and trigger its click event
    const houseIndex = houses.findIndex(h => h.roomId === house.roomId);
    if (houseIndex !== -1 && markers[houseIndex] && markerIcons) {
      // Get the marker
      const marker = markers[houseIndex];

      // Update all markers to default style first
      markers.forEach(m => {
        if (m && m.defaultIcon) {
          m.setIcon(m.defaultIcon);
        }
      });

      // Set clicked marker to selected style
      marker.setIcon(marker.selectedIcon);

      // Center map on selected house
      if (map && isValidCoordinate(house.latitude, house.longitude)) {
        const location = { lat: parseFloat(house.latitude), lng: parseFloat(house.longitude) };
        map.panTo(location);
        map.setZoom(100); // Closer zoom to show the selected house
      }
    }

    onHouseClick && onHouseClick(house);
  };

  // Add this helper function at the top of the component
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Helper function to get house display name
  const getHouseDisplayName = (house) => {
    return house.roomName || house.packageName || 'House';
  };

  // Helper function to get house image
  const getHouseImage = (house) => {
    if (house.images && house.images.length > 0) {
      return house.images[0]; // Return first image
    }
    return '/images/house-1.jpg'; // Default image
  };

  // Helper function to get house price
  const getHousePrice = (house) => {
    if (house.hasDiscount && house.discountValue && house.discountType === 'Percentage') {
      const discountAmount = (house.tariffPerDay * house.discountValue) / 100;
      return Math.round(house.tariffPerDay - discountAmount);
    }
    return house.tariffPerDay || 0;
  };

  // Helper function to get original price
  const getOriginalPrice = (house) => {
    return house.tariffPerDay;
  };

  useEffect(() => {
    // Initialize Google Maps
    const initMap = () => {
      if (window.google && window.google.maps) {
        const validHouses = getValidHouses();

        if (validHouses.length === 0) {
          setMapError("No houses with valid location data found. Please check the coordinates.");
          setIsLoading(false);
          return;
        }

        try {
          // Create marker icons
          const defaultMarkerIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
              <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                <path d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                <path d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
              </g>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(34, 34),
            anchor: new window.google.maps.Point(17, 34)
          };

          const selectedMarkerIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
              <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                <ellipse cx="44.996" cy="83.309" rx="30.076" ry="6.689" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: white; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                <path d="M 45 83.293 c -1.31 0 -2.522 -0.692 -3.188 -1.819 l -4.058 -6.864 c -8.333 -14.086 -16.203 -27.392 -18.891 -32.788 c -1.954 -4.008 -2.938 -8.287 -2.938 -12.747 C 15.925 13.043 28.968 0 45 0 c 16.032 0 29.075 13.043 29.075 29.075 c 0 4.456 -0.983 8.735 -2.922 12.717 c -0.023 0.048 -0.049 0.096 -0.074 0.143 c -2.74 5.468 -10.56 18.688 -18.836 32.678 l -4.055 6.861 C 47.522 82.601 46.31 83.293 45 83.293 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,68,68); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                <path d="M 45 42.274 c -7.843 0 -14.223 -6.38 -14.223 -14.223 S 37.157 13.828 45 13.828 c 7.842 0 14.223 6.381 14.223 14.223 S 52.842 42.274 45 42.274 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
              </g>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(50, 50),
            anchor: new window.google.maps.Point(25, 50)
          };

          // Set marker icons in state
          setMarkerIcons({
            default: defaultMarkerIcon,
            selected: selectedMarkerIcon
          });

          // Calculate bounds to fit all markers
          const bounds = new window.google.maps.LatLngBounds();

          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: 16.4167, lng: 78.3333 },
            zoom: 10, // Reduced zoom to show more area
            mapTypeId: window.google.maps.MapTypeId.SATELLITE, // Set default to satellite mode
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          });

          setMap(mapInstance);

          // Add markers for each house with valid coordinates
          const newMarkers = validHouses.map((house, index) => {
            const location = {
              lat: parseFloat(house.latitude),
              lng: parseFloat(house.longitude)
            };

            const marker = new window.google.maps.Marker({
              position: location,
              map: mapInstance,
              title: getHouseDisplayName(house),
              icon: defaultMarkerIcon
            });

            // Store icons for this marker
            marker.defaultIcon = defaultMarkerIcon;
            marker.selectedIcon = selectedMarkerIcon;

            // Extend bounds to include this marker
            bounds.extend(location);

            // Add click listener to marker
            marker.addListener('click', () => {
              // console.log('Marker clicked:', getHouseDisplayName(house));

              // Update all markers to default style
              newMarkers.forEach(m => {
                if (m && m.defaultIcon) {
                  m.setIcon(m.defaultIcon);
                }
              });

              // Set clicked marker to selected style
              marker.setIcon(marker.selectedIcon);

              setSelectedHouse(house);

              // Automatically open the house list when marker is clicked
              setShowHouseList(true);

              onHouseClick && onHouseClick(house);
            });

            // Add house name label as a separate marker
            const labelWidth = Math.max(getHouseDisplayName(house).length * 8, 120); // Dynamic width based on text length
            const labelMarker = new window.google.maps.Marker({
              position: new window.google.maps.LatLng(
                house.latitude + 0.000001,
                house.longitude
              ),
              map: mapInstance,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="${labelWidth}" height="30" viewBox="0 0 ${labelWidth} 30">
                    <rect width="${labelWidth}" height="30" rx="4" fill="rgba(255,255,255,1)"/>
                    <text x="${labelWidth / 2}" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#333">${escapeHtml(getHouseDisplayName(house))}</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(labelWidth, 30),
                anchor: new window.google.maps.Point(labelWidth / 2, 0)
              },
              clickable: false
            });

            return marker;
          });

          // Fit map to show all markers
          if (newMarkers.length > 0) {
            mapInstance.fitBounds(bounds);
            // Add some padding to the bounds
            mapInstance.setZoom(Math.min(mapInstance.getZoom(), 12));
          }

          setMarkers(newMarkers);
          // console.log(`Created ${newMarkers.length} markers`);
          setIsLoading(false); // Hide loader when map is ready
        } catch (error) {
          console.error('Error initializing map:', error);
          setMapError('Failed to initialize map. Please refresh the page.');
          setIsLoading(false);
        }
      }
    };

    // Load Google Maps API
    const loadGoogleMapsAPI = () => {
      if (!window.google) {
        const script = document.createElement('script');
        // Use environment variable with fallback
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBRT-gAls8JiRt1UFJaml4oN9Mmev41LKI';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
          setMapError('Failed to load Google Maps. Please check your internet connection.');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        // Add a small delay to ensure DOM is ready
        setTimeout(initMap, 100);
      }
    };

    // Add a longer delay to ensure the component is fully mounted and DOM is ready
    const timer = setTimeout(() => {
      loadGoogleMapsAPI();
    }, 200);

    return () => {
      clearTimeout(timer);
      // Cleanup markers
      markers.forEach(marker => marker.setMap(null));
    };
  }, [houses]);

  // Show loading state if houses is not available
  if (!houses || houses.length === 0) {
    return (
      <div className="w-full h-[80vh] rounded-2xl bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#304A3A] mb-4"></div>
          <p className="text-gray-600 font-medium">Loading houses data...</p>
        </div>
      </div>
    );
  }

  // Get valid houses for display
  const validHouses = getValidHouses();
  const invalidHousesCount = houses.length - validHouses.length;

  return (
    <div className="relative">

      {/* Warning for invalid coordinates */}
      {invalidHousesCount > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium">Location Data Missing</p>
              <p className="text-xs mt-1">
                {invalidHousesCount} house{invalidHousesCount > 1 ? 's' : ''} without location data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-2xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#304A3A] mb-4"></div>
            <p className="text-gray-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Toggle Button for House List */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setShowHouseList(!showHouseList)}
          className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {showHouseList ? 'Hide List' : 'Show Houses List'}
        </button>
      </div>

      {/* House List Sidebar */}
      {showHouseList && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-xl max-w-xs max-h-[calc(80vh-2rem)] overflow-hidden border border-gray-200">
          <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-medium text-gray-800 text-sm">
              Houses ({validHouses.length}/{houses.length})
            </h3>
            <button
              onClick={() => setShowHouseList(false)}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-[10px] p-1"
            >
              ×
            </button>
          </div>
          <div className="max-h-[calc(80vh-6rem)] overflow-y-auto">
            {houses.map((house) => {
              const isValid = isValidCoordinate(house.latitude, house.longitude);
              return (
                <div
                  key={house.roomId}
                  onClick={() => isValid && handleHouseSelect(house)}
                  className={`p-2 border-b border-gray-50 transition-colors ${!isValid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                    } ${selectedHouse?.roomId === house.roomId ? 'bg-blue-100 border-blue-200' : ''
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {house?.images?.length > 0 ? (
                      <>
                        <img
                          src={house.images[0]}
                          alt={house?.roomName || "House Image"}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        {/* Fallback dummy image */}
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0" style={{ display: 'none' }}>
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      // No images available - show dummy image
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs leading-tight mb-0.5 truncate">
                        {getHouseDisplayName(house)}
                        {!isValid && (
                          <span className="ml-1 text-red-500 text-xs">(No location)</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-1 mb-0.5">
                        <p className="text-sm font-bold text-[#304A3A] leading-none">₹{house?.tariffPerDay?.toLocaleString()}</p>
                        <span className="text-[10px] text-gray-500 ml-1">/ 2 Guests</span>
                      </div>
                      <Link
                        to={`/amrabad-resort/book-now/${house.packageId}/${house.roomId}`}
                        onClick={(e) => handleBookNowClick(house, e)}
                        className="inline-block bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] hover:opacity-90 px-4 py-0.5 rounded text-xs font-medium transition"
                        // onClick={(e) => e.stopPropagation()}
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-[80vh] rounded-2xl"></div>
    </div>
  );
};

export default MapView; 