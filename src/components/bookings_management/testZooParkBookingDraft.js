/** Session draft for Test Zoo Park booking → summary flow. */
export const TEST_ZOO_PARK_BOOKING_DRAFT_KEY = "testZooParkBookingDraft";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

export const getVariantDisplayName = (variant) =>
  String(
    variant?.name ||
      variant?.varientName ||
      variant?.displayName ||
      variant?.serviceVariantName ||
      ""
  ).trim();

export const isAdultVariantName = (name) =>
  /\badult\b/.test(normalizeText(name));

export const isChildVariantName = (name) =>
  /\bchild\b/.test(normalizeText(name));

export const isPersonCategoryVariantName = (name) =>
  isAdultVariantName(name) || isChildVariantName(name);

export const calculateSelectedItemsTotal = (selectedItems = []) =>
  (selectedItems || []).reduce(
    (total, item) => total + (item.quantity || 0) * (item.unitAmount || 0),
    0
  );

const toMoney = (value) => Number(Number(value || 0).toFixed(2));

/** Round amount up to the next whole rupee. */
const ceilMoney = (value) => Math.ceil(Number(value || 0));

/** Resolve Entry facility/service/variant for institutional discount scope. */
export const isEntryBookingItem = (
  item,
  { allServiceVariants = [], allServices = [], allFacilities = [] } = {}
) => {
  const variant = (allServiceVariants || []).find(
    (v) => v.id === item?.serviceVarientId
  );
  if (variant) {
    const serviceName = normalizeText(variant.serviceName);
    const facilityName = normalizeText(variant.facilityName);
    if (serviceName === "entry" || facilityName === "entry") return true;
  }

  const service = (allServices || []).find((s) => s.id === item?.serviceId);
  if (service) {
    const name = normalizeText(service.displayName || service.name);
    if (name === "entry") return true;
  }

  const facility = (allFacilities || []).find((f) => f.id === item?.facilityId);
  if (facility) {
    const name = normalizeText(facility.displayName || facility.name);
    if (name === "entry") return true;
  }

  return false;
};

/**
 * Government → fixed 25%.
 * Private + Discount Yes → user percent (1–100).
 * Otherwise → no institutional Entry discount.
 */
export const resolveInstitutionalDiscountPercent = ({
  isInstitutional,
  institutionalType,
  institutionalDiscount,
  institutionalDiscountPercent,
} = {}) => {
  if (!isInstitutional) return null;

  if (institutionalType === "government") return 25;

  if (
    institutionalType === "private" &&
    String(institutionalDiscount || "").toLowerCase() === "yes"
  ) {
    const pct = Number(institutionalDiscountPercent);
    if (!Number.isNaN(pct) && pct > 0 && pct <= 100) return pct;
    return null;
  }

  return null;
};

/**
 * Entry-only institutional concession.
 * Other facilities stay full price; grandTotal = entryNet + otherGross.
 */
export const calculateInstitutionalEntryConcession = ({
  selectedItems = [],
  allServiceVariants = [],
  allServices = [],
  allFacilities = [],
  isInstitutional,
  institutionalType,
  institutionalDiscount,
  institutionalDiscountPercent,
} = {}) => {
  const lookups = { allServiceVariants, allServices, allFacilities };
  const rawTotal = calculateSelectedItemsTotal(selectedItems);
  const percent = resolveInstitutionalDiscountPercent({
    isInstitutional,
    institutionalType,
    institutionalDiscount,
    institutionalDiscountPercent,
  });

  if (percent == null) {
    return {
      applicable: false,
      percent: 0,
      entryGross: 0,
      discountAmount: 0,
      entryNet: 0,
      otherGross: rawTotal,
      grandTotal: ceilMoney(rawTotal),
      institutionLabel: "",
    };
  }

  let entryGross = 0;
  let otherGross = 0;
  (selectedItems || []).forEach((item) => {
    const line =
      (Number(item.quantity) || 0) * (Number(item.unitAmount) || 0);
    if (isEntryBookingItem(item, lookups)) entryGross += line;
    else otherGross += line;
  });
  entryGross = toMoney(entryGross);
  otherGross = toMoney(otherGross);

  if (entryGross <= 0) {
    return {
      applicable: false,
      percent,
      entryGross: 0,
      discountAmount: 0,
      entryNet: 0,
      otherGross,
      grandTotal: ceilMoney(otherGross),
      institutionLabel: "",
    };
  }

  const discountAmount = toMoney((entryGross * percent) / 100);
  // Ceiling Entry-after-discount and final payable totals
  const entryNet = ceilMoney(entryGross - discountAmount);
  const institutionLabel =
    institutionalType === "government"
      ? "Government Institutions"
      : "Private Institutions";

  return {
    applicable: true,
    percent,
    entryGross,
    discountAmount,
    entryNet,
    otherGross,
    grandTotal: ceilMoney(entryNet + otherGross),
    institutionLabel,
  };
};

