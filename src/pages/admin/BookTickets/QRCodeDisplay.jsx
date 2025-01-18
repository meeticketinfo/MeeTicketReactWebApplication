import React from "react";

export default function QRCodeDisplay({ binaryQRCode }) {
  
  return (
    <div>
      <img
        style={{width: "100%"}}
        src={`data:image/png;base64,${binaryQRCode}`}
        alt="QR Code"
        // style={{ width: 200, height: 200 }}
      />
    </div>
  );
}
