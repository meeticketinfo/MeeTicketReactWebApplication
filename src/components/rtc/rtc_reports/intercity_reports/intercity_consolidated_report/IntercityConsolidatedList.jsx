import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable from "../../../../tables/AgGridTable";
import {
  formatToCurrency,
  formatToStandardDate,
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import IntercityConsolidatedReportForm from "./IntercityConsolidatedReportForm";
import { useIntercityConsolidateStore } from "./IntercityConsolidateStore";
function IntercityConsolidatedList() {
  const savedFilters = JSON.parse(
    localStorage.getItem("intercity-consolidated-filters")
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const {
    fetchIntercityConsolidateData,
    IntercityConsolidateData,
    isFetchIntercityConsolidateData,
  } = useIntercityConsolidateStore();
  useEffect(() => {
    fetchIntercityConsolidateData({
      purchaseOrBooking:savedFilters?.purchaseOrBooking ?? "Purchase",
      fromDate: savedFilters?.fromDate ?? getCurrentDate(),
      toDate: savedFilters?.toDate ?? getCurrentDate(),
      mobileNumber: savedFilters?.mobileNumber ?? "",
      bookingDate: savedFilters?.bookingDate ?? "",
      PNRNumber: savedFilters?.PNRNumber ?? "",
      paymentMode: savedFilters?.paymentMode ?? "",
      orderId: savedFilters?.orderId ?? "",
      transactionId: savedFilters?.transactionId ?? "",
      typeOfBus: savedFilters?.typeOfBus ?? "",
      departureLocation: savedFilters?.departureLocation ?? "",
      arrivalLocation: savedFilters?.arrivalLocation ?? "",
      pageNumber: currentPage + 1,
      PageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

  const columnDefs = [
    {
      field: "sno",
      headerName: "S.No",
      maxWidth: 70,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
    },
    {
      field: "pnrNumber",
      headerName: "PNR Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "returnPNRNumber",
      headerName: "Return PNR No",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "departureLocation",
      headerName: "Departure Location",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "arrivalLocation",
      headerName: "Arrival Location",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile number",
      maxWidth: 140,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "busType",
      headerName: " Bus Type",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "seatLayoutType",
      headerName: "Seat Layout Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // -------------------

    {
      field: "travelType",
      headerName: "Travel type",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "mid",
      headerName: "MID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "bookingDate",
      headerName: "Purchase Date",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    // {
    //   field: "bookingDate",
    //   headerName: "Booking Date",
    //   // flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => {
    //     if (!params.value) return "N/A";
    //     const date = new Date(params.value);
    //     const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
    //     const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
    //     const year = date.getFullYear(); // Get year
    //     const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
    //     const formattedTime = date.toLocaleTimeString("en-US", {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       second: "2-digit",
    //       hour12: true,
    //     });
    //     return `${formattedDate} ${formattedTime}`;
    //   },
    //   // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    // },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 130, 
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A"),
    },
    {
      field: "settled_Date",
      headerName: "Settled Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
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
      },
      // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "settledamount",
      headerName: "Settled Amount",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A"),
    },

    // {
    //   field: "payout_Date",
    //   headerName: "Payout Date",
    //   // maxWidth: 170,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => {
    //     if (!params.value) return "N/A";
    //     const date = new Date(params.value);
    //     const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
    //     const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
    //     const year = date.getFullYear(); // Get year
    //     const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
    //     const formattedTime = date.toLocaleTimeString("en-US", {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       second: "2-digit",
    //       hour12: true,
    //     });
    //     return `${formattedDate} ${formattedTime}`;
    //   },
    //   // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    // },

    {
      field: "utr",
      headerName: "UTR",
      // minWidth: 130,
      maxWidth: 140,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },


    // {
    //   field: "utrprocessedtime",
    //   headerName: "Utr Processed Date",
    //   // maxWidth: 170,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => {
    //     if (!params.value) return "N/A";
    //     const date = new Date(params.value);
    //     const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
    //     const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
    //     const year = date.getFullYear(); // Get year
    //     const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
    //     const formattedTime = date.toLocaleTimeString("en-US", {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       second: "2-digit",
    //       hour12: true,
    //     });
    //     return `${formattedDate} ${formattedTime}`;
    //   },
    //   // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    // },
    {
      field: "purchaseDate",
      headerName: "Travel Date",
      maxWidth: 180,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
       
        return `${formattedDate} `;
      },
    },
    {
      field: "returnJourneyTravelDate",
      headerName: "Return Journey Travel Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
       
        return `${formattedDate} `;
      },
    },
    {
      field: "ticketQuantity",
      headerName: "Ticket Quantity",
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "orderId",
      headerName: "Order ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      // flex: 1,
      maxWidth: 130,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // valueFormatter: (params) =>
      //   formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "basicFare",
      headerName: "Basic Fare",
      // flex: 1,
      maxWidth: 100,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "totalLeviesFee",
      headerName: "Total Levies Fee",
      // flex: 1,
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "serviceTaxGST",
      headerName: "Service Tax(GST)",
      // flex: 1,
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "flexiFare",
      headerName: "Flexi Fare",
      // flex: 1,
      maxWidth: 100,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },

    // {
    //   field: "totalAmount",
    //   headerName: "Total Amount",
    //   // flex: 1,
    //   maxWidth: 150,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    // },
    {
      field: "paymentTransactionId",
      headerName: "Payment Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "bookingStatus",
      headerName: "Booking  Status",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      headerName: "Ticket",
      field: "action",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          {params.data.pnrNumber ? (
            <NavLink
              end
              to={`/intercity-ticket-view-details/${params.data.pnrNumber}`}
              className="bg-blue-v2 text-white px-4 py-2 rounded-md font-semibold transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Onwards Journey
            </NavLink>
          ) : (
            <span
              className="bg-blue-v2 text-white px-4 py-2 rounded-md font-semibold opacity-50 cursor-not-allowed"
              aria-disabled="true"
              tabIndex={-1}
            >
              Onwards Journey
            </span>
          )}
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      headerName: "Ticket",
      field: "action",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          {params.data.returnPNRNumber ? (
            <NavLink
              end
              to={`/intercity-ticket-view-details/${params.data.returnPNRNumber}`}
              className="bg-blue-v2 text-white px-4 py-2 rounded-md font-semibold transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Return Journey
            </NavLink>
          ) : (
            <span
              className="bg-blue-v2 text-white px-4 py-2 rounded-md font-semibold opacity-50 cursor-not-allowed"
              aria-disabled="true"
              tabIndex={-1}
            >
              Return Journey
            </span>
          )}
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "refundDate",
      headerName: "Refund Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "refundId",
      headerName: "Refund ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "refundStatus",
      headerName: "Refund status",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "paytmSettledUTR",
      headerName: "Paytm Settled UTR",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "utrProcessedTime",
      headerName: "UTR Processed Time",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
  ];
  return (
    <div>
      <IntercityConsolidatedReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <AgGridTable
        ExportName="Intercity Consolidated Report"
        rowData={IntercityConsolidateData}
        columnDefs={columnDefs}
        isFetchLoading={isFetchIntercityConsolidateData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={IntercityConsolidateData[0]?.totalCount}
        tableHeight={IntercityConsolidateData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </div>
  );
}

export default IntercityConsolidatedList;
