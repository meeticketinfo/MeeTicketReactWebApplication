import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useBookingsStore } from "../../store/masters/bookingsStore";
import useAuthStore from "../../store/authStore";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { useServiceStore } from "../../store/masters/servicesStore";
import { useServiceVariantStore } from "../../store/masters/serviceVariantsStore";
import { useQuantitiesStore } from "../../store/quantitiesStore";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccordionStore } from "../../store/accordionStore";
import {
  formatToCurrency,
  toTitleCase,
} from "../../utils/TypographyHelper";
import TransactionQr from "./TransactionQr";
import TransactionFailed from "./TransactionFailed";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useModalStore } from "../../store/modalStore";
import { useHolidayStore } from "../../store/masters/holidayStore";
import Select, { components as selectComponents } from "react-select";
import { COUNTRY_DIAL_CODES } from "./countryDialCodes";
import {
  clearTestZooParkBookingDraft,
  loadTestZooParkBookingDraft,
  saveTestZooParkBookingDraft,
} from "./testZooParkBookingDraft";

const SPECIAL_PARK_ID = "a8f9123b-0e6f-41e3-9328-6e72eca950e0";

// Foreigner dropdown: exclude India (+91) — citizens use fixed +91.
const COUNTRY_CODE_OPTIONS = COUNTRY_DIAL_CODES.filter(
  (country) => !(country.dial === "+91" && country.name === "India")
).map((country) => ({
  value: `${country.dial}|${country.name}`,
  label: `${country.dial} ${country.name}`,
  dial: country.dial,
  name: country.name,
}));

const getSelectedCountryOption = (countryCode, countryName = "") => {
  if (!countryCode || countryCode === "+91") return null;
  if (countryName) {
    const exact = COUNTRY_CODE_OPTIONS.find(
      (option) =>
        option.dial === countryCode && option.name === countryName
    );
    if (exact) return exact;
  }
  return (
    COUNTRY_CODE_OPTIONS.find((option) => option.dial === countryCode) || null
  );
};

const COUNTRY_SELECT_BG = "#f3f4f6"; // gray-100 — matches wrapper, no white edge

const countryCodeSelectStyles = {
  container: (base) => ({
    ...base,
    width: "100%",
    height: "100%",
    backgroundColor: COUNTRY_SELECT_BG,
  }),
  control: (base, state) => ({
    ...base,
    minHeight: "100%",
    height: "100%",
    borderWidth: 0,
    borderStyle: "none",
    borderColor: "transparent",
    borderRadius: 0,
    boxShadow: "none",
    backgroundColor: COUNTRY_SELECT_BG,
    cursor: "pointer",
    outline: "none",
    "&:hover": {
      borderColor: "transparent",
      boxShadow: "none",
      backgroundColor: COUNTRY_SELECT_BG,
    },
    ...(state.isFocused
      ? {
          borderColor: "transparent",
          boxShadow: "none",
          backgroundColor: COUNTRY_SELECT_BG,
        }
      : {}),
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
    height: "100%",
    flexWrap: "nowrap",
    overflow: "hidden",
    flex: "1 1 auto",
    backgroundColor: COUNTRY_SELECT_BG,
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    fontSize: "0.75rem",
    color: "#0c3771",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#0c3771",
    margin: 0,
    maxWidth: "none",
    position: "static",
    transform: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "0.75rem",
    color: "#6b7280",
    margin: 0,
    position: "static",
    transform: "none",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "100%",
    flexShrink: 0,
    backgroundColor: COUNTRY_SELECT_BG,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    color: "#0c3771",
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "0 2px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50,
    minWidth: 280,
    fontSize: "0.75rem",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    fontSize: "0.75rem",
    backgroundColor: isSelected
      ? "#0c3771"
      : isFocused
        ? "#F8F8F8"
        : "white",
    color: isSelected ? "white" : "#0c3771",
    cursor: "pointer",
    padding: "6px 10px",
    whiteSpace: "nowrap",
  }),
};

const isMobileNumberEmpty = (mobileNumber) =>
  String(mobileNumber || "").replace(/\D/g, "").length === 0;

const getMobileDigits = (mobileNumber) =>
  String(mobileNumber || "").replace(/\D/g, "");

const isCitizenMobileValid = (mobileNumber) =>
  /^[0-9]{10}$/.test(getMobileDigits(mobileNumber));

const focusMobileNumberInput = () => {
  window.setTimeout(() => {
    const input = document.getElementById("mobileNumber");
    if (!input) return;
    input.scrollIntoView({ behavior: "smooth", block: "center" });
    input.focus();
    if (typeof input.select === "function") {
      try {
        input.select();
      } catch {
        /* ignore */
      }
    }
  }, 50);
};

const ENTERFLOW_SELECTOR = "[data-enterflow]";

const getEnterflowElements = (fromEl) => {
  const root = fromEl?.closest?.("form") || document;
  return Array.from(root.querySelectorAll(ENTERFLOW_SELECTOR)).filter((el) => {
    if (el.disabled) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return el.getClientRects().length > 0;
  });
};

const focusEnterflowByOffset = (current, offset = 1) => {
  const elements = getEnterflowElements(current);
  const idx = elements.indexOf(current);
  if (idx === -1) return false;
  const next = elements[idx + offset];
  if (!next) return false;
  next.focus();
  if (typeof next.select === "function") {
    try {
      next.select();
    } catch {
      /* ignore non-selectable */
    }
  }
  return true;
};

/** Tab / Enter → next, Shift+Tab → previous. Space handled via onSpace when provided. */
const handleEnterflowKeyDown = (e, { onSpace, onActivate } = {}) => {
  if (e.key === "Tab") {
    e.preventDefault();
    focusEnterflowByOffset(e.currentTarget, e.shiftKey ? -1 : 1);
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    if (onActivate) {
      onActivate(e);
      return;
    }
    focusEnterflowByOffset(e.currentTarget, 1);
    return;
  }

  if (e.key === " " && onSpace) {
    e.preventDefault();
    onSpace(e);
  }
};

