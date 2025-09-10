import React, { useEffect, useMemo, useState } from 'react'
import AmarabadAvailabilityInnerForm from './AmarabadAvailabilityInnerForm';  
import { useAmarabadAvailabilityReportsStore } from './store/AmarabadAvailabilityReportsStore';
import { formatToCurrency, formatToStandardDate } from "../../../../utils/TypographyHelper";
import { formatDateTime } from "../../../../utils/Helper"
import AgGridTable from '../../../../components/tables/AgGridTable';
import { getCurrentDate } from '../../../../utils/TypographyHelper';
import { NavLink, useLocation } from 'react-router-dom';
import { useAmrabadBookingStore } from '../amrabad_consolidated/store/amarabadBookingstore';
import { useAmrabadHouseWiseReportStore } from '../amrabad_individual/store/amarabadHouseWiseReportStore';

const AmarabdAvailabilityInnerList = () => {
  const location = useLocation();
  const {bookingDate, fromDate, toDate, packageId, roomId} = location.state || {};
  const {
    amrabadAvailabilityInnerReports,
    isFetchAmarabadAvailabilityInnerReportsLoading,
    fetchAmarabadAvailabilityInnerReports,
    // totalCount,
  } = useAmarabadAvailabilityReportsStore();

  const { allAmrabadHouseWiseReports, fetchAllAmrabadHouseWiseReports, isFetchAllAmrabadHouseWiseReportsLoading, totalCount } = useAmrabadHouseWiseReportStore();

  const {
    allAmrabadBookings,
    fetchAllAmrabadBookings,
    // totalCount,
    isFetchAllAmrabadBookingsLoading,
  } = useAmrabadBookingStore();

  const [currentPage, setCurrentPage] = useState(0);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);

  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-availability-inner-report-filters")
  );

// Helper function to remove time from date string
  const removeTimeFromDate = (dateString) => {
    if (!dateString) return dateString;
    // If date contains 'T' (timestamp), extract only the date part
    return dateString.split('T')[0];
  };

  // Helper function to get next day date
  const getNextDayDate = (dateString) => {
    if (!dateString) return dateString;
    const date = new Date(dateString);
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };
  useEffect(() => {
    fetchAllAmrabadHouseWiseReports({
      startDate: removeTimeFromDate(bookingDate) || (savedFilters?.fromDate ?? getCurrentDate()),
      endDate: getNextDayDate(bookingDate) || (savedFilters?.toDate ?? getCurrentDate()),
      bookingSource: "Booking",
      mobileNumber: savedFilters?.phoneNumber || "",
      PaymentMode: savedFilters?.PaymentMode || "",
      package: packageId || savedFilters?.package || "",
      houses: roomId || savedFilters?.houses || "",
      orderId: savedFilters?.orderId || "",
      paymentStatus: savedFilters?.paymentStatus || "",
      modeOfBooking: savedFilters?.modeOfBooking || "",
      PageIndex: currentPage + 1, 
      pageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT, fromDate, toDate, packageId, roomId]);

 const columnDefs = useMemo(() => [
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) => {
        // Calculate serial number based on current page and row position
        const serialNumber = currentPage * PAGE_LIMIT + params.node.rowIndex + 1;
        return serialNumber;
      },
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionID",
      headerName: "Transaction Id",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      minWidth: 150,
      maxWidth: 150,
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "userName",
      headerName: "User Name",
      // flex: 1,
      minWidth: 150,
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "packageName",
      headerName: "Package Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "houseName",
      headerName: "House Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "noofHouses",
      headerName: "No.of houses", 
      minWidth: 120,
      maxWidth: 120,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "purchasedDate",
      headerName: "Purchased Date",
      minWidth: 150,
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "0",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "fromDate",
      headerName: "From Date",
      minWidth: 120,
      maxWidth: 120,
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "0",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    
    {
      field: "toDate",
      headerName: "To Date",
      minWidth: 120,
      maxWidth: 120,
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "0",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
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
    {
      field: "housePaidAmount",
      headerName: "Amount Paid (House Wise)",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 130,
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "modeofPayment",
      headerName: "Mode of Payment",
      minWidth: 150,
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "modeofBooking",
      headerName: "Mode of Booking",
      minWidth: 150,
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "orderId",
      headerName: "Order ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "200px" }}>
            <NavLink
              end
              to={`/amrabad-admin/ticket-view-details/${params.data.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 text-blue-v2 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm"
            >
              <span>View Ticket</span>
            </NavLink>
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
      width: 200,
    },
  ], [currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (  
    <div>
        <AmarabadAvailabilityInnerForm
          PageIndex={1}
          pageSize={PAGE_LIMIT}
          SetcurrentPage={setCurrentPage}
          fromDate={fromDate}
          toDate={toDate}
          packageId={packageId}
          roomId={roomId}
          bookingDate={bookingDate}
        />
      <div>
        <AgGridTable
          ExportName="Availability Inner Report"
          rowData={allAmrabadHouseWiseReports || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAllAmrabadHouseWiseReportsLoading}
          isPagination={false}
          tableHeight={
            (allAmrabadHouseWiseReports?.length || 0) > 10 ? 560 : 330
          }
          // tableHeight={amrabadAvailabilityInnerReports?.data?.length > 10 ? 560 : 330}
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          SetcurrentPage={setCurrentPage}
          totalCount={totalCount || 0}
          showTotalCount={true}
          showSearch={false}
        />
      </div>
    </div>
  )
}

export default AmarabdAvailabilityInnerList