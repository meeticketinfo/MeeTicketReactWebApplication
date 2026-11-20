import useAuthStore from "../../store/authStore";
import { TEST_ZOO_PARK_ID } from "../../constants/appConfig";
import FacilityServicesLegacy from "./FacilityServicesLegacy";
import FacilityServicesTestZooPark from "./FacilityServicesTestZooPark";

/**
 * Park-gated booking entry (by Park ID, not park name):
 * - TEST_ZOO_PARK_ID → new flow / UI
 * - All other parks (or unknown park) → legacy flow / UI
 */
export const FacilityServices = () => {
  const { decodedTokenData } = useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;

  const useNewBookingFlow = parkId === TEST_ZOO_PARK_ID;
  console.log("parkId", parkId, "useNewBookingFlow", useNewBookingFlow);

  if (useNewBookingFlow) {
    return <FacilityServicesTestZooPark />;
  }

  return <FacilityServicesLegacy />;
};

export default FacilityServices;