/** react-select input participates in enterflow (foreigner country → mobile). */
const CountryCodeEnterflowInput = (props) => (
  <selectComponents.Input {...props} data-enterflow="country" />
);

const formatTime = (timeString) => {
  if (!timeString) return ""; // Handle empty cases
  const [hours, minutes, seconds] = timeString.split(":");
  const date = new Date();
  date.setHours(hours, minutes, seconds);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  });
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getVariantDisplayName = (variant) =>
  String(
    variant?.varientName || variant?.name || variant?.displayName || ""
  ).trim();

const normalizeVariantName = (variant) =>
  normalizeText(getVariantDisplayName(variant));

/**
 * Detects all Foreigner / Foreigners prefixed or embedded names, e.g.
 * Foreigner Adult, Foreigners Child, Foreigner Safari AC Adult, etc.
 */
const isForeignerSpecificVariant = (normalizedName) => {
  const name = normalizeText(normalizedName);
  if (!name) return false;
  return (
    /^(foreigner|foreigners)(\s|$|-|_)/.test(name) ||
    /\bforeigners?\b/.test(name)
  );
};

/** Service itself is a dedicated Foreigner service (e.g. Foreigner Safari AC). */
const isForeignerNamedService = (variant) => {
  const serviceName = normalizeText(variant?.serviceName);
  if (!serviceName) return false;
  return (
    /^(foreigner|foreigners)(\s|$|-|_)/.test(serviceName) ||
    /\bforeigners?\b/.test(serviceName)
  );
};

const getFacilityKey = (variant) =>
  normalizeText(variant?.facilityName) ||
  normalizeText(variant?.facilityId) ||
  "unknown-facility";

const isAdultVariant = (normalizedName) =>
  /\badult\b/.test(normalizeText(normalizedName));

const isChildVariant = (normalizedName) =>
  /\bchild\b/.test(normalizeText(normalizedName));

const isPersonCategoryVariant = (normalizedName) =>
  isAdultVariant(normalizedName) || isChildVariant(normalizedName);

/**
 * Filters service variants by Citizen/Foreigner and Adult/Child selections.
 * Common non-person variants (Parking, Camera, etc.) stay visible for both.
 * Safari-style split services: when a facility has dedicated Foreigner
 * services, Foreigner view hides the citizen Safari services (no dual list).
 */
const isEntryService = (variant) => {
  const serviceName = normalizeText(variant?.serviceName);
  const facilityName = normalizeText(variant?.facilityName);
  return serviceName === "entry" || facilityName === "entry";
};

const filterServiceVariants = (
  variants = [],
  {
    visitorType = "citizen",
    showAdult = true,
    showChild = true,
    entryOnly = false,
  } = {}
) => {
  const activeVariants = (Array.isArray(variants) ? variants : []).filter(
    (variant) => {
      if (variant?.isActive === false) return false;
      if (entryOnly && !isEntryService(variant)) return false;
      return true;
    }
  );

  // Facilities that have dedicated Foreigner-named services (e.g. Safari).
  const facilitiesWithForeignerServices = new Set();
  activeVariants.forEach((variant) => {
    if (isForeignerNamedService(variant)) {
      facilitiesWithForeignerServices.add(getFacilityKey(variant));
    }
  });

  const groupedByService = activeVariants.reduce((acc, variant) => {
    const key = variant?.serviceId || variant?.serviceName || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(variant);
    return acc;
  }, {});

  const filtered = [];

  Object.values(groupedByService).forEach((serviceVariants) => {
    const sample = serviceVariants[0];
    const facilityKey = getFacilityKey(sample);
    const serviceIsForeignerNamed = serviceVariants.some((variant) =>
      isForeignerNamedService(variant)
    );
    const facilityHasForeignerServices =
      facilitiesWithForeignerServices.has(facilityKey);

    const hasForeignerAdult = serviceVariants.some((variant) => {
      const name = normalizeVariantName(variant);
      return isForeignerSpecificVariant(name) && isAdultVariant(name);
    });
    const hasForeignerChild = serviceVariants.some((variant) => {
      const name = normalizeVariantName(variant);
      return isForeignerSpecificVariant(name) && isChildVariant(name);
    });
    const hasAnyForeignerPerson = hasForeignerAdult || hasForeignerChild;

    // Safari case: facility has "Foreigner Safari AC/Non AC" services.
    // For Foreigner, hide citizen "Safari AC Bus / Safari Non AC Bus" entirely
    // so both categories are not shown together.
    if (
      visitorType === "foreigner" &&
      facilityHasForeignerServices &&
      !serviceIsForeignerNamed &&
      !hasAnyForeignerPerson
    ) {
      return;
    }

    // Citizen: hide dedicated Foreigner-named services entirely
    if (visitorType === "citizen" && serviceIsForeignerNamed) {
      return;
    }

    serviceVariants.forEach((variant) => {
      const name = normalizeVariantName(variant);
      if (!name) return;

      const foreignerSpecific = isForeignerSpecificVariant(name);
      const personVariant = isPersonCategoryVariant(name);
      const adultVariant = isAdultVariant(name);
      const childVariant = isChildVariant(name);

      // Non-person common options (Parking, Camera, luggage, seats, etc.)
      if (!personVariant) {
        // Hide Foreigner-named non-person variants from Citizen view
        if (visitorType === "citizen" && foreignerSpecific) return;
        filtered.push(variant);
        return;
      }

      if (visitorType === "citizen") {
        // Citizen: hide all Foreigner-specific person variants
        if (foreignerSpecific) return;
      } else if (hasAnyForeignerPerson) {
        // Foreigner: prefer Foreigner-specific Adult/Child when that
        // category exists for the service; otherwise fall back to common.
        if (adultVariant) {
          if (hasForeignerAdult && !foreignerSpecific) return;
          if (!hasForeignerAdult && foreignerSpecific) return;
        }
        if (childVariant) {
          if (hasForeignerChild && !foreignerSpecific) return;
          if (!hasForeignerChild && foreignerSpecific) return;
        }
      }
      // else: no Foreigner person variants for this service — show common

      // Adult / Child filters apply only to person-category variants
      if (adultVariant && !showAdult) return;
      if (childVariant && !showChild) return;

      filtered.push(variant);
    });
  });

  return filtered;
};

