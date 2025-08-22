import React, { useEffect, useState } from 'react'
import AmarabadAvailabilityInnerForm from './AmarabadAvailabilityInnerForm';  
import { useAmarabadAvailabilityReportsStore } from './store/AmarabadAvailabilityReportsStore';
import { formatToCurrency, formatToStandardDate } from "../../../../utils/TypographyHelper";
import { formatDateTime } from "../../../../utils/Helper"
import AgGridTable from '../../../../components/tables/AgGridTable';
import { getCurrentDate } from '../../../../utils/TypographyHelper';
import { NavLink, useLocation } from 'react-router-dom';
import { useAmrabadBookingStore } from '../amrabad_consolidated/store/amarabadBookingstore';

const AmarabdAvailabilityInnerList = () => {
  const location = useLocation();
  const {bookingDate, fromDate, toDate, packageId, roomId} = location.state || {};
  const {
    amrabadAvailabilityInnerReports,
    isFetchAmarabadAvailabilityInnerReportsLoading,
    fetchAmarabadAvailabilityInnerReports,
    // totalCount,
  } = useAmarabadAvailabilityReportsStore();

  const {
    allAmrabadBookings,
    fetchAllAmrabadBookings,
    totalCount,
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
    fetchAllAmrabadBookings({
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
      field: "userName",
      headerName: "User Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 130,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    
    {
      field: "orderID",
      headerName: "Order ID",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "packageName",
      headerName: "Package Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "houseName",
      headerName: "House Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "noofHousesBooked",
      headerName: "No. of Houses",
      minWidth: 120,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "purchaseDate",
      headerName: "Purchased Date",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ? formatToStandardDate(params.value) : "N/A",
    },
    {
      field: "fromDate",
      headerName: "From Date",
      minWidth: 130,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ? formatToStandardDate(params.value) : "N/A",
    },
    {
      field: "toDate",
      headerName: "To Date",
      minWidth: 130,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ? formatToStandardDate(params.value) : "N/A",
    },
    {
      field: "actualAmount",
      headerName: "Actual Amount",
      minWidth: 140,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => 
        params.value ? formatToCurrency(params.value, "INR", "en-IN") : "₹0.00",
    },
    {
      field: "discountApplicable",
      headerName: "Discount Applicable",
      minWidth: 160,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => 
        params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A",
    },
    {
      field: "amountPaid",
      headerName: "Total Amount",
      minWidth: 140,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => 
        params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A",
    },
    {
      field: "modeofPayment",
      headerName: "Mode of Payment",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "modeofBooking",
      headerName: "Mode of Booking",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "mid",
      headerName: "MID",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 140,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
      
    },

    {
      field: "paymentTransactionID",
      headerName: "Payment Transaction ID",
      minWidth: 140,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "actualPaytmStatus",
      headerName: "Actual Paytm Status",
      minWidth: 160,
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
            // to={`/amrabad-entity-bookings/view-details/${params.data.orderID}`}
            to={`/amrabad-admin/ticket-view-details/${params.data.paymentTransactionID}`}
            // onClick={() => {
            //   setisAmrabadCompleteBookings(true);
            // }}
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
          rowData={allAmrabadBookings || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAllAmrabadBookingsLoading}
          isPagination={false}
          tableHeight={
            (allAmrabadBookings?.length || 0) > 10 ? 560 : 330
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