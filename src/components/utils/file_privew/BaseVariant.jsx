import React from "react";

const BaseVariant = ({ file, fileType, fileUrl }) => {
  //   if (!file) {
  //     return null;
  //   }

  const previewStyle = {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    borderRadius: "14px",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  };
  const emptyPreviewStyle = {
    width: "100%",
    height: "100px",
    objectFit: "cover",
    borderRadius: "14px",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    display: "flex",
    justifyContent: "center",
    padding: "10px",
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Image Preview */}
      {fileType?.includes("image") && (
        <div>
          {/* <h4>Image Preview:</h4> */}
          <img src={fileUrl} alt="preview" style={previewStyle} />
        </div>
      )}

      {/* PDF Preview */}
      {fileType?.includes("pdf") && (
        <div>
          {/* <h4>PDF Preview:</h4> */}
          <embed
            src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${fileUrl}#toolbar=0`}
            type="application/pdf"
            style={previewStyle}
          />
        </div>
      )}

      {/* Fallback for other file types */}
      {/* {!fileType?.includes("image") && !fileType?.includes("pdf") && file && (
        <div style={emptyPreviewStyle}>
          <p>Preview not available for this file type.</p>
        </div>
      )} */}
    </div>
  );
};

export default BaseVariant;
