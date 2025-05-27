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

