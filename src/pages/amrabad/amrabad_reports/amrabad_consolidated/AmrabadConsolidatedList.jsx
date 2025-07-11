import React, { useEffect, useState } from "react";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import AmrabadConsolidatedForm from "./AmrabadConsolidatedForm";
function AmrabadConsolidatedList() {
  const {
    fetchAmrabadConsolidatedReports,
    allAmrabadConsolidatedReports,
    setisAmrabadCompleteBookings,
    isAmrabadConsolidatedReportsLoading,
  } = useAmrabadConsolidatedStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-consolidated-report-filters")
  );
  console.log("savedFilters",savedFilters)
  const [currentPage, setCurrentPage] = useState(0);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);

  useEffect(() => {
     fetchAmrabadConsolidatedReports({
      startDate: (savedFilters?.fromDate)?? getCurrentDate(),
      endDate: (savedFilters?.toDate) ?? getCurrentDate(),
      bookingSource: savedFilters?.typeOfBooking
        ? savedFilters.typeOfBooking
        : "",
      mobileNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
      PaymentMode: savedFilters?.PaymentMode ? savedFilters.PaymentMode : "",
      PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "bookingID",
      headerName: "Booking ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "parkName",
      headerName: "Park Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "departmentName",
      headerName: "Department",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "entityTypeName",
      headerName: "Location category",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "noofDays",
      headerName: "Total No Of Tickets",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mid",
      headerName: "MID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // -------------------

    {
      field: "mobileNo",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
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
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },

    {
      field: "bookingDate",
      headerName: "Booking Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "bookingType",
      headerName: "Booking Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "bookedBy",
      headerName: "Booked By",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "paymentTransactionID",
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
      valueFormatter: (params) => (params.value ? "Success" : "Failed"),
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
              setisAmrabadCompleteBookings(true);
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
    <>
      <AmrabadConsolidatedForm
        PageIndex={1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <div>
        <AgGridTable
          ExportName="Completed Bookings Details"
          rowData={allAmrabadConsolidatedReports || []}
          columnDefs={columnDefs}
          isFetchLoading={isAmrabadConsolidatedReportsLoading}
          isPagination={false}
          tableHeight={
            allAmrabadConsolidatedReports?.data?.length > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={allAmrabadConsolidatedReports[0]?.totalCount}
          showTotalCount={true}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
          // onPageChange={handlePageChange}
          // totalRecords={totalEntityBookingRecords}
          // enableAdvancedFilter={true}
        />
      </div>
    </>
  );
}

export default AmrabadConsolidatedList;
