import React, { useEffect, useMemo, useState } from "react";

import { NavLink } from "react-router-dom";

import AgGridTable from "../../../../tables/AgGridTable";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import CurrentIndividualReportForm from "./CurrentIndividualReportForm";
import { useCurrentIndividualStore } from "./CurrentIndividualStore";
import { filterRecordsByIntercityBus } from "../shared/CurrentBookingReportFilterFields";
function CurrentIndividualList() {
  const savedFilters = JSON.parse(
    localStorage.getItem("current-individual-filters")
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [intercityBusFilter, setIntercityBusFilter] = useState(
    savedFilters?.intercityBus || ""
  );
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const {
    fetchCurrentIndividualData,
    CurrentIndividualData,
    isFetchCurrentIndividualData,
  } = useCurrentIndividualStore();
  useEffect(() => {
    fetchCurrentIndividualData({
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

  const filteredIndividualData = useMemo(
    () => filterRecordsByIntercityBus(CurrentIndividualData, intercityBusFilter),
    [CurrentIndividualData, intercityBusFilter]
  );

  const handleIntercityBusChange = (value) => {
    setIntercityBusFilter(value || "");
    setCurrentPage(0);
  };

  const isTotalRow = (params) => params.node?.rowPinned === "bottom";

  const textFormatter = (params) => {
    if (isTotalRow(params)) return "";
    return params.value || "N/A";
  };

  const CustomtextFormatter = (params) => {
    if (isTotalRow(params)) return "";
    return params.value ? String(params.value).toUpperCase() : "N/A";
  };

  const dateFormatter = (params) => {
    if (isTotalRow(params)) return "";
    if (!params.value) return "N/A";

    const d = new Date(params.value);

    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const currencyFormatter = (params) => {
    if (isTotalRow(params))
      return params.value ? `₹ ${params.value}` : "";

    return params.value ? `₹ ${params.value}` : "N/A";
  };

  const ticketQtyFormatter = (params) => {
    if (isTotalRow(params)) return params.value || "";
    return params.value || "0";
  };


  const getTotalRow = () => {
    if (!filteredIndividualData?.length) return [];

    const totals = filteredIndividualData.reduce(
      (acc, row) => {

        acc.basicFare += Number(row.basicFare || 0);
        acc.passengerFee += Number(row.passengerFee || 0);
        acc.totalTollFare += Number(row.totalTollFare || 0);
        acc.totalLeviesFee += Number(row.totalLeviesFee || 0);
        acc.serviceFee += Number(row.serviceFee || 0);
        acc.serviceTax_GST += Number(row.serviceTax_GST || 0);
        acc.flexiFare += Number(row.flexiFare || 0);
        acc.eachTicketAmount += Number(row.eachTicketAmount || 0);
        acc.totalAmount += Number(row.totalAmount || 0);
        acc.ticketQuantity += Number(row.ticketQuantity || 0);

        return acc;

      },
      {
        pnrNumber: "TOTAL",

        basicFare: 0,
        passengerFee: 0,
        totalTollFare: 0,
        totalLeviesFee: 0,
        serviceFee: 0,
        serviceTax_GST: 0,
        flexiFare: 0,
        eachTicketAmount: 0,
        totalAmount: 0,
        ticketQuantity: 0,
      }
    );

    return [totals];
  };

  const columnDefs = [

    {
      field: "sno",
      headerName: "S.No",
      maxWidth: 70,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {

        if (isTotalRow(params)) return "";

        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      }
    },

    {
      field: "pnrNumber",
      headerName: "PNR Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "TOTAL";
        return params.value || "N/A";
      }
    },

    {
      field: "returnPNRNumber",
      headerName: "Return PNR No",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "departureLocation",
      headerName: "Departure Location",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "arrivalLocation",
      headerName: "Arrival Location",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "phoneNumber",
      headerName: "Mobile number",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "busType",
      headerName: "Bus Type",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "seatLayoutType",
      headerName: "Seat Layout Type",
      headerClass: "text-blue-v2",
      valueFormatter: CustomtextFormatter
    },

    {
      field: "isReturnType",
      headerName: "Travel type",
      headerClass: "text-blue-v2",
      valueFormatter: CustomtextFormatter
    },

    {
      field: "gender",
      headerName: "Gender",
      maxWidth: 120,
      headerClass: "text-blue-v2",
      valueFormatter: CustomtextFormatter
    },

    {
      field: "concessionType",
      headerName: "Concession Type",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "ticketID",
      headerName: "Ticket ID",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "returnJourneyTicketID",
      headerName: "Return Journey Ticket ID",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "mid",
      headerName: "MID",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      headerClass: "text-blue-v2",
      valueFormatter: dateFormatter
    },

    {
      field: "travelDate",
      headerName: "Travel Date",
      headerClass: "text-blue-v2",
      valueFormatter: dateFormatter
    },

    {
      field: "returnDate",
      headerName: "Return Journey Travel Date",
      headerClass: "text-blue-v2",
      valueFormatter: dateFormatter
    },

    {
      field: "ticketQuantity",
      headerName: "Ticket Quantity",
      maxWidth: 130,
      headerClass: "text-blue-v2",
      valueFormatter: ticketQtyFormatter
    },

    {
      field: "orderId",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "modeOfPayment",
      headerName: "Payment Mode",
      maxWidth: 130,
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "basicFare",
      headerName: "Basic Fare",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: currencyFormatter
    },

    {
      headerName: "Total Levies Fee Charges break down Summary",
      headerClass: "text-blue-v2",

      children: [

        {
          field: "passengerFee",
          headerName: "Passenger fee",
          headerClass: "text-blue-v2",
          valueFormatter: currencyFormatter
        },

        {
          field: "waterBottle",
          headerName: "Water bottle",
          headerClass: "text-blue-v2",
          valueFormatter: textFormatter
        },

        {
          field: "safetyCess",
          headerName: "Safety cess",
          headerClass: "text-blue-v2",
          valueFormatter: textFormatter
        },

        {
          field: "srt",
          headerName: "SRT",
          headerClass: "text-blue-v2",
          valueFormatter: textFormatter
        },

        {
          field: "totalTollFare",
          headerName: "Total Toll fare",
          headerClass: "text-blue-v2",
          valueFormatter: currencyFormatter
        }

      ]
    },

    {
      field: "totalLeviesFee",
      headerName: "Total Levies Fee",
      headerClass: "text-blue-v2",
      valueFormatter: currencyFormatter
    },

    {
      field: "serviceFee",
      headerName: "Service fee",
      headerClass: "text-blue-v2",
      valueFormatter: currencyFormatter
    },

    {
      field: "serviceTax_GST",
      headerName: "Service Tax",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: currencyFormatter
    },

    {
      field: "flexiFare",
      headerName: "Flexi Fare",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: currencyFormatter
    },

    {
      field: "eachTicketAmount",
      headerName: "Each Ticket Amount",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: currencyFormatter
    },

    {
      field: "totalAmount",
      headerName: "Total Amount",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: currencyFormatter
    },

    {
      field: "paymentGatewayTransactionId",
      headerName: "Payment Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: textFormatter
    },

    {
      field: "bookingStatus",
      headerName: "Booking Status",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: CustomtextFormatter
    },

    {
      headerName: "Ticket",
      field: "action",
      cellRenderer: (params) => {
        if (params.node?.rowPinned === "bottom") return "";
        const pnr =
          params.data?.BookingID && params.data?.BookingID !== "N/A"
            ? params.data.BookingID
            : params.data?.bookingID && params.data?.bookingID !== "N/A"
              ? params.data.bookingID
              : null;

        return (
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            {pnr ? (
              <NavLink
                end
                to={`/current-ticket-view-details/${pnr}`}
                className="bg-blue-v2 text-xs text-white px-4 py-2 rounded-md font-semibold transition uppercase"
                target="_blank"
                rel="noopener noreferrer"
              >
                Onwards Journey
              </NavLink>
            ) : (
              <span
                className="bg-blue-v2 text-xs text-white px-4 py-2 rounded-md font-semibold opacity-50 cursor-not-allowed uppercase"
                aria-disabled="true"
                tabIndex={-1}
              >
                Onwards Journey
              </span>
            )}
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      headerName: "Ticket",
      field: "action",
      cellRenderer: (params) => {
        if (params.node?.rowPinned === "bottom") return "";
        const returnPnr =
          params.data?.returnPNRNumber &&
            params.data?.returnPNRNumber !== "N/A"
            ? params.data.returnPNRNumber
            : null;

        return (
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            {returnPnr ? (
              <NavLink
                end
                to={`/current-ticket-view-details/${returnPnr}`}
                className="bg-blue-v2 text-xs text-white px-4 py-2 rounded-md font-semibold transition uppercase"
                target="_blank"
                rel="noopener noreferrer"
              >
                Return Journey
              </NavLink>
            ) : (
              <span
                className="bg-blue-v2 text-xs text-white px-4 py-2 rounded-md font-semibold opacity-50 cursor-not-allowed uppercase"
                aria-disabled="true"
                tabIndex={-1}
              >
                Return Journey
              </span>
            )}
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
    },

  ];

  const updatedColumnDefs = columnDefs.map((col) => {
    if (col.headerName) {
      return {
        ...col,
        headerName: col.headerName.toUpperCase(),
        children: col.children
          ? col.children.map((child) => ({
            ...child,
            headerName: child.headerName?.toUpperCase(),
          }))
          : undefined,
      };
    }
    return col;
  });






  return (
    <div>
      <CurrentIndividualReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
        onIntercityBusChange={handleIntercityBusChange}
      />
      <div>
        {filteredIndividualData?.length > 0 && (
          <div className="     flex justify-end gap-10 font-semibold">
            <span className=" bg-gray-100 px-2 border rounded-lg">
              Grand Total Amount: ₹{filteredIndividualData.reduce(
                (sum, row) => sum + Number(row.totalAmount || row.amount || 0),
                0
              )}
            </span>
          </div>
        )}
      </div>
      <AgGridTable
        ExportName="Current Individual Report"
        rowData={filteredIndividualData}
        columnDefs={updatedColumnDefs}
        pinnedBottomRowData={getTotalRow()}
        isFetchLoading={isFetchCurrentIndividualData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={filteredIndividualData.length}
        tableHeight={filteredIndividualData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
    </div>
  );
}

export default CurrentIndividualList;
