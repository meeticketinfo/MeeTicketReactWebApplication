import React, { useEffect, useState, useMemo } from "react";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import {
  formatToCurrency,
  formatToStandardDate,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import AmrabadConsolidatedForm from "./AmrabadConsolidatedForm";
import { useAmrabadBookingStore } from "./store/amarabadBookingstore";
function AmrabadConsolidatedList() {
  const {
    fetchAmrabadConsolidatedReports,
    allAmrabadConsolidatedReports,
    setisAmrabadCompleteBookings,
    isAmrabadConsolidatedReportsLoading,
  } = useAmrabadConsolidatedStore();
  const {
    allAmrabadBookings,
    fetchAllAmrabadBookings,
    totalCount,
    isFetchAllAmrabadBookingsLoading,
  } = useAmrabadBookingStore();
  const [currentPage, setCurrentPage] = useState(0);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);

  const getSavedFilters = () => {
    try {
      const savedFilters = localStorage.getItem("amrabad-consolidated-report-filters");
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (error) {
      console.error("Error parsing saved filters:", error);
    }
    return null;
  };
  const savedFilters = getSavedFilters();


  useEffect(() => {
    fetchAllAmrabadBookings({
      startDate: savedFilters?.fromDate || getCurrentDate(),
      endDate: savedFilters?.toDate || getCurrentDate(),
      bookingSource: savedFilters?.typeOfBooking || "Purchase",
      package: savedFilters?.package || "",
      houses: savedFilters?.houses || "",
      orderId: savedFilters?.orderId || "",
      paymentStatus: savedFilters?.paymentStatus || "",
      modeOfBooking: savedFilters?.modeOfBooking || "",
      PageIndex: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const columnDefs = useMemo(() => [
    {
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "userName",
      headerName: "User Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "orderID",
      headerName: "Order ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => (params.value ? params.value : "N/A"),
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    // {
    //   field: "fromDate",
    //   headerName: "From Date",
    //   maxWidth: 170,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => (params.value ? params.value : "N/A"),
    //   // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    // },
    // {
    //   field: "toDate",
    //   headerName: "To Date",
    //   // flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => (params.value ? params.value : "N/A"),
    //   // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    // },
    // -------------------

    {
      field: "packageNames",
      headerName: "Package Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "houseNames",
      headerName: "House Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "roomCount",
      headerName: "No.of Houses Booked",
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "actualAmount",
      headerName: "Actual Amount",
      minWidth: 130,
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "discountApplicable",
      headerName: "Discount Applicable",
      minWidth: 160,
      maxWidth: 160,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    // {
    //   field: "totalAmount",
    //   headerName: "Amount Paid (House Wise)",
    //   // flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) =>
    //     formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    // },
    {
      field: "amountPaid",
      headerName: "Total Amount",
      minWidth: 130,
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "mid",
      headerName: "MID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "modeofBooking",
      headerName: "Mode of Booking",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        // formatToCurrency(params.value, "INR", "en-IN") || "₹0.00",
        params.value ? params.value : "N/A",
    },
    {
      field: "paymentType",
      headerName: "Payment Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "paymentTransactionId",
      headerName: "Payment Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // valueFormatter: (params) =>
      //   formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "actualPaytmStatus",
      headerName: "Actual Paytm Status",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            // to={`/amrabad-entity-bookings/view-details/${params.data.orderID}`}
            to={`/amrabad-admin/ticket-view-details/${params.data.paymentTransactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setisAmrabadCompleteBookings(true);
            }}
            className="bg-gray-100 text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-100 transition"
          >
            <span className="text-blue-v2"> View Ticket</span>
          </NavLink>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ], [currentPage, PAGE_LIMIT]);
  return (
    <>
      <AmrabadConsolidatedForm
        PageIndex={1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
        
      />
      <div>
        <AgGridTable
          key={`amrabad-consolidated-${currentPage}-${PAGE_LIMIT}`}
          ExportName="Booking Report"
          rowData={allAmrabadBookings || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAllAmrabadBookingsLoading}
          isPagination={false}
          // tableHeight={(allAmrabadBookings?.data?.length || 0) > 10 ? 560 : 330}
          tableHeight={
            (allAmrabadBookings?.length || 0) > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={totalCount}
          showTotalCount={true}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
        />
      </div>
    </>
  );
}

export default AmrabadConsolidatedList;
