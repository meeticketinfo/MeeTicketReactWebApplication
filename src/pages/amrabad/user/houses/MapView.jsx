import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MapView = ({ houses, onHouseClick }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Maps
    const initMap = () => {
      if (window.google && window.google.maps) {
        // Calculate bounds to fit all markers
        const bounds = new window.google.maps.LatLngBounds();

        const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
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

        // Add markers for each house
        const newMarkers = houses.map((house, index) => {
          console.log(`Creating marker ${index + 1} for ${house.title} at:`, house.location);

          const marker = new window.google.maps.Marker({
            position: house.location,
            map: mapInstance,
            title: house.title,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                  <path d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: red; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                </g>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(34, 34),
              anchor: new window.google.maps.Point(17, 30)
            }
          });

          // Extend bounds to include this marker
          bounds.extend(house.location);

          // Add click listener to marker
          marker.addListener('click', () => {
            console.log('Marker clicked:', house.title);

            // Update all markers to default style
            newMarkers.forEach(m => {
              m.setIcon({
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <path d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: red; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  </g>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(34, 34),
                anchor: new window.google.maps.Point(17, 30)
              });
            });

            // Set clicked marker to selected style (larger and different color)
            marker.setIcon({
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                  <ellipse cx="44.996" cy="83.309" rx="30.076" ry="6.689" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: white; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                  <path d="M 45 83.293 c -1.31 0 -2.522 -0.692 -3.188 -1.819 l -4.058 -6.864 c -8.333 -14.086 -16.203 -27.392 -18.891 -32.788 c -1.954 -4.008 -2.938 -8.287 -2.938 -12.747 C 15.925 13.043 28.968 0 45 0 c 16.032 0 29.075 13.043 29.075 29.075 c 0 4.456 -0.983 8.735 -2.922 12.717 c -0.023 0.048 -0.049 0.096 -0.074 0.143 c -2.74 5.468 -10.56 18.688 -18.836 32.678 l -4.055 6.861 C 47.522 82.601 46.31 83.293 45 83.293 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: red; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 45 42.274 c -7.843 0 -14.223 -6.38 -14.223 -14.223 S 37.157 13.828 45 13.828 c 7.842 0 14.223 6.381 14.223 14.223 S 52.842 42.274 45 42.274 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                </g>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(50, 50),
              anchor: new window.google.maps.Point(20, 40)
            });

            setSelectedHouse(house);
            onHouseClick && onHouseClick(house);
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
        console.log(`Created ${newMarkers.length} markers`);
        setIsLoading(false); // Hide loader when map is ready
      }
    };

    // Load Google Maps API
    const loadGoogleMapsAPI = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    loadGoogleMapsAPI();

    return () => {
      // Cleanup markers
      markers.forEach(marker => marker.setMap(null));
    };
  }, [houses]);

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-2xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#362D86] mb-4"></div>
            <p className="text-gray-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}

      <div id="map" className="w-full h-[600px] rounded-2xl"></div>

      {/* House Info Card */}
      {selectedHouse && (
        <div className="absolute top-4 right-4 bg-white rounded-xl shadow-2xl p-4 max-w-sm z-10 pr-8">
          <div className="flex items-start gap-3 relative">
            <img
              src={selectedHouse.image}
              alt={selectedHouse.title}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0 max-w-[200px]">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{selectedHouse.title}</h3>
              <p className="text-lg font-bold text-[#362D86] mb-1 leading-none">{selectedHouse.price}</p>
              <p className="text-xs text-gray-600 mb-1">{selectedHouse.guests}</p>
              <Link
                to={`/amarabad/book-now/${selectedHouse.id}`}
                className="inline-block bg-[#362D86] text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-indigo-800 transition"
              >
                Book Now
              </Link>
            </div>
            <button
              onClick={() => setSelectedHouse(null)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold absolute -top-2 -right-6 flex leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView; 