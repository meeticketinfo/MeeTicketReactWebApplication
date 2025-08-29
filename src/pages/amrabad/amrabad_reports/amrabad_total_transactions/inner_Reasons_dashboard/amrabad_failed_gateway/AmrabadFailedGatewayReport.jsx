import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAmarabadTotalTransactionStore } from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalTransactionStore";
import AmarabadTotalCommonStore from "../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import AgGridTable from "../../../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../../../layouts/AdminLayout";
import { formatDateTime } from "../../../../../../utils/Helper";
import { formatToCurrency } from "../../../../../../utils/TypographyHelper";
import Breadcrumb from "../../../../../../components/Breadcrumb";
import AmrabadFailedGateWayReportForm from "./AmrabadFailedGateWayReportForm";

const AmrabadFailedGatewayReport = ( ) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const packageName = searchParams.get("package");
    const house = searchParams.get("house");
    const mobileNumber = searchParams.get("mobileNumber");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const subCategory = searchParams.get("subCategory");
   const {
    innerFilters,
    outerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
    resetInnerFilters,
  } = AmarabadTotalCommonStore();
  const {
    fetchAmrabadTotalTransactions,
    AmrabadTotalTransactionsData,
    isAmrabadTotalTransactionsLoading,
  } = useAmarabadTotalTransactionStore();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  console.log("outerFilters", innerFilters);
  useEffect(() => {
    fetchAmrabadTotalTransactions({
      startDate: fromDate ?? deepInnerFilters.startDate ?? innerFilters.fromDate ?? "",
      endDate: toDate ?? deepInnerFilters.endDate ?? innerFilters.toDate ?? "",
      phoneNumber:
        mobileNumber ?? deepInnerFilters.mobileNumber ?? innerFilters.mobileNumber ?? "",
      PaymentMode: deepInnerFilters.mobileNumber ?? "",
      status: innerFilters.status ?? "",
      subCategory: subCategory ?? innerFilters.subCategory ?? "",
        package: packageName ?? innerFilters.package ?? outerFilters.package ?? "",
      house: house ?? innerFilters.house ?? outerFilters.house ?? "",
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
    
  }, [PAGE_LIMIT, currentPage]);
  const columnDefs = [
      {
        headerName: "S.No",
        valueGetter: (params) => {
          const pageOffset = currentPage * PAGE_LIMIT;
          return pageOffset + params.node.rowIndex + 1;
        },
        maxWidth: "80",
        headerClass: "text-blue-v2",
      },
      {
        field: "createdDate",
        maxWidth: "200",
        headerName: "Date and Time of Transaction",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          if (!params.value) return "N/A";
          return formatDateTime(params.value);
        },
      },
      {
        field: "action",
        maxWidth: "180",
        headerName: "Action",
        headerClass: "text-blue-v2",
        cellRenderer: (params) => (
          <Link
            className="bg-blue-v2 text-white py-1.5 px-2.5 leading-none rounded-lg text-sm"
            to={"/amrabad-gateway-view-track-order"}
            state={{
              orderId: params.data.orderId,
              date: params.data.createdDate,
              mobileNumber: params.data.mobileNumber,
              status: params.data.transactionStatus,
              amount: params.data.amount,
              bookingId: params.data.bookingId,
              subCategory: params.data.subCategory,
            }}
          >
            View Track Order
          </Link>
        ),
      },
       {
        field: "userName",
        headerName: "User name",
        maxWidth: "140",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
      {
        field: "mobileNumber",
        headerName: "Mobile No.",
        maxWidth: "120",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
     
      {
        field: "packageName",
        headerName: "Package Name",
        maxWidth: "160",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
       {
        field: "roomName",
        headerName: "House Name",
        maxWidth: "160",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
      {
        field: "amount",
        headerName: "Amount",
        maxWidth: "120",
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          formatToCurrency(params.value, "INR", "en-IN") || "00:00",
      },
      {
        field: "noOfHouses",
        headerName: "No of Houses booked",
        maxWidth: "120",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
  
      {
        field: "bookingType",
        headerName: "Mode of Booking",
        maxWidth: "140",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
      {
        field: "paymentMode",
        headerName: "Payment Mode",
        maxWidth: "140",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
      {
        field: "transactionStatus",
        headerName: "Transaction Status",
        maxWidth: "220",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
        cellRenderer: (params) => (
          <span title={params.value}>{params.value}</span>
        ),
      },
      {
        field: "orderId",
        headerName: "Order ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
      {
        field: "bookingId",
        headerName: "Booking ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
      {
        field: "resultMessage",
        hide: outerFilters.status === "Success",
        headerName: "Result Message",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
        cellRenderer: (params) => (
          <span title={params.value}>{params.value}</span>
        ),
      },
    ];
    const breadcrumbItems = [
    {
      label: 'Total Transactions Report',
      path: `/amarabad-total-transaction`
    },
     {
      label: 'Total Failed (Payment Gateway)',  
      path: `/amrabad-failed-gateway`,
       onclick:()=>{resetDeepInnerFilters()
       
      },
    },
    {
      label: subCategory ? `${subCategory.replace(/([A-Z])/g, " $1").trim()}` : "Failed (Payment Gateway) Report",  
      isLast: true
    }
  ];
  return (
    <AdminLayout>
       <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb 
            customItems={breadcrumbItems}
            className="mb-4"
          />
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Failed (Payment Gateway)-{(subCategory || innerFilters.subCategory || "").replace(/([A-Z])/g, " $1").trim()} Report
            </h1>
          </div>
          <div className="">
            <Link
              to={`/amrabad-failed-gateway?package=${packageName || ""}&house=${house || ""}&mobileNumber=${mobileNumber || ""}&fromDate=${fromDate || ""}&toDate=${toDate || ""}&subCategory=${encodeURIComponent(subCategory || "")}`}
              className="bg-black text-white font-semibold px-4 py-1.5 rounded"
               onClick={() => {
                resetDeepInnerFilters();
              }}
            >
              Back
            </Link>
          </div>
        </div>

        <div>
          <AmrabadFailedGateWayReportForm
            pageNumber={currentPage + 1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
            packageName={packageName}
            house={house}
            mobileNumber={mobileNumber}
            fromDate={fromDate}
            toDate={toDate}
            subCategory={subCategory}
          />
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={AmrabadTotalTransactionsData}
            columnDefs={columnDefs}
            isFetchLoading={isAmrabadTotalTransactionsLoading}
            isPagination={false}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            showTotalCount={true}
            totalCount={AmrabadTotalTransactionsData[0]?.totalCount}
            tableHeight={AmrabadTotalTransactionsData.length > 10 ? 550 : 300}
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AmrabadFailedGatewayReport;
