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

export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file); // Convert to base64
  });
};

// Enhanced function to convert image URL to base64 with better CORS handling
export const convertImageUrlToBase64 = async (imageUrl) => {
  // If already base64, return as is
  if (imageUrl.startsWith('data:image/')) {
    return imageUrl;
  }

  try {
    // Method 1: Try using canvas (handles CORS better)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataURL);
        } catch (error) {
          // If canvas method fails, try fetch
          fetchImageAsBase64(imageUrl).then(resolve).catch(reject);
        }
      };
      
      img.onerror = () => {
        // If image loading fails, try fetch
        fetchImageAsBase64(imageUrl).then(resolve).catch(reject);
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('Error in convertImageUrlToBase64:', error);
    throw error;
  }
};

// Fallback function using fetch
const fetchImageAsBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Fetch method failed:', error);
    throw error;
  }
};
// dates

// dateHelpers.js

export const getFormattedDate = (date) => {
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

// for rtc busspass total transaction report

export const getStartOfCurrentDayRtc = () => {
  const currentDate = new Date();
  return currentDate.toISOString().split("T")[0] ;
};

export const getEndOfCurrentDayRtc = () => {
  const currentDate = new Date();
  return currentDate.toISOString().split("T")[0];
};

// intercity total transaction report

export const getStartOfCurrentDayIntercity = () => {
  const currentDate = new Date();
  return currentDate.toISOString().split("T")[0] ;
};

export const getEndOfCurrentDayIntercity = () => {
  const currentDate = new Date();
  return currentDate.toISOString().split("T")[0];
};

export const cleanString = (str, symbol1, symbol2) => {
  return typeof str === "string" ? str ? str.replace(symbol1, symbol2) : str : str;
}

export const getValueFromQuery = (queryString, key) => {
  const pairs = queryString?.split('&');

  for (const pair of pairs) {
    const [k, v] = pair?.split('=');
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

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
  const year = date.getFullYear(); // Get year
  const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `${formattedDate} ${formattedTime}`;
};

// Hardcoded department to location category mapping
export const departmentToCategoryMapping = {
  "Metro": ["Metro"],
  "Telangana Tourism Development Corporation Limited": ["Parks", "Boating"],
  "Endowments Department": ["Temples"],
  "Forest Department": ["WaterFalls", "Parks"],
  "HMDA": ["Parks", "Boating"],
  "GHMC": ["GHMC Park"],
  "CDMA": ["Parks", "Boating"],
  "ASI": ["Parks"]
};

export const formatDateTimeToReadable = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(date);
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(date);

  return `${formattedDate}\n${formattedTime}`;
};

// Helper function to convert 24-hour format to 12-hour format
export const convertTo12HourFormat = (time24) => {
  if (!time24) return "";
  
  try {
    // Handle different time formats
    let timeString = time24.toString();
    
    // If it's already in HH:MM format
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    
    // If it's in HHMM format (e.g., "1430")
    if (timeString.length === 4) {
      const hours = parseInt(timeString.substring(0, 2), 10);
      const minutes = timeString.substring(2, 4);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    
    // If it's just hours (e.g., "14")
    if (timeString.length === 2) {
      const hours = parseInt(timeString, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hour12} ${ampm}`;
    }
    
    return time24; // Return original if format is not recognized
  } catch (error) {
    console.error('Error converting time format:', error);
    return time24; // Return original if conversion fails
  }
};

// numbber formater
export const formatCount = (value) => {
  if (!value || isNaN(value)) return "0";

  // < 1 Lakh → exact number
  if (value < 100000) {
    return value.toLocaleString("en-IN");
  }

  const formatWithUnit = (num, unitValue, unitLabel) => {
    const raw = value / unitValue;
    const remainder = value % unitValue;

    // auto decimals: 1 or 2
    const formatted =
      raw < 10
        ? raw.toFixed(2)
        : raw.toFixed(1);

    return (
      formatted.replace(/\.0+$/, "") +
      " " +
      unitLabel +
      (remainder > 0 ? "+" : "")
    );
  };

  // Lakhs
  if (value < 10000000) {
    return formatWithUnit(value, 100000, "L");
  }

  // Crores
  return formatWithUnit(value, 10000000, "Cr");
};
