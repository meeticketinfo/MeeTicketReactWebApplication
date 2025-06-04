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

export const getDateRange = (rangeType) => {
  const currentDate = new Date();
  let fromDate = currentDate;
  let toDate = currentDate;

  switch (rangeType) {
    case "today":
      // For today, set fromDate to 12:00 AM and toDate to 12:00 PM
      fromDate = new Date(currentDate.setHours(0, 0, 0, 0)); // 12:00 AM today
      toDate = new Date(currentDate.setHours(12, 0, 0, 0)); // 12:00 PM today
      break;

    case "week":
      // For week, calculate start and end of the current week
      fromDate = getStartOfWeek(currentDate);
      toDate = getEndOfWeek(currentDate);
      break;

    case "month":
      // For month, calculate start and end of the current month
      fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the current month
      toDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ); // Last day of the current month
      break;

    case "year":
      // For year, calculate start and end of the current year
      fromDate = new Date(currentDate.getFullYear(), 0, 1); // First day of the current year
      toDate = new Date(currentDate.getFullYear(), 11, 31); // Last day of the current year
      break;

    default:
      break;
  }

  return {
    fromDate: getFormattedDate(fromDate),
    toDate: getFormattedDate(toDate),
  };
};
