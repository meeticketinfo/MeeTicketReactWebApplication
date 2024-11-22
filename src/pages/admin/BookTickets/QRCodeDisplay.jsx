import React from "react";

export default function QRCodeDisplay({ binaryQRCode }) {
  
  return (
    <div>
      <img
        src={`data:image/png;base64,${binaryQRCode}`}
        alt="QR Code"
        // style={{ width: 200, height: 200 }}
      />
    </div>
  );
}
