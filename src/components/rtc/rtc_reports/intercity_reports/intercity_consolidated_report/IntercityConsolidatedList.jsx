import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable from "../../../../tables/AgGridTable";
import {
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
      purchaseOrBooking: savedFilters?.purchaseOrBooking
        ? savedFilters.purchaseOrBooking
        : "",
      fromDate: savedFilters?.fromDate
        ? savedFilters.fromDate
        : getCurrentDate(),
      toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
      mobileNumber: savedFilters?.mobileNumber ? savedFilters.mobileNumber : "",
      bookingDate: savedFilters?.bookingDate ? savedFilters.bookingDate : "",
      PNRNumber: savedFilters?.PNRNumber ? savedFilters.PNRNumber : "",
      typeOfBooking: savedFilters?.typeOfBooking
        ? savedFilters.typeOfBooking
        : "",
      paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
      orderId: savedFilters?.orderId ? savedFilters.orderId : "",
      transactionId: savedFilters?.transactionId
        ? savedFilters.transactionId
        : "",

      typeOfBus: savedFilters?.typeOfBus ? savedFilters.typeOfBus : "",
      seatLayoutType: savedFilters?.seatLayoutType
        ? savedFilters.seatLayoutType
        : "",
      bookingStatus: savedFilters?.bookingStatus
        ? savedFilters.bookingStatus
        : "",
      departureLocation: savedFilters?.departureLocation
        ? savedFilters.departureLocation
        : "",
      arrivalLocation: savedFilters?.arrivalLocation
        ? savedFilters.arrivalLocation
        : "",
      pageNumber: currentPage,
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
    {
      field: "purchaseDate",
      headerName: "Travel Date",
      maxWidth: 170,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "returnJourneyTravelDate",
      headerName: "Return Journey Travel Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
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
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "Ticket",
      field: "Ticket",
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
      field: "Ticket",
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
