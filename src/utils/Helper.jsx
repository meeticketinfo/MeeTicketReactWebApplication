// export const launchPaytmPOS = (deeplinkUrl) => {
//   const iframe = document.createElement("iframe");
//   iframe.style.display = "none";
//   iframe.src = deeplinkUrl;
//   document.body.appendChild(iframe);

//   setTimeout(() => {
//     document.body.removeChild(iframe);
//   }, 1000);
// };

export const launchPaytmPOS = (deeplinkUrl) => {
  window.location.href = deeplinkUrl; // More reliable than using iframe
};
[];

export function formatDate(dateTimeString) {
  return dateTimeString?.split("T")[0] || "";
}

// dates

// dateHelpers.js

const getFormattedDate = (date) => {
  const formattedDate = new Date(date);
  return formattedDate.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
};

const getStartOfWeek = (date) => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
  const diff = startOfWeek.getDate() - dayOfWeek; // Calculate the difference to the start of the week (Sunday)
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0); // Set time to 00:00:00
  return startOfWeek;
};

// Function to get the end of the week (Saturday)
const getEndOfWeek = (date) => {
  const endOfWeek = new Date(date);
  const dayOfWeek = endOfWeek.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
  const diff = endOfWeek.getDate() + (6 - dayOfWeek); // Calculate the difference to the end of the week (Saturday)
  endOfWeek.setDate(diff);
  endOfWeek.setHours(23, 59, 59, 999); // Set time to 23:59:59.999 (end of the day)
  return endOfWeek;
};

export const getStartOfCurrentDay = () => {
  const currentDate = new Date();
  const startOfDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0, 0));
  return getFormattedDate(startOfDay);
};

export const getEndOfCurrentDay = () => {
  const currentDate = new Date();
  const endOfDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999));
  return getFormattedDate(endOfDay);
};

export const cleanString = (str, symbol1, symbol2) => {
  return typeof str === "string" ? str ? str.replace(symbol1, symbol2) : str : str;
}

export const getValueFromQuery = (queryString, key) => {
  const pairs = queryString.split('&');

  for (const pair of pairs) {
    const [k, v] = pair.split('=');
    if (k === key) {
      return v;
    }
  }

  return null; // or undefined, or throw error if key not found
}

export const getDateRange = (rangeType) => {
  const currentDate = new Date();
  let fromDate = currentDate;
  let toDate = currentDate;

  switch (rangeType) {
    case "today":
      // For today, set fromDate to 12:00 AM and toDate to 11:59 PM using UTC
      const now = new Date();
      fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
      toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
      break;

    case "week":
      // For week, calculate start and end of the current week using UTC
      const weekStart = new Date();
      const dayOfWeek = weekStart.getUTCDay();
      const diff = weekStart.getUTCDate() - dayOfWeek;
      fromDate = new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), diff, 0, 0, 0, 0));
      toDate = new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), diff + 6, 23, 59, 59, 999));
      break;

    case "month":
      // For month, calculate start and end of the current month using UTC
      const monthStart = new Date();
      fromDate = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), 1, 0, 0, 0, 0));
      toDate = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0, 23, 59, 59, 999));
      break;

    case "year":
      // For year, calculate start and end of the current year using UTC
      const yearStart = new Date();
      fromDate = new Date(Date.UTC(yearStart.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      toDate = new Date(Date.UTC(yearStart.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
      break;

    default:
      break;
  }

  return {
    fromDate: getFormattedDate(fromDate),
    toDate: getFormattedDate(toDate),
  };
};
