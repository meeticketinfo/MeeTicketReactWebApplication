import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import AgGridTable from "../../../../../../tables/AgGridTable";
import AdminLayout from "../../../../../../../layouts/AdminLayout";
import { formatDateTime } from "../../../../../../../utils/Helper";
import { formatToCurrency } from "../../../../../../../utils/TypographyHelper";
import useAmrabadTotalCommonStore from "../../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import IntercityNotGeneratedReportForm from "./IntercityNotGeneratedReportForm";
import Breadcrumb from "../../../../../../../components/Breadcrumb";
import { useIntercityTotalTransactionStore } from "../../store/IntercityTotalTransactionStore";

const IntercityNotGeneratedReport = () => {


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mobileNumber = searchParams.get("mobileNumber");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const subCategory = searchParams.get("subCategory");
  const status = searchParams.get("status");
  const arrivalLocation = searchParams.get("arrivalLocation");
  const departureLocation = searchParams.get("departureLocation");
  const busType = searchParams.get("busType");
  const {innerFilters,outerFilters,deepInnerFilters,resetDeepInnerFilters} = useAmrabadTotalCommonStore();

  const {
    fetchTotalTransactionsReport,
    totalTransactionsReport,
    isTotalTransactionsReportLoading,
  } = useIntercityTotalTransactionStore();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  useEffect(() => {
    fetchTotalTransactionsReport({
      startDate: fromDate ?? deepInnerFilters.startDate ?? innerFilters.fromDate ?? "",
      endDate: toDate ?? deepInnerFilters.endDate ?? innerFilters.toDate ?? "",
      phoneNumber:
        mobileNumber ?? deepInnerFilters.mobileNumber ?? innerFilters.mobileNumber ?? "",
      arrivalLocation: deepInnerFilters.arrivalLocation ?? innerFilters.arrivalLocation ?? outerFilters.arrivalLocation ?? "",
      departureLocation: deepInnerFilters.departureLocation ?? innerFilters.departureLocation ?? outerFilters.departureLocation ?? "",
      status: status ?? innerFilters.status ?? outerFilters.status ?? "",
      subCategory: subCategory ?? innerFilters.subCategory ?? outerFilters.subCategory ?? "",
      arrivalLocation: arrivalLocation ?? innerFilters.arrivalLocation ?? outerFilters.arrivalLocation ?? "",
      departureLocation: departureLocation ?? innerFilters.departureLocation ?? outerFilters.departureLocation ?? "",
      busType: busType ?? innerFilters.busType ?? outerFilters.busType ?? "",
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }, [PAGE_LIMIT,
    currentPage,
    deepInnerFilters.fromDate,
    deepInnerFilters.toDate,
    deepInnerFilters.mobileNumber,
    deepInnerFilters.BusPassType,
    deepInnerFilters.departureLocation,
    deepInnerFilters.arrivalLocation,
    deepInnerFilters.busType,
    outerFilters.fromDate,
    outerFilters.toDate,
    outerFilters.mobileNumber,
    outerFilters.BusPassType,
    outerFilters.departureLocation,
    outerFilters.arrivalLocation,
    outerFilters.busType,
    outerFilters.status,]);  
  
  const columnDefs = [
    {
      field: "sno",
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
      headerName: "Transaction Date & Time",
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
          to={"/intercity-total-transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
            status: params.data.transactionStatus,
            amount: params.data.amount,
            bookingId: params.data.bookingId,
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "userName",
      headerName: "User Name",
      maxWidth: "120",
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
      field: "busType",
      headerName: "Type of Bus Pass",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "ticketQuantity",
      headerName: "Ticket Quantity",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },

    {
      field: "departureLocation",
      headerName: "Departure Location",
      // maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
       
    {
      field: "arrivalLocation",
      headerName: "Arrival Location",
      // maxWidth: "120",
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
      field: "paymentMode",
      headerName: "Payment Mode",
      maxWidth: "170",
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
        <span title={params.value ?? "N/A"}>{params.value ?? "N/A"}</span>
      ),
    },
  ];
  const breadcrumbItems = [
    {
      label: 'Total Transactions Report',
      path: `/intercity-total-transaction`
    },
     {
      label: 'Ticket Not Generated Transactions Report',  
      path: `/intercity-not-generated`,
      //  onclick:()=>{resetDeepInnerFilters()
        
      // },
    },
    {
      label: subCategory ? `${subCategory.replace(/([A-Z])/g, " $1").trim()}` : "Payment Successful but Ticket not Generated Report",  
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
              Payment Successful but Ticket not Generated - {(subCategory || innerFilters.subCategory || "").replace(/([A-Z])/g, " $1").trim()} Report
            </h1>
          </div>
          <div className="">
            <Link
              to={`/intercity-not-generated?arrivalLocation=${arrivalLocation || ""}&departureLocation=${departureLocation || ""}&busType=${busType || ""}&mobileNumber=${mobileNumber || ""}&fromDate=${fromDate || ""}&toDate=${toDate || ""}&subCategory=${encodeURIComponent(subCategory || "")}`}
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
          <IntercityNotGeneratedReportForm
            pageNumber={currentPage + 1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
            mobileNumber={mobileNumber}
            fromDate={fromDate}
            toDate={toDate}
            subCategory={subCategory}
            arrivalLocation={arrivalLocation}
            departureLocation={departureLocation}
            busType={busType}
            />
           <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={totalTransactionsReport}
            columnDefs={columnDefs}
            isFetchLoading={isTotalTransactionsReportLoading}
            isPagination={false}
            IsReactPaginate={true}
            setPageLimit={setPAGE_LIMIT}
            pageLimit={PAGE_LIMIT}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            showTotalCount={true}
            totalCount={totalTransactionsReport[0]?.totalCount}
            tableHeight={totalTransactionsReport.length > 10 ? 550 : 300}
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default IntercityNotGeneratedReport;
