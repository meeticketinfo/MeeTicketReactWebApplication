import { useEffect } from "react";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import useAuthStore from "../../store/authStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { useQuantitiesStore } from "../../store/quantitiesStore";

export const FacilityServices = () => {
  const { allFacilityServices } = useBookingsStore();
  const { decodedTokenData } = useAuthStore();
  const { allFacilities, fetchAllFacilities } = useFacilityStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const { allServiceVariants, fetchAllServiceVariants } =
    useServiceVariantStore();

  const { quantities, updateQuantity } = useQuantitiesStore();

  useEffect(() => {
    fetchAllFacilities();
    fetchAllServices();
    fetchAllServiceVariants();
  }, []);

  return (
    <div className="facility-container space-y-6 px-4 lg:px-0">
      {allFacilities?.map((facility) => (
        <div
          key={facility.id}
          className="facility  bg-white p-5 rounded-md shadow-md text-white"
        >
          <h2 className="text-2xl font-bold text-blue-v1">
            {facility.displayName || facility.name}
          </h2>
          <p className="text-sm opacity-80">{facility.description}</p>

          <div className="services-container space-y-4 mt-4">
            {allServices
              .filter((service) => service.facilityId === facility.id)
              .map((service) => (
                <div
                  key={service.id}
                  className="service bg-gray-200 border- border-blue-v2 p-4 rounded-md text-white"
                >
                  <h3 className="text-xl text-blue-v1 font-semibold">
                    {service.displayName || service.name}
                  </h3>

                  <div className="service-variant-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                    {allServiceVariants
                      .filter((variant) => variant.serviceId === service.id)
                      .map((variant) => (
                        <div
                          key={variant.id}
                          className="service-variant bg-white p-4 rounded-md shadow-md border border-blue-v2 flex items-between gap-4"
                        >
                          <h4 className="text-base font-medium text-[#0c3771]">
                            {variant.displayName || variant.name}
                          </h4>

                          {variant.isPriceFixed ? (
                            <p className="text-gray-800 font-semibold">
                              ${variant.amount}
                            </p>
                          ) : (
                            <div className="quantity-controls flex items-between gap-2">
                              <button
                                onClick={() => updateQuantity(variant.id, -1)}
                                className="bg-gray-300 text-gray-800 px-2 rounded hover:bg-gray-400"
                              >
                                -
                              </button>
                              <span className="text-gray-800 font-medium">
                                {quantities[variant.id] || 0}
                              </span>
                              <button
                                onClick={() => updateQuantity(variant.id, 1)}
                                className="bg-gray-300 text-gray-800 px-2 rounded hover:bg-gray-400"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      {/* Show facilities, services, and service variant details below when quantity > 0 */}
      {Object.keys(quantities).some((key) => quantities[key] > 0) && (
        <div className="details-section mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Selected Services:
          </h3>
          {allServiceVariants
            .filter((variant) => quantities[variant.id] > 0)
            .map((variant) => (
              <div key={variant.id} className="text-gray-700">
                <p>
                  {variant.displayName || variant.name}:{" "}
                  {quantities[variant.id]} unit(s)
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FacilityServices;
