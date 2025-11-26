import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AmarabadTotalCommonStore from "../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import { useAmarabadTotalTransactionStore } from "../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalTransactionStore";
import AdminLayout from "../../../../layouts/AdminLayout";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { formatDateTime } from "../../../../utils/Helper";
import { formatToCurrency } from "../../../../utils/TypographyHelper";
import Breadcrumb from "../../../../components/Breadcrumb";
import OuterAmarabadTotalTransactionForm from "./outer_report/OuterAmarabadTotalTransactionForm";

const AmrabadTotalReport = () => {
  const {
    innerFilters,
    outerFilters,
    deepInnerFilters,
    resetDeepInnerFilters,
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
  useEffect(() => {
    fetchAmrabadTotalTransactions({
      startDate: (innerFilters.fromDate ?? outerFilters.fromDate) ?? "",
      endDate: (innerFilters.toDate ?? outerFilters.toDate) ?? "",
      phoneNumber:
        (innerFilters.mobileNumber ?? outerFilters.mobileNumber) ?? "",
      package:(innerFilters.package ?? outerFilters.package) ?? "",
      house:(innerFilters.house ?? outerFilters.house) ?? "",
      PaymentMode: innerFilters.PaymentMode ?? "",
      status: outerFilters.status ?? "",
      subCategory: "",
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }, [PAGE_LIMIT, currentPage]);
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
          to={"/amrabad-successful-view-track-order"}
          state={{
            orderId: params.data.orderId,
            date: params.data.createdDate,
            mobileNumber: params.data.mobileNumber,
            status: params.data.transactionStatus,
            amount: params.data.amount,
            bookingId: params.data.bookingId,
            packageName: params.data.packageName,
            houseName: params.data.roomName,
          }}
        >
          View Track Order
        </Link>
      ),
    },
      {
      field: "userName",
      headerName: "User name",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "packageName",
      headerName: "Package Name",
      // maxWidth: "140",
      // minWidth: "140",
      // flex: 1,
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
      // maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
      {
      field: "bookingType",
      headerName: "Mode of Booking",
      // maxWidth: "140",
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
  ];
  const breadcrumbItems = [
    {
      label: "Total Transactions Report",
      path: `/amarabad-total-transaction`,
      onclick: () => resetDeepInnerFilters(),
    },

    {
      label: `Total ${
        outerFilters.status ? outerFilters.status : "Transaction"
      } Report`,
      isLast: true,
    },
  ];
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-6">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        </div>
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Total {outerFilters.status ? outerFilters.status : "Transaction"}{" "}
              Report
            </h1>
          </div>
          <div className="">
            <Link
              to="/amarabad-total-transaction"
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
          <OuterAmarabadTotalTransactionForm
            pageNumber={currentPage + 1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
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
            tableHeight={(AmrabadTotalTransactionsData.length || 0) > 10 ? 560 : 330
            }
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AmrabadTotalReport;
