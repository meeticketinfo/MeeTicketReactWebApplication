import React, { useEffect, useState } from 'react'
import AmarabadAvailabilityInnerForm from './AmarabadAvailabilityInnerForm';  
import { useAmarabadAvailabilityReportsStore } from './store/AmarabadAvailabilityReportsStore';
import { formatToCurrency, formatToStandardDate } from "../../../../utils/TypographyHelper";
import { formatDateTime } from "../../../../utils/Helper"
import AgGridTable from '../../../../components/tables/AgGridTable';
import { getCurrentDate } from '../../../../utils/TypographyHelper';
import { NavLink } from 'react-router-dom';

const AmarabdAvailabilityInnerList = () => {
  const {
    amrabadAvailabilityInnerReports,
    isFetchAmarabadAvailabilityInnerReportsLoading,
    fetchAmarabadAvailabilityInnerReports,
    totalCount,
  } = useAmarabadAvailabilityReportsStore();

  const [currentPage, setCurrentPage] = useState(0);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);

  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-availability-inner-report-filters")
  );

  useEffect(() => {
    fetchAmarabadAvailabilityInnerReports({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      bookingSource: savedFilters?.typeOfBooking || "",
      mobileNumber: savedFilters?.phoneNumber || "",
      PaymentMode: savedFilters?.PaymentMode || "",
      package: savedFilters?.package || "",
      houses: savedFilters?.houses || "",
      orderId: savedFilters?.orderId || "",
      paymentStatus: savedFilters?.paymentStatus || "",
      modeOfBooking: savedFilters?.modeOfBooking || "",
      PageIndex: currentPage + 1, 
      pageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

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
      field: "orderId",
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
      field: "noofHouses",
      headerName: "No. of Houses",
      minWidth: 120,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "purchasedDate",
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
      field: "totalAmount",
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
      field: "transactionID",
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
            to={`/amrabad-admin/ticket-view-details/${params.data.transactionID}`}
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
      />
      <div>
        <AgGridTable
          ExportName="Availability Inner Report"
          rowData={amrabadAvailabilityInnerReports || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAmarabadAvailabilityInnerReportsLoading}
          isPagination={false}
          tableHeight={
            (amrabadAvailabilityInnerReports?.length || 0) > 10 ? 560 : 330
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