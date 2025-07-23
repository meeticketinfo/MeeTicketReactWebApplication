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
};[]

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