export const FacilityServicesTestZooPark = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Full browser reload → clear draft once. Client-side Back from summary → restore.
  const restoredDraft = useMemo(() => {
    try {
      const navEntry = performance.getEntriesByType("navigation")[0];
      // navigation.type stays "reload" for the whole document life, so only
      // clear on the first mount after a hard refresh — not when remounting
      // after Booking Summary Back (which must keep mobile/cards).
      if (
        navEntry?.type === "reload" &&
        !window.__testZooParkDraftReloadHandled
      ) {
        window.__testZooParkDraftReloadHandled = true;
        clearTestZooParkBookingDraft();
        return null;
      }
      window.__testZooParkDraftReloadHandled = true;
    } catch {
      /* ignore */
    }
    return loadTestZooParkBookingDraft();
  }, []);

  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const { decodedTokenData } = useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;

  const {
    IsFirstStepTransaction,
    IsTransactionFailed,
    setIsBookingFormVisible,
  } = useBookingsStore();

  // Restore filters when returning from Booking Summary; defaults for a fresh visit.
  const [visitorType, setVisitorType] = useState(
    () => restoredDraft?.visitorType || "citizen"
  ); // citizen | foreigner
  const [showAdult] = useState(true); // always on — Adult cannot be unchecked
  const [showChild, setShowChild] = useState(
    typeof restoredDraft?.showChild === "boolean"
      ? restoredDraft.showChild
      : true
  ); // optional — can check / uncheck
  const [entryOnly, setEntryOnly] = useState(
    typeof restoredDraft?.entryOnly === "boolean"
      ? restoredDraft.entryOnly
      : false
  );
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const focusMobileAfterCountrySelectRef = useRef(false);
  // Formik initial values in state so Reset can clear without draft re-init.
  const [initialSelectedItems, setInitialSelectedItems] = useState(
    () => restoredDraft?.selectedItems || []
  );
  const [initialMobileNumber, setInitialMobileNumber] = useState(
    () => restoredDraft?.mobileNumber || ""
  );
  const [initialCountryCode, setInitialCountryCode] = useState(
    () => restoredDraft?.countryCode || "+91"
  );
  const [initialCountryName, setInitialCountryName] = useState(
    () => restoredDraft?.countryName || "India"
  );

  const { fetchAllRecurringHolidays, allRecurringHolidays } = useHolidayStore();
  // disableing button for recurriing holidays

  const currentDay = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  const isHoliday = allRecurringHolidays
    .map((day) => day.toLowerCase())
    .includes(currentDay);

  const {
    allFacilities,
    fetchAllFacilities,
    FetchLocationDetails,
    LocationDetails,
  } = useFacilityStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const { allServiceVariants, fetchAllServiceVariants } =
    useServiceVariantStore();
  const { quantities, updateQuantity, setQuantities } = useQuantitiesStore();

  const filteredServiceVariants = useMemo(
    () =>
      filterServiceVariants(allServiceVariants, {
        visitorType,
        showAdult,
        showChild,
        entryOnly,
      }),
    [allServiceVariants, visitorType, showAdult, showChild, entryOnly]
  );

  const pruneHiddenSelections = (
    selectedItems,
    setFieldValue,
    nextFilters = {}
  ) => {
    const nextFiltered = filterServiceVariants(allServiceVariants, {
      visitorType,
      showAdult,
      showChild,
      entryOnly,
      ...nextFilters,
    });
    const visibleIds = new Set(nextFiltered.map((variant) => variant.id));
    const nextSelected = (selectedItems || []).filter((item) =>
      visibleIds.has(item.serviceVarientId)
    );
    if (nextSelected.length !== (selectedItems || []).length) {
      setFieldValue("selectedItems", nextSelected);
      (selectedItems || []).forEach((item) => {
        if (!visibleIds.has(item.serviceVarientId)) {
          const currentQty = quantities[item.serviceVarientId] || 0;
          if (currentQty > 0) {
            updateQuantity(item.serviceVarientId, -currentQty);
          }
        }
      });
    }
  };

  useEffect(() => {
    // Restore quantities when returning from Booking Summary.
    if (restoredDraft?.quantities) {
      setQuantities(restoredDraft.quantities);
    }

    // Reset quantities on unmount only when not holding a summary draft.
    return () => {
      const draft = loadTestZooParkBookingDraft();
      if (draft?.selectedItems?.length) return;
      setQuantities({});
    };
  }, []);

  useEffect(() => {
    fetchAllRecurringHolidays();
    fetchAllFacilities();
    fetchAllServices();
    fetchAllServiceVariants();
    FetchLocationDetails(decodedTokenData?.data?.ParkId);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      document.getElementById("foreigner-checkbox")?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const { toggleItem } = useAccordionStore();

  const skipMobileValidation = parkId === SPECIAL_PARK_ID;

  const validationSchema = useMemo(
    () =>
      Yup.object({
        countryCode:
          !skipMobileValidation && visitorType === "foreigner"
            ? Yup.string().required("Please select a country code")
            : Yup.string(),
        // Empty mobile is handled by Submit popup; yup checks format only.
        mobileNumber: skipMobileValidation
          ? Yup.string()
          : visitorType === "citizen"
            ? Yup.string().test(
                "citizen-mobile-format",
                "Mobile number must exactly 10 digits",
                (value) => {
                  const digits = String(value || "").replace(/\D/g, "");
                  // Empty → Submit popup; partial (1–9) or invalid → error
                  if (!digits) return true;
                  return /^[0-9]{10}$/.test(digits);
                }
              )
            : Yup.string().test(
                "foreigner-mobile-format",
                "Mobile number must contain only digits",
                (value) => !value || /^[0-9]+$/.test(value)
              ),
      }),
    [visitorType, skipMobileValidation]
  );

  const handleGoToBookingSummary = async (values, { setSubmitting }) => {
    try {
      if (!values.selectedItems?.length) {
        toast.error("Please select at least one ticket or service.");
        return;
      }

      if (
        !skipMobileValidation &&
        isMobileNumberEmpty(values.mobileNumber)
      ) {
        setOpenModalId("mobile-required");
        return;
      }

      if (
        !skipMobileValidation &&
        visitorType === "foreigner" &&
        !values.countryCode
      ) {
        toast.error("Please select a country code");
        return;
      }

      const returnPath = location.pathname.startsWith("/book-tickets")
        ? "/book-tickets"
        : "/entity-bookings";

      const bookingDraft = {
        selectedItems: values.selectedItems,
        quantities: { ...quantities },
        mobileNumber: values.mobileNumber,
        countryCode: values.countryCode,
        countryName: values.countryName,
        visitorType,
        showChild,
        entryOnly,
        returnPath,
        bookingDateDisplay: new Date().toISOString(),
        referenceId: null,
      };

      saveTestZooParkBookingDraft(bookingDraft);
      setIsBookingFormVisible(true);
      navigate("/entity-bookings/booking-summary", {
        state: { bookingDraft },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        {IsFirstStepTransaction ? (
          IsTransactionFailed ? (
            <TransactionFailed />
          ) : (
            <div className="Transaction Failed">
              <TransactionQr />
            </div>
          )
        ) : (
          <div>
            {LocationDetails?.openTime && LocationDetails?.closedTime && (
              <div className="flex justify-center items-center gap-1 mb-1">
                <h1 className="text-xl font-semibold text-blue-v2">
                  Park Timings:
                </h1>
                <div className="flex justify-center items-center gap-1 text-xl font-semibold text-blue-v2 ">
                  <h1>{formatTime(LocationDetails?.openTime)} -</h1>
                  <h1>{formatTime(LocationDetails?.closedTime)}</h1>
                </div>
              </div>
            )}
            <Formik
              initialValues={{
                selectedItems: initialSelectedItems,
                mobileNumber: initialMobileNumber,
                countryCode: initialCountryCode,
                countryName: initialCountryName,
              }}
              enableReinitialize
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={(values, actions) => {
                handleGoToBookingSummary(values, actions);
              }}
            >
              {({
                values,
                setFieldValue,
                setFieldTouched,
                setFieldError,
                isSubmitting,
                submitForm,
                validateForm,
                resetForm,
              }) => (
                <>
                <Form className="facility-container space-y-2 px-3 sm:px-4 lg:px-0">
                  <div
                    className={`border border-blue-v1 rounded-md px-3 py-2 shadow-sm w-full ${
                      visitorType === "foreigner"
                        ? "bg-amber-50"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-4">
                      {/* Checkboxes — one horizontal line */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 flex-1 min-w-0">
                        <label className="flex items-center gap-2 text-sm font-medium text-blue-v1 cursor-pointer whitespace-nowrap">
                          <span>Foreigner National</span>
                          <input
                            id="foreigner-checkbox"
                            type="checkbox"
                            data-enterflow="filter"
                            autoFocus
                            className="h-4 w-4 accent-blue-600 cursor-pointer shrink-0 outline-none focus:ring-2 focus:ring-blue-v1 rounded"
                            checked={visitorType === "foreigner"}
                            onKeyDown={handleEnterflowKeyDown}
                            onChange={(e) => {
                              const isForeigner = e.target.checked;
                              const nextVisitorType = isForeigner
                                ? "foreigner"
                                : "citizen";
                              setVisitorType(nextVisitorType);
                              setFieldError("countryCode", undefined);
                              setFieldError("mobileNumber", undefined);

                              if (isForeigner) {
                                setFieldValue("countryCode", "");
                                setFieldValue("countryName", "");
                              } else {
                                setFieldValue("countryCode", "+91");
                                setFieldValue("countryName", "India");
                                if (values.mobileNumber) {
                                  setFieldValue(
                                    "mobileNumber",
                                    String(values.mobileNumber)
                                      .replace(/\D/g, "")
                                      .slice(0, 10)
                                  );
                                }
                              }

                              pruneHiddenSelections(
                                values.selectedItems,
                                setFieldValue,
                                { visitorType: nextVisitorType }
                              );
                            }}
                          />
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-blue-v1 cursor-pointer whitespace-nowrap">
                          <span>Include Child Ticket</span>
                          <input
                            type="checkbox"
                            data-enterflow="filter"
                            className="h-4 w-4 accent-blue-600 cursor-pointer shrink-0 outline-none focus:ring-2 focus:ring-blue-v1 rounded"
                            checked={showChild}
                            onKeyDown={handleEnterflowKeyDown}
                            onChange={(e) => {
                              const nextShowChild = e.target.checked;
                              setShowChild(nextShowChild);
                              pruneHiddenSelections(
                                values.selectedItems,
                                setFieldValue,
                                { showChild: nextShowChild }
                              );
                            }}
                          />
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-blue-v1 cursor-pointer whitespace-nowrap">
                          <span>Entry only</span>
                          <input
                            type="checkbox"
                            data-enterflow="filter"
                            className="h-4 w-4 accent-blue-600 cursor-pointer shrink-0 outline-none focus:ring-2 focus:ring-blue-v1 rounded"
                            checked={entryOnly}
                            onKeyDown={handleEnterflowKeyDown}
                            onChange={(e) => {
                              const nextEntryOnly = e.target.checked;
                              setEntryOnly(nextEntryOnly);
                              pruneHiddenSelections(
                                values.selectedItems,
                                setFieldValue,
                                { entryOnly: nextEntryOnly }
                              );
                            }}
                          />
                        </label>
                        
                      </div>

                      {/* Mobile number — same line on desktop */}
                      <div
                        className={`w-full lg:shrink-0 ${
                          visitorType === "foreigner"
                            ? "lg:w-[600px]"
                            : "lg:w-[320px]"
                        }`}
                      >
                        <label
                          htmlFor="mobileNumber"
                          className="block text-xs font-medium text-blue-v1 mb-1 leading-none"
                        >
                          Mobile number{" "}
                          {!skipMobileValidation && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        {visitorType === "citizen" ? (
                          <div className="flex h-9 w-full rounded-md border border-blue-v1 bg-white overflow-hidden">
                            <span className="px-2.5 text-sm font-semibold text-blue-v1 bg-gray-100 h-full flex items-center border-r border-blue-v1 shrink-0 select-none">
                              +91
                            </span>
                            <Field
                              id="mobileNumber"
                              type="text"
                              name="mobileNumber"
                              data-enterflow="mobile"
                              inputMode="numeric"
                              autoComplete="tel"
                              maxLength={10}
                              disabled={skipMobileValidation}
                              onKeyDown={handleEnterflowKeyDown}
                              className="flex-1 min-w-0 h-full px-3 text-sm text-blue-v2 bg-white border-0 shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none"
                              placeholder="10-digit mobile number"
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10);
                                setFieldValue("mobileNumber", value);
                                setFieldTouched("mobileNumber", true, false);
                                if (
                                  !skipMobileValidation &&
                                  value.length > 0 &&
                                  value.length < 10
                                ) {
                                  setFieldError(
                                    "mobileNumber",
                                    "Please enter 10 digit number"
                                  );
                                } else {
                                  setFieldError("mobileNumber", undefined);
                                }
                              }}
                              onBlur={(e) => {
                                setFieldTouched("mobileNumber", true, false);
                                const digits = String(
                                  e.target.value || ""
                                ).replace(/\D/g, "");
                                if (
                                  !skipMobileValidation &&
                                  digits.length > 0 &&
                                  digits.length < 10
                                ) {
                                  setFieldError(
                                    "mobileNumber",
                                    "Please enter 10 digit number"
                                  );
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="h-9 w-full sm:min-w-[22rem] sm:w-[22rem] rounded-md border border-blue-v1 bg-gray-100 overflow-hidden">
                              <Select
                                name="countryCode"
                                options={COUNTRY_CODE_OPTIONS}
                                value={getSelectedCountryOption(
                                  values.countryCode,
                                  values.countryName
                                )}
                                components={{ Input: CountryCodeEnterflowInput }}
                                onMenuOpen={() => setIsCountryMenuOpen(true)}
                                onMenuClose={() => setIsCountryMenuOpen(false)}
                                onKeyDown={(e) => {
                                  const enterflowEl =
                                    e.target?.closest?.("[data-enterflow]") ||
                                    e.target;

                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    focusEnterflowByOffset(
                                      enterflowEl,
                                      e.shiftKey ? -1 : 1
                                    );
                                    return;
                                  }

                                  if (e.key === "Enter") {
                                    if (isCountryMenuOpen) {
                                      // Let react-select pick the highlighted option,
                                      // then move enterflow into mobile number.
                                      focusMobileAfterCountrySelectRef.current =
                                        true;
                                      return;
                                    }
                                    e.preventDefault();
                                    e.stopPropagation();
                                    focusEnterflowByOffset(enterflowEl, 1);
                                  }
                                }}
                                onChange={(selectedOption) => {
                                  setFieldValue(
                                    "countryCode",
                                    selectedOption?.dial || ""
                                  );
                                  setFieldValue(
                                    "countryName",
                                    selectedOption?.name || ""
                                  );
                                  setFieldTouched("countryCode", true, false);
                                  setFieldError("countryCode", undefined);
                                  if (focusMobileAfterCountrySelectRef.current) {
                                    focusMobileAfterCountrySelectRef.current =
                                      false;
                                    focusMobileNumberInput();
                                  }
                                }}
                                onBlur={() =>
                                  setFieldTouched("countryCode", true, true)
                                }
                                placeholder="Select country code"
                                isClearable
                                isSearchable
                                getOptionLabel={(option) =>
                                  `${option.dial} ${option.name}`
                                }
                                formatOptionLabel={(option) =>
                                  `${option.dial} ${option.name}`
                                }
                                filterOption={(option, rawInput) => {
                                  const input = String(rawInput || "")
                                    .trim()
                                    .toLowerCase();
                                  if (!input) return true;
                                  const dial = String(
                                    option.data?.dial || ""
                                  ).toLowerCase();
                                  const name = String(
                                    option.data?.name || ""
                                  ).toLowerCase();
                                  const label = String(
                                    option.label || ""
                                  ).toLowerCase();
                                  const dialDigits = dial.replace(/\D/g, "");
                                  const inputDigits = input.replace(/\D/g, "");
                                  return (
                                    label.includes(input) ||
                                    name.includes(input) ||
                                    dial.includes(input) ||
                                    (inputDigits.length > 0 &&
                                      dialDigits.includes(inputDigits))
                                  );
                                }}
                                noOptionsMessage={() => "No country found"}
                                classNamePrefix="country-code-select"
                                className="h-full"
                                styles={countryCodeSelectStyles}
                                menuPortalTarget={
                                  typeof document !== "undefined"
                                    ? document.body
                                    : null
                                }
                                menuPosition="fixed"
                              />
                            </div>
                            <div className="flex h-9 w-full sm:flex-1 rounded-md border border-blue-v1 bg-white overflow-hidden">
                              <Field
                                id="mobileNumber"
                                type="text"
                                name="mobileNumber"
                                data-enterflow="mobile"
                                inputMode="numeric"
                                autoComplete="tel"
                                disabled={skipMobileValidation}
                                onKeyDown={handleEnterflowKeyDown}
                                className="flex-1 min-w-0 h-full px-3 text-sm text-blue-v2 bg-white border-0 shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none"
                                placeholder="Enter mobile number"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  setFieldValue("mobileNumber", value);
                                  setFieldTouched("mobileNumber", true, false);
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <ErrorMessage
                          name="countryCode"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                        <ErrorMessage
                          name="mobileNumber"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  {allFacilities
                    ?.filter((facility) =>
                      allServices.some(
                        (service) => service.facilityId === facility.id
                      )
                    )
                    ?.filter((facility) => facility.isCounterEnable)
                    ?.filter((facility) =>
                      allServices.some(
                        (service) =>
                          service.facilityId === facility.id &&
                          service.isActive &&
                          filteredServiceVariants.some(
                            (variant) => variant.serviceId === service.id
                          )
                      )
                    )
                    .map((facility) => {
                      const facilityServices = (allServices || [])
                        .filter((service) => service.isActive)
                        .filter(
                          (service) => service.facilityId === facility.id
                        )
                        .filter((service) =>
                          filteredServiceVariants.some(
                            (variant) => variant.serviceId === service.id
                          )
                        );
                      const facilityLabel = String(
                        facility.displayName || facility.name || ""
                      )
                        .trim()
                        .toLowerCase();
                      const isBatteryOperatedVehicle =
                        facilityLabel.includes("battery operated");
                      const isSafari = facilityLabel.includes("safari");
                      // Hide duplicate outer heading when facility name matches
                      // the only visible service name (e.g. Entry / Entry).
                      const hideFacilityHeading =
                        facilityServices?.length === 1 &&
                        String(
                          facilityServices[0].displayName ||
                            facilityServices[0].name ||
                            ""
                        )
                          .trim()
                          .toLowerCase() === facilityLabel;

                      const isCitizen = visitorType !== "foreigner";
                      const isSpecialCitizenFacility =
                        isCitizen &&
                        (isBatteryOperatedVehicle || isSafari);
                      const facilityCardBorder = isCitizen
                        ? "border-black"
                        : "border-blue-v1";
                      const facilityCardBg = isCitizen
                        ? "bg-white"
                        : "bg-amber-50";

                      return (
                        <div
                          key={facility.id}
                          className={`facility rounded-md overflow-hidden border ${facilityCardBorder}`}
                        >
                          <div className={facilityCardBg}>
                            {!hideFacilityHeading && (
                              <div
                                className="flex justify-between px-2 py-1 border-b border-blue-v1/20"
                                style={
                                  isSpecialCitizenFacility
                                    ? { backgroundColor: "#add8e6" }
                                    : undefined
                                }
                                onClick={() => toggleItem(facility.id)}
                              >
                                <h4 className="text-sm font-bold text-blue-v1 cursor-pointer">
                                  {toTitleCase(facility.displayName) ||
                                    toTitleCase(facility.name)}
                                </h4>
                              </div>
                            )}
                            {/* <p className="text-sm opacity-80">{facility.description}</p> */}

                            <div className="services-container space-y-1 p-1">
                              {facilityServices.map((service) => (
                                  <div
                                    key={service.id}
                                    className={`service px-1.5 py-1 rounded-md ${
                                      visitorType === "foreigner"
                                        ? "bg-amber-100"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                      <div className="flex items-center shrink-0 md:w-[130px] lg:w-[150px]">
                                        <h6 className="text-sm text-blue-v1 font-semibold leading-tight">
                                          {toTitleCase(service.displayName) ||
                                            toTitleCase(service.name)}
                                        </h6>
                                      </div>
                                      <div className="service-variant-container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1 flex-1 min-w-0">
                                      {filteredServiceVariants
                                        .filter(
                                          (variant) =>
                                            variant.serviceId === service.id
                                        )
                                        .map((variant) => (
                                          <div
                                            key={variant.id}
                                            className="service-variant bg-white rounded-md border border-blue-v2 flex flex-row items-center gap-2 min-w-0 px-2 py-1"
                                          >
                                            <h6 className="text-sm font-medium text-[#0c3771] leading-tight break-words flex-1 min-w-0">
                                              {toTitleCase(variant.name) ||
                                                toTitleCase(
                                                  variant.displayName
                                                )}
                                            </h6>

                                            {variant.isPriceFixed ? (
                                              <Field
                                                type="checkbox"
                                                name="selectedItems"
                                                data-enterflow="variant"
                                                checked={values.selectedItems.some(
                                                  (item) =>
                                                    item.serviceVarientId ===
                                                    variant.id
                                                )}
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  const currentQuantity =
                                                    quantities[variant.id] || 0;

                                                  const exists =
                                                    values.selectedItems.find(
                                                      (item) =>
                                                        item.serviceVarientId ===
                                                        variant.id
                                                    );

                                                  if (exists) {
                                                    // Remove item & reset quantity
                                                    updateQuantity(
                                                      variant.id,
                                                      -currentQuantity
                                                    );

                                                    setFieldValue(
                                                      "selectedItems",
                                                      values.selectedItems.filter(
                                                        (item) =>
                                                          item.serviceVarientId !==
                                                          variant.id
                                                      )
                                                    );
                                                  } else {
                                                    // Add new item
                                                    updateQuantity(
                                                      variant.id,
                                                      1
                                                    );

                                                    setFieldValue(
                                                      "selectedItems",
                                                      [
                                                        ...values.selectedItems,
                                                        {
                                                          quantity: 1,
                                                          unitAmount:
                                                            variant.amount || 0,
                                                          facilityId:
                                                            facility.id,
                                                          serviceId: service.id,
                                                          serviceVarientId:
                                                            variant.id,
                                                        },
                                                      ]
                                                    );
                                                  }
                                                }}
                                                onKeyDown={handleEnterflowKeyDown}
                                                className="bg-gray-100 outline-none text-blue-v2 w-4 h-4 rounded hover:bg-gray-200 shrink-0"
                                              />
                                            ) : (
                                              <div className="quantity-controls flex items-center gap-1 shrink-0">
                                                <button
                                                  type="button"
                                                  tabIndex={-1}
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      quantities[variant.id] ||
                                                      0;
                                                    if (currentQuantity > 0) {
                                                      const updatedQuantity =
                                                        currentQuantity - 1;

                                                      // Update quantity
                                                      updateQuantity(
                                                        variant.id,
                                                        -1
                                                      );

                                                      // Remove from selectedItems if quantity is 0
                                                      setFieldValue(
                                                        "selectedItems",
                                                        updatedQuantity === 0
                                                          ? values.selectedItems.filter(
                                                              (item) =>
                                                                item.serviceVarientId !==
                                                                variant.id
                                                            )
                                                          : values.selectedItems.map(
                                                              (item) =>
                                                                item.serviceVarientId ===
                                                                variant.id
                                                                  ? {
                                                                      ...item,
                                                                      quantity:
                                                                        updatedQuantity,
                                                                    }
                                                                  : item
                                                            )
                                                      );
                                                    }
                                                  }}
                                                  className="bg-gray-300 text-gray-800 w-6 h-6 text-sm leading-none rounded hover:bg-gray-400 shrink-0"
                                                >
                                                  -
                                                </button>

                                                <input
                                                  type="text"
                                                  data-enterflow="variant"
                                                  className="text-blue-v2 py-0.5 px-1 text-center font-medium w-10 h-6 text-sm border border-blue-v2 rounded-md placeholder:text-blue-v2 shrink-0"
                                                  value={
                                                    quantities[variant.id] ?? ""
                                                  }
                                                  placeholder="0"
                                                  onChange={(e) => {
                                                    const input =
                                                      e.target.value;

                                                    // Allow only numbers (optional: also allow empty input for better UX)
                                                    if (!/^\d*$/.test(input)) {
                                                      return; // Skip update if non-numeric character detected
                                                    }

                                                    let newValue =
                                                      parseInt(input, 10) || 0;

                                                    // Enforce limit
                                                    if (
                                                      service.limit !== -1 &&
                                                      service.limit !== null &&
                                                      newValue > service.limit
                                                    ) {
                                                      newValue = service.limit; // Automatically correct to max limit
                                                    }

                                                    // Update quantities state directly
                                                    updateQuantity(
                                                      variant.id,
                                                      newValue -
                                                        (quantities[
                                                          variant.id
                                                        ] || 0)
                                                    );

                                                    if (newValue > 0) {
                                                      // Add or update the item in selectedItems
                                                      const newItem = {
                                                        quantity: newValue,
                                                        unitAmount:
                                                          variant.amount || 0,
                                                        facilityId: facility.id,
                                                        serviceId: service.id,
                                                        serviceVarientId:
                                                          variant.id,
                                                      };

                                                      const updatedItems =
                                                        values.selectedItems
                                                          .filter(
                                                            (item) =>
                                                              item.serviceVarientId !==
                                                              variant.id
                                                          )
                                                          .concat(newItem);

                                                      setFieldValue(
                                                        "selectedItems",
                                                        updatedItems
                                                      );
                                                    } else {
                                                      // Remove item if quantity is 0
                                                      setFieldValue(
                                                        "selectedItems",
                                                        values.selectedItems.filter(
                                                          (item) =>
                                                            item.serviceVarientId !==
                                                            variant.id
                                                        )
                                                      );
                                                    }
                                                  }}
                                                  onKeyDown={handleEnterflowKeyDown}
                                                />

                                                <button
                                                  type="button"
                                                  tabIndex={-1}
                                                  // disabled={service.limit === 0}
                                                  disabled={
                                                    service.limit !== -1 &&
                                                    service.limit !== null && // Allow increment if "No Limit"
                                                    (quantities[variant.id] ||
                                                      0) >= service.limit // Check against limit only if it's not "No Limit"
                                                  }
                                                  onClick={() => {
                                                    const newItem = {
                                                      quantity:
                                                        (quantities[
                                                          variant.id
                                                        ] || 0) + 1,
                                                      unitAmount:
                                                        variant.amount || 0,
                                                      facilityId: facility.id,
                                                      serviceId: service.id,
                                                      serviceVarientId:
                                                        variant.id,
                                                    };

                                                    updateQuantity(
                                                      variant.id,
                                                      1
                                                    );

                                                    const updatedItems =
                                                      values.selectedItems
                                                        .filter(
                                                          (item) =>
                                                            item.serviceVarientId !==
                                                            variant.id
                                                        )
                                                        .concat(newItem);

                                                    setFieldValue(
                                                      "selectedItems",
                                                      updatedItems
                                                    );
                                                  }}
                                                  className={` ${
                                                    service.limit !== -1 &&
                                                    service.limit !== null &&
                                                    (quantities[variant.id] ||
                                                      0) >= service.limit
                                                      ? "bg-gray-200"
                                                      : "bg-gray-300 hover:bg-gray-400"
                                                  } text-gray-800 w-6 h-6 text-sm leading-none rounded shrink-0`}
                                                >
                                                  +
                                                </button>
                                              </div>
                                            )}

                                            <p className="text-gray-800 font-semibold text-sm shrink-0 whitespace-nowrap min-w-[3.75rem] text-right">
                                              {formatToCurrency(variant.amount)}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                      {service.limit >= 0 &&
                                      service.limit != null ? (
                                        <div className="flex gap-1 items-center shrink-0 md:ml-auto">
                                          <span className="text-blue-v1 text-sm font-semibold leading-none">
                                           Available Tickets:
                                          </span>
                                          <span className="text-blue-v2 font-bold text-sm">
                                            {service.limit}
                                          </span>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  <div className="relative flex justify-center items-center p-2">
                    <button
                      type="button"
                      data-enterflow="continue"
                      disabled={
                        !values.selectedItems?.length ||
                        isSubmitting ||
                        isHoliday
                      }
                      onClick={async () => {
                        if (!values.selectedItems?.length || isHoliday) return;

                        // Citizen: mobile must be exactly 10 digits first
                        if (
                          !skipMobileValidation &&
                          visitorType === "citizen" &&
                          !isCitizenMobileValid(values.mobileNumber)
                        ) {
                          setFieldTouched("mobileNumber", true, false);
                          setFieldError(
                            "mobileNumber",
                            "Please enter 10 digit number"
                          );
                          focusMobileNumberInput();
                          return;
                        }

                        if (
                          !skipMobileValidation &&
                          visitorType === "foreigner" &&
                          isMobileNumberEmpty(values.mobileNumber)
                        ) {
                          setOpenModalId("mobile-required");
                          focusMobileNumberInput();
                          return;
                        }

                        const formErrors = await validateForm();
                        if (formErrors && Object.keys(formErrors).length) {
                          Object.keys(formErrors).forEach((field) =>
                            setFieldTouched(field, true, false)
                          );
                          if (formErrors.mobileNumber || formErrors.countryCode) {
                            focusMobileNumberInput();
                          }
                          return;
                        }
                        submitForm();
                      }}
                      onKeyDown={(e) =>
                        handleEnterflowKeyDown(e, {
                          onActivate: () => e.currentTarget.click(),
                          onSpace: () => e.currentTarget.click(),
                        })
                      }
                      className={`text-base rounded-lg px-4 py-1.5 outline-none transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-v1/50 focus-visible:ring-offset-2 focus:ring-4 focus:ring-blue-v1/50 focus:ring-offset-2 focus:scale-[1.03] focus:shadow-lg ${
                        !values.selectedItems?.length || isHoliday
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : isSubmitting
                          ? "bg-gradient-to-r from-blue-v1 via-blue-800 to-blue-v1 animate-pulse text-white"
                          : "bg-blue-v1 text-white hover:bg-blue-v2"
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="font-light">Loading . . .</span>
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={
                        !values.selectedItems?.length || isSubmitting
                      }
                      onClick={() => setOpenModalId("reset-selection")}
                      className={`absolute right-2 sm:right-4 text-base rounded-lg px-4 py-1.5 outline-none transition-all duration-150 ${
                        !values.selectedItems?.length || isSubmitting
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                      }`}
                    >
                      Reset
                    </button>
                  </div>
                </Form>
                {/* reset selection confirm */}
                <PopupModal
                  popupModalId="reset-selection-modal"
                  isOpen={openModalId === "reset-selection"}
                  onClose={closeModal}
                  size="small"
                  overlayClassName="bg-gray-800 bg-opacity-60"
                  contentClassName="bg-white border-2 border-blue-v1"
                  defaultBodyPadding={true}
                >
                  <div className="px-8 py-10 text-center">
                    <h1 className="text-blue-v1 font-semibold text-base">
                      Do you want to reset card selection?
                    </h1>
                    <div className="flex justify-center gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          // Reset cards, quantities, mobile, country, and checkboxes.
                          setQuantities({});
                          setVisitorType("citizen");
                          setShowChild(true);
                          setEntryOnly(false);
                          setInitialSelectedItems([]);
                          setInitialMobileNumber("");
                          setInitialCountryCode("+91");
                          setInitialCountryName("India");
                          resetForm({
                            values: {
                              selectedItems: [],
                              mobileNumber: "",
                              countryCode: "+91",
                              countryName: "India",
                            },
                          });
                          clearTestZooParkBookingDraft();
                          closeModal();
                        }}
                        className="bg-blue-v1 hover:bg-blue-v2 text-white px-6 py-1.5 shadow-md rounded-md"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-1.5 shadow-md rounded-md"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </PopupModal>
                </>
              )}
            </Formik>
          </div>
        )}
        {/* mobile number required */}
        <PopupModal
          popupModalId="mobile-required-modal"
          isOpen={openModalId === "mobile-required"}
          onClose={() => {
            closeModal();
            focusMobileNumberInput();
          }}
          size="small"
          overlayClassName="bg-gray-800 bg-opacity-60"
          contentClassName="bg-white border-2 border-red-500"
          defaultBodyPadding={true}
        >
          <div className="px-8 py-10 text-center">
            <h1 className="text-red-600 font-semibold text-base">
              Please enter the customer mobile number.
            </h1>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  focusMobileNumberInput();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-1.5 shadow-md rounded-md"
              >
                Okay
              </button>
            </div>
          </div>
        </PopupModal>
      </div>
    </>
  );
};

export default FacilityServicesTestZooPark;
