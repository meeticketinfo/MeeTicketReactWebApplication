import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable from "../../../../tables/AgGridTable";
import {
  formatToCurrency,
  formatToStandardDate,
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import CurrentConsolidatedReportForm from "./CurrentConsolidatedReportForm";
import { useCurrentConsolidateStore } from "./CurrentConsolidateStore";
import { filterRecordsByIntercityBus } from "../shared/CurrentBookingReportFilterFields";
function CurrentConsolidatedList() {
  const savedFilters = JSON.parse(
    localStorage.getItem("current-consolidated-filters")
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
    fetchCurrentConsolidateData,
    CurrentConsolidateData,
    isFetchCurrentConsolidateData,
  } = useCurrentConsolidateStore();
  useEffect(() => {
    fetchCurrentConsolidateData({
      purchaseOrBooking: savedFilters?.purchaseOrBooking ?? "Purchase",
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

  const filteredConsolidateData = useMemo(
    () => filterRecordsByIntercityBus(CurrentConsolidateData, intercityBusFilter),
    [CurrentConsolidateData, intercityBusFilter]
  );

  const handleIntercityBusChange = (value) => {
    setIntercityBusFilter(value || "");
    setCurrentPage(0);
  };

  const columnDefs = [
    {
      field: "sno",
      headerName: "S.No",
      maxWidth: 70,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        // Empty for total row
        if (params.node?.rowPinned === "bottom") return "";

        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
    },
    {
      field: "pnrNumber",
      headerName: "PNR NUMBER",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "Total";
        return params.value || "N/A";
      }
    },
    {
      field: "returnPNRNumber",
      headerName: "RETURN PNR NO",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    // ------------------

    {
      field: "departureLocation",
      headerName: "DEPARTURE LOCATION",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "arrivalLocation",
      headerName: "ARRIVAL LOCATION",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "mobileNumber",
      headerName: "MOBILE NUMBER",
      maxWidth: 140,
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "busType",
      headerName: "BUS TYPE",
      maxWidth: 170,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "seatLayoutType",
      headerName: "SEAT LAYOUT TYPE",
      // flex: 1,
      headerClass: "text-blue-v2  ",

      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value ? String(params.value).toUpperCase() : "N/A";
      }
    },
    // -------------------

    {
      field: "travelType",
      headerName: "TRAVEL TYPE",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node?.rowPinned === "bottom") return "";

        if (!params.value || String(params.value).trim() === "") {
          return "N/A";
        }

        return String(params.value).toUpperCase();
      }
    },
    {
      field: "mid",
      headerName: "MID",
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },

    {
      field: "bookingDate",
      headerName: "PURCHASE DATE",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },

    {
      field: "totalAmount",
      headerName: "TOTAL AMOUNT",
      minWidth: 130,
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom")
          return params.value ? `₹ ${params.value}` : "";
        return params.value ? `₹ ${params.value}` : "N/A";
      }
    },
    {
      field: "settled_Date",
      headerName: "SETTLED DATE",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        // Empty for total row
        if (params.node?.rowPinned === "bottom") return "";

        // Show N/A for normal rows if empty
        if (!params.value) return "N/A";

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: "settledamount",
      headerName: "SETTLED AMOUNT",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom")
          return params.value ? `₹ ${params.value}` : "";
        return params.value ? `₹ ${params.value}` : "N/A";
      }
    },



    {
      field: "utr",
      headerName: "UTR",
      // minWidth: 130,
      maxWidth: 140,
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }

    },



    {
      field: "purchaseDate",
      headerName: "TRAVEL DATE",
      maxWidth: 180,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        // Empty for total row
        if (params.node?.rowPinned === "bottom") return "";

        // N/A for normal rows
        if (!params.value) return "N/A";

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      },
    },
    {
      field: "returnJourneyTravelDate",
      headerName: "RETURN JOURNEY TRAVEL DATE",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        // Empty for total row
        if (params.node?.rowPinned === "bottom") return "";

        // N/A for normal rows
        if (!params.value) return "N/A";

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      },
    },
    {
      field: "ticketQuantity",
      headerName: "TICKET QUANTITY",
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "orderId",
      headerName: "ORDER ID",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "paymentMode",
      headerName: "PAYMENT MODE",
      // flex: 1,
      maxWidth: 130,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "basicFare",
      headerName: "BASIC FARE",
      // flex: 1,
      maxWidth: 100,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "totalLeviesFee",
      headerName: "TOTAL LEVIES FEE",
      // flex: 1,
      maxWidth: 150,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "serviceTaxGST",
      headerName: "SERVICE TAX (GST)",
      // flex: 1,
      maxWidth: 150,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },
    {
      field: "flexiFare",
      headerName: "FLEXI FARE",
      // flex: 1,
      maxWidth: 100,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
    },


    {
      field: "paymentTransactionId",
      headerName: "PAYMENT TRANSACTION ID",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "bookingStatus",
      headerName: "BOOKING STATUS",
      // flex: 1,
      headerClass: "text-blue-v2  ",

      valueFormatter: (params) => {
        if (params?.node?.rowPinned === "bottom") return "";
        return params?.value ? String(params.value).toUpperCase() : "N/A";
      }
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
                className="bg-blue-v2 text-white text-xs px-4 py-2 rounded-md font-semibold transition uppercase text-blue-v2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Onwards Journey
              </NavLink>
            ) : (
              <span
                className="bg-blue-v2 text-white text-xs px-4 py-2 rounded-md font-semibold opacity-50 uppercase cursor-not-allowed text-blue-v2"
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
      headerClass: "text-blue-v2  ",
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
                className="bg-blue-v2 text-white text-xs px-4 py-2 rounded-md font-semibold transition text-blue-v2 uppercase"
                target="_blank"
                rel="noopener noreferrer"
              >
                Return Journey
              </NavLink>
            ) : (
              <span
                className="bg-blue-v2 text-white text-xs px-4 py-2 rounded-md font-semibold opacity-50 cursor-not-allowed uppercase text-blue-v2"
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
      headerClass: "text-blue-v2  ",
    },
    {
      field: "refundDate",
      headerName: "REFUND DATE",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "refundId",
      headerName: "REFUND ID",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "refundStatus",
      headerName: "REFUND STATUS",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "paytmSettledUTR",
      headerName: "PAYTM SETTLED UTR",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
    {
      field: "utrProcessedTime",
      headerName: "UTR PROCESSED TIME",
      // flex: 1,
      headerClass: "text-blue-v2  ",
      valueFormatter: (params) => {
        if (params.node.rowPinned === "bottom") return "";
        return params.value || "N/A";
      }
    },
  ];

  const getTotalRow = () => {
    if (!filteredConsolidateData?.length) return [];

    const totals = filteredConsolidateData.reduce(
      (acc, row) => {
        acc.totalAmount += Number(row.totalAmount || 0);
        acc.settledamount += Number(row.settledamount || 0);
        acc.basicFare += Number(row.basicFare || 0);
        acc.totalLeviesFee += Number(row.totalLeviesFee || 0);
        acc.serviceTaxGST += Number(row.serviceTaxGST || 0);
        acc.flexiFare += Number(row.flexiFare || 0);
        acc.ticketQuantity += Number(row.ticketQuantity || 0);
        return acc;
      },
      {
        pnrNumber: "TOTAL",
        totalAmount: 0,
        settledamount: 0,
        basicFare: 0,
        totalLeviesFee: 0,
        serviceTaxGST: 0,
        flexiFare: 0,
        ticketQuantity: 0,
      }
    );

    return [totals];
  };

  return (
    <div>
      <CurrentConsolidatedReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
        onIntercityBusChange={handleIntercityBusChange}
      />
      <div>
        {filteredConsolidateData?.length > 0 && (
          <div className="     flex justify-end gap-10 font-semibold">
            <span className=" bg-gray-100 px-2 border rounded-lg">
              Grand Total Amount: ₹{filteredConsolidateData.reduce(
                (sum, row) => sum + Number(row.totalAmount || row.amount || 0),
                0
              )}
            </span>
          </div>
        )}
      </div>
      <AgGridTable
        ExportName="Current Consolidated Report"
        rowData={filteredConsolidateData}
        columnDefs={columnDefs}
        pinnedBottomRowData={getTotalRow()}
        isFetchLoading={isFetchCurrentConsolidateData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={filteredConsolidateData.length}
        tableHeight={filteredConsolidateData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />

      {/* {CurrentConsolidateData?.length > 0 && (
        <div className="mt-3 p-3 bg-gray-100 rounded-xl border flex justify-end gap-10 font-semibold">
          <div>
            Total Amount: ₹{totals.totalAmount.toLocaleString("en-IN")}
          </div>
          <div>
            Settled Amount: ₹{totals.settledAmount.toLocaleString("en-IN")}
          </div>
          <div>
            Tickets: {totals.ticketQuantity}
          </div>
        </div>
      )} */}
    </div>
  );
}

export default CurrentConsolidatedList;
