import { useEffect, useMemo } from "react";
import useAuthStore from "../../store/authStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import FacilityServicesLegacy from "./FacilityServicesLegacy";
import FacilityServicesTestZooPark from "./FacilityServicesTestZooPark";

const normalizeText = (value) => String(value || "").trim();

/** New booking UI is enabled only for Test Zoo Park. */
export const isTestZooPark = (parkName) =>
  normalizeText(parkName).toLowerCase() === "test zoo park";

/**
 * Resolve park name from token / location master / service-variant API.
 * Prefer park-level fields; never use facility/service/variant names.
 */
export const resolveParkName = ({
  decodedTokenData,
  LocationDetails,
  allServiceVariants,
} = {}) => {
  const fromToken =
    decodedTokenData?.data?.ParkName ||
    decodedTokenData?.data?.parkName ||
    "";

  const fromLocation =
    LocationDetails?.parkName ||
    LocationDetails?.ParkName ||
    LocationDetails?.locationName ||
    LocationDetails?.LocationName ||
    LocationDetails?.name ||
    LocationDetails?.displayName ||
    "";

  const fromVariant = (allServiceVariants || []).find(
    (variant) => normalizeText(variant?.parkName || variant?.ParkName)
  );
  const variantParkName =
    fromVariant?.parkName || fromVariant?.ParkName || "";

  return (
    normalizeText(fromToken) ||
    normalizeText(fromLocation) ||
    normalizeText(variantParkName)
  );
};

/**
 * Park-gated booking entry:
 * - Test Zoo Park → new flow / UI
 * - All other parks (or unknown park) → legacy flow / UI
 */
export const FacilityServices = () => {
  const { decodedTokenData } = useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;
  const { LocationDetails, FetchLocationDetails } = useFacilityStore();
  const { allServiceVariants, fetchAllServiceVariants } =
    useServiceVariantStore();

  useEffect(() => {
    if (parkId) {
      FetchLocationDetails(parkId);
    }
    fetchAllServiceVariants();
  }, [parkId]);

  const parkName = useMemo(
    () =>
      resolveParkName({
        decodedTokenData,
        LocationDetails,
        allServiceVariants,
      }),
    [decodedTokenData, LocationDetails, allServiceVariants]
  );

  const useNewBookingFlow = isTestZooPark(parkName);

  if (useNewBookingFlow) {
    return <FacilityServicesTestZooPark />;
  }

  return <FacilityServicesLegacy />;
};

export default FacilityServices;
