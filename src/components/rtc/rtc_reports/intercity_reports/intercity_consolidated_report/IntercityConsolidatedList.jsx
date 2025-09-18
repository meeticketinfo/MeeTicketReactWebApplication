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
      purchaseOrBooking:savedFilters?.purchaseOrBooking
        ? savedFilters.purchaseOrBooking
        : "",
      fromDate: savedFilters?.fromDate
        ? savedFilters.fromDate
        : getCurrentDate(),
      toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
      mobileNumber: savedFilters?.mobileNumber
        ? savedFilters.mobileNumber
        : "",
      bookingDate: savedFilters?.bookingDate ? savedFilters.bookingDate : "",
      PNRNumber: savedFilters?.PNRNumber
        ? savedFilters.PNRNumber
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
      typeOfBus: savedFilters?.typeOfBus ? savedFilters.typeOfBus : "",
      bookingStatus: savedFilters?.bookingStatus
        ? savedFilters.bookingStatus
        : "",
      departureLocation: savedFilters?.departureLocation
        ? savedFilters.departureLocation
        : "",
      arrivalLocation: savedFilters?.arrivalLocation
        ? savedFilters.arrivalLocation
        : "",
    });

  }, []);

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
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
      field: "mid",
      headerName: "Seat Layout Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // -------------------

    {
      field: "travelType",
      headerName: "Travel type",
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
      field: "purchaseDate",
      headerName: "Purchase Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "purchaseDate",
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
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            to={`/entity-bookings/view-details/${params.data.bookingID}`}
            onClick={() => {
              setisCompleteBookings(true);
            }}
            className="bg-gray-100 text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-100 transition"
          >
            <span className="text-blue-v2"> Booking Details</span>
          </NavLink>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
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
      />
    </div>
  );
}

export default IntercityConsolidatedList;
