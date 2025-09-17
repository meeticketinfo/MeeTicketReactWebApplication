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
      fromDate: savedFilters?.fromDate
        ? savedFilters.fromDate
        : getCurrentDate(),
      toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
      mobileNumber: savedFilters?.mobileNumber ? savedFilters.mobileNumber : "",
      bookingDate: savedFilters?.bookingDate ? savedFilters.bookingDate : "",
      pnrOrReturnPnr: savedFilters?.pnrOrReturnPnr
        ? savedFilters.pnrOrReturnPnr
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
    });
    console.log("savedFilters", savedFilters);
  }, [fetchIntercityIndividualData]);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "paymentTransactionId",
      headerName: "PNR Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "referencE_ID",
      headerName: "Return PNR No",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "parkName",
      headerName: "Departure Location",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "departmentName",
      headerName: "Arrival Location",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "entityTypeName",
      headerName: "Mobile number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "totalTicketsBooked",
      headerName: " Bus Type",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mid",
      headerName: "Seat Layout Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // -------------------

    {
      field: "mobileNumber",
      headerName: "Travel type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "gender",
      headerName: "Gender",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "gender",
      headerName: "Concession Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "gender",
      headerName: "Ticket ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "gender",
      headerName: "Return Journey Ticket ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "purchaseDate",
      headerName: "MID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "bookinG_DATE",
      headerName: "Purchase Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "bookingSource",
      headerName: "Travel Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "createD_BY",
      headerName: "Return Journey Travel Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "totaL_AMOUNT",
      headerName: "Ticket Quantity",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "paymentType",
      headerName: "Order ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "status",
      headerName: "Payment Mode",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // valueFormatter: (params) =>
      //   formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "resultStatus",
      headerName: "Basic Fare",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "Total Levies Fee Charges break down Summary",
      headerClass: "text-blue-v2",
      children: [
        {
          field: "resultStatus",
          headerName: "Passenger fee",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "resultStatus",
          headerName: "Water bottle",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "resultStatus",
          headerName: "Safety cess",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "resultStatus",
          headerName: "SRT",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
        {
          field: "resultStatus",
          headerName: "Total Toll fare",
          // flex: 1,
          headerClass: "text-blue-v2",
          valueFormatter: (params) => params.value || "N/A",
        },
      ],
    },
    {
      field: "resultStatus",
      headerName: "Total Levies Fee",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Service fee",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Service Tax",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Flexi Fare",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Each Ticket Amount",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Total Amount",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Payment Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Booking  Status",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            to={`/intercity-admin/ticket-view-details/${params.data.paymentTransactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-100 transition"
          >
            <span className="text-blue-v2"> View Ticket</span>
          </NavLink>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);

  return (
    <div>
      <IntercityIndividualReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
       <AgGridTable
            ExportName="Intercity Individual Report"
            // rowData={RtcTotalTransactionsData}
            columnDefs={columnDefs}
            // isFetchLoading={isFetchIntercityIndividualData}
            // isPagination={false}
            // IsReactPaginate={true}
            // setPageLimit={setPAGE_LIMIT}
            // pageLimit={PAGE_LIMIT}
            // handlePageClick={handlePageClick}
            // currentPage={currentPage}
            // showTotalCount={true}
            // totalCount={RtcTotalTransactionsData[0]?.totalCount}
            // tableHeight={RtcTotalTransactionsData.length > 10 ? 550 : 300}
            // SetcurrentPage={setCurrentPage}
          />
    </div>
  );
}

export default IntercityIndividualList;
