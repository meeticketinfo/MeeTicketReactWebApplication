import { useEffect } from "react";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import useAuthStore from "../../store/authStore";

export const FacilityServices = () => {
  const { allFacilityServices, fetchAllFacilityServices } = useBookingsStore();
  const { decodedTokenData } = useAuthStore();
  const parkId = decodedTokenData.data.ParkId;
  console.log(parkId);
  useEffect(() => {
    // Only fetch facility services if parkId is available
    if (parkId) {
      fetchAllFacilityServices(1, 10, {}, parkId);
    }
  }, [parkId, fetchAllFacilityServices]); // Depend on parkId and fetchAllFacilityServices

  const facilities = allFacilityServices?.data?.facility || [];
  return (
    <>
      <div className="facility-container ">
        {facilities.map((facility) => (
          <div key={facility.id} className="facility bg-gray-400 p-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              {facility.displayName || facility.name}
            </h2>
            {/* <p className="text-gray-600">
              Open Time: {facility.openTime || "N/A"}
            </p>
            <p className="text-gray-600">
              Close Time: {facility.closeTime || "N/A"}
            </p>
            <p className="text-gray-600">
              Capacity: {facility.capacity || "N/A"}
            </p>
            <p className="text-gray-600">
              Status: {facility.availabilityStatus || "N/A"}
            </p> */}

            <div className="service-container space-y-6">
              {facility.service.map((service) => (
                <div
                  key={service.id}
                  className="service bg-green-400 rounded-md p-4 space-y-3"
                >
                  <h3 className="text-xl font-semibold text-gray-700">
                    {service.displayName || service.name}
                  </h3>
                  <p className="text-gray-600">
                    Availability: {service.availability || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span
                      className={`${
                        service.isActive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>

                  <div className="service-variant-container grid gap-4 ">
                    {service.serviceVarient.map((variant) => (
                      <div
                        key={variant.id}
                        className="service-variant bg-red-400 shadow-sm rounded-md p-4 border border-gray-200 space-y-2"
                      >
                        <h4 className="text-lg font-semibold text-gray-700">
                          {variant.displayName || variant.name}
                        </h4>
                        <p className="text-gray-600">
                          Amount: {variant.amount}
                        </p>
                        <p className="text-gray-600">
                          Description: {variant.description || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          Fixed Price:{" "}
                          <span
                            className={`${
                              variant.isPriceFixed
                                ? "text-blue-500"
                                : "text-gray-500"
                            }`}
                          >
                            {variant.isPriceFixed ? "Yes" : "No"}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          Status:{" "}
                          <span
                            className={`${
                              variant.isActive
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {variant.isActive ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
