import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";
import { formatToCurrency, toTitleCase } from "../../../utils/TypographyHelper";
import { useParkStore } from "../../../store/masters/parksStore";

export default function EntitiesDetails() {
  const { id } = useParams();
  const [entityDetails, setEntityDetails] = useState(null); // Start with null to handle different data types
  const {
    fetchCurrentEntityDetailsByParkId,
  } = useParkStore();

  useEffect(() => {
    fetchEntities(id);
  }, []);

  const fetchEntities = async (parkId) => {
    try {
      const result = await fetchCurrentEntityDetailsByParkId(parkId);
      if (result && result.data && result.data.status === 200) {
        setEntityDetails(result.data.data.entityDetails);
        console.log("entityDetails", result.data.data.data.entityDetails);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      handleApiError(xhr);
    }
  };

  const handlePrint = () => {
    const printContents = document.querySelectorAll(".printable-card");

    // Create a temporary print window
    const printWindow = window.open("", "_blank");

    // Prepare the content to print
    let content = "";
    printContents.forEach((card) => {
      content += card.outerHTML; // Get the entire HTML structure of the card
    });

    // Define styles for the handheld printer
    const printStyles = `
    <style>
      @page {
        size: 58mm 100mm; /* Adjust the width and height for ticket dimensions */
        margin: 5mm; /* Add small margins for better readability */
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        width: 58mm; /* Match the page size */
      }
      .printable-card {
        width: 100%; /* Fit within the 58mm width */
        padding: 5mm;
        border: 1px solid #ccc; /* Optional border */
        margin-bottom: 5mm;
        page-break-inside: avoid;
        font-size: 12px; /* Adjust font size for readability */
      }
      .printable-card ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      .printable-card li {
        margin-bottom: 5px;
      }
      .printable-card hr {
        border: none;
        border-top: 1px solid #ccc;
        margin: 5px 0;
      }
    </style>
  `;

    // Write the content and styles to the print window
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        ${printStyles}
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Entity Details
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <NavLink
              end
              to="/entities"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Back
            </NavLink>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
