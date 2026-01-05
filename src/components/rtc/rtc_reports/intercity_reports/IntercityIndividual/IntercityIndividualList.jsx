import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import AgGridTable from "../../../../tables/AgGridTable";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import IntercityIndividualReportForm from "./IntercityIndividualReportForm";
import { useIntercityIndividualStore } from "./InterCityIndividualStore";
function IntercityIndividualList() {
  const savedFilters = JSON.parse(
    localStorage.getItem("intercity-individual-filters")
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const {
    fetchIntercityIndividualData,
    IntercityIndividualData,
    isFetchIntercityIndividualData,
  } = useIntercityIndividualStore();
  useEffect(() => {
    fetchIntercityIndividualData({
      fromDate: savedFilters?.fromDate ?? getCurrentDate(),
      toDate: savedFilters?.toDate ?? getCurrentDate(),
      mobileNumber: savedFilters?.mobileNumber ? savedFilters.mobileNumber : "",
      bookingDate: savedFilters?.bookingDate ? savedFilters.bookingDate : "",
      pnrNumber: savedFilters?.pnrNumber ? savedFilters.pnrNumber : "",
      returnPnrNumber: savedFilters?.returnPnrNumber
        ? savedFilters.returnPnrNumber
        : "",
      pnrOrReturnPnr: savedFilters?.pnrOrReturnPnr
        ? savedFilters.pnrNumber
        : "",
      typeOfBooking: savedFilters?.typeOfBooking
        ? savedFilters.typeOfBooking
        : "",
      paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
      orderId: savedFilters?.orderId ? savedFilters.orderId : "",
      transactionId: savedFilters?.transactionId
        ? savedFilters.transactionId
        : "",
      seatLayoutType: savedFilters?.seatLayoutType
        ? savedFilters.seatLayoutType
        : "",
      busType: savedFilters?.busType ? savedFilters.busType : "",
      bookingStatus: savedFilters?.bookingStatus
        ? savedFilters.bookingStatus
        : "",
      departureLocation: savedFilters?.departureLocation
        ? savedFilters.departureLocation
        : "",
      arrivalLocation: savedFilters?.arrivalLocation
        ? savedFilters.arrivalLocation
        : "",
      ticketId: savedFilters?.ticketId ? savedFilters.ticketId : "",
      returnTicketId: savedFilters?.returnTicketId
        ? savedFilters.returnTicketId
        : "",
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
      field: "phoneNumber",
      headerName: "Mobile number",
      maxWidth: 150,
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
      field: "isReturnType",
      headerName: "Travel type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "gender",
      headerName: "Gender",
      // flex: 1,
      maxWidth: 120,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "concessionType",
      headerName: "Concession Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "ticketID",
      headerName: "Ticket ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "returnJourneyTicketID",
      headerName: "Return Journey Ticket ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mid",
      headerName: "MID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "travelDate",
      headerName: "Travel Date",
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
      field: "returnDate",
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
      field: "modeOfPayment",
      headerName: "Payment Mode",
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // valueFormatter: (params) =>
      //   formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "basicFare",
      maxWidth: 150,
      headerName: "Basic Fare",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      headerName: "Total Levies Fee Charges break down Summary",
      headerClass: "text-blue-v2",
      children: [
        {
          field: "passengerFee",
          headerName: "Passenger fee",
          // flex: 1,

          headerClass: "text-blue-v2",

          valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        },
        {
          field: "waterBottle",
          headerName: "Water bottle",
          maxWidth: 130,
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "safetyCess",
          headerName: "Safety cess",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "srt",
          headerName: "SRT",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "totalTollFare",
          headerName: "Total Toll fare",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        },
      ],
    },
    {
      field: "totalLeviesFee",
      headerName: "Total Levies Fee",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "serviceFee",
      headerName: "Service fee",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "serviceTax_GST",
      headerName: "Service Tax",
      // flex: 1,
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "flexiFare",
      headerName: "Flexi Fare",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "eachTicketAmount",
      headerName: "Each Ticket Amount",
      // flex: 1,
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "paymentGatewayTransactionId",
      headerName: "Payment Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "bookingStatus",
      headerName: "Booking  Status",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
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
  ];

  return (
    <div>
      <IntercityIndividualReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <AgGridTable
        ExportName="Intercity Individual Report"
        rowData={IntercityIndividualData}
        columnDefs={columnDefs}
        isFetchLoading={isFetchIntercityIndividualData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={IntercityIndividualData[0]?.totalRecords}
        tableHeight={IntercityIndividualData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </div>
  );
}

export default IntercityIndividualList;
