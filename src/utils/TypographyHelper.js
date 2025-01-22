export const toTitleCase = (text) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const toUpperCase = (text) => {
  return text.toUpperCase();
};

export const toLowerCase = (text) => {
  return text.toLowerCase();
};

export const formatToStandardTime = (dateInput) => {
  let date;

  // Try parsing the date input
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }
  }

  // Format date to HH:MM:SS
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const formatToStandardDate = (dateInput) => {
  let date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
};

export const formatToCurrency = (
  amount,
  currency = "INR",
  locale = "en-IN"
) => {
  if (isNaN(amount)) {
    // throw new Error("Invalid amount");
    return "Invalid amount";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