/** Adjust Entry line unitAmounts so Entry lines sum to entryNet (for API payload). */
export const applyInstitutionalEntryDiscountToSelectedItems = (
  selectedItems = [],
  concession,
  lookups = {}
) => {
  if (!concession?.applicable || !(concession.entryGross > 0)) {
    return selectedItems || [];
  }

  return (selectedItems || []).map((item) => {
    if (!isEntryBookingItem(item, lookups)) return item;
    const qty = Number(item.quantity) || 0;
    const unit = Number(item.unitAmount) || 0;
    const lineGross = qty * unit;
    const lineNet =
      lineGross -
      (lineGross / concession.entryGross) * concession.discountAmount;
    return {
      ...item,
      originalUnitAmount: unit,
      unitAmount: qty > 0 ? toMoney(lineNet / qty) : unit,
    };
  });
};

/**
 * Group selected variants into summary table rows:
 * - Adult/Child pairs under the same service → one row with adult & child counts
 * - Non-person variants (camera, luggage, per-hour seats, etc.) → own row with qty
 */
export const buildBookingSummaryRows = (
  selectedItems = [],
  { allServiceVariants = [], allServices = [] } = {}
) => {
  const variantById = new Map(
    (allServiceVariants || []).map((variant) => [variant.id, variant])
  );
  const serviceById = new Map(
    (allServices || []).map((service) => [service.id, service])
  );

  const personGroups = new Map();
  const nonPersonRows = [];

  (selectedItems || []).forEach((item, index) => {
    const variant = variantById.get(item.serviceVarientId);
    const service = serviceById.get(item.serviceId);
    const variantName = getVariantDisplayName(variant);
    const serviceName = String(
      service?.displayName || service?.name || ""
    ).trim();
    const quantity = Number(item.quantity) || 0;
    const lineTotal = quantity * (Number(item.unitAmount) || 0);

    if (!quantity) return;

    if (isPersonCategoryVariantName(variantName)) {
      const groupKey = item.serviceId || `service-${index}`;
      if (!personGroups.has(groupKey)) {
        personGroups.set(groupKey, {
          id: groupKey,
          ticketType: serviceName || variantName || "Ticket",
          adults: 0,
          children: 0,
          totalAmount: 0,
          isNonPerson: false,
        });
      }
      const group = personGroups.get(groupKey);
      if (isAdultVariantName(variantName)) {
        group.adults += quantity;
      } else if (isChildVariantName(variantName)) {
        group.children += quantity;
      }
      group.totalAmount += lineTotal;
      return;
    }

    nonPersonRows.push({
      id: item.serviceVarientId || `non-person-${index}`,
      ticketType: variantName || serviceName || "Item",
      adults: null,
      children: null,
      quantity,
      totalAmount: lineTotal,
      isNonPerson: true,
    });
  });

  return [...personGroups.values(), ...nonPersonRows];
};

export const saveTestZooParkBookingDraft = (draft) => {
  try {
    sessionStorage.setItem(
      TEST_ZOO_PARK_BOOKING_DRAFT_KEY,
      JSON.stringify({
        ...draft,
        savedAt: Date.now(),
      })
    );
  } catch (error) {
    console.error("Failed to save Test Zoo Park booking draft", error);
  }
};

export const loadTestZooParkBookingDraft = () => {
  try {
    const raw = sessionStorage.getItem(TEST_ZOO_PARK_BOOKING_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load Test Zoo Park booking draft", error);
    return null;
  }
};

export const clearTestZooParkBookingDraft = () => {
  try {
    sessionStorage.removeItem(TEST_ZOO_PARK_BOOKING_DRAFT_KEY);
  } catch (error) {
    console.error("Failed to clear Test Zoo Park booking draft", error);
  }
};

export const formatBookingDateTimePayload = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:00:00.000`;
};

export const formatDisplayBookingDate = (date = new Date()) => {
  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
};

export const getBookingMobileNumber = (visitorType, countryCode, mobileNumber) => {
  const digits = String(mobileNumber || "").replace(/\D/g, "");
  if (visitorType === "foreigner") {
    return `${countryCode || ""}${digits}`;
  }
  return digits;
};
