import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  formatToCurrency,
  getCurrentDateEndTime,
  getCurrentDateStartTime,
} from "../../../../utils/TypographyHelper";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import { useParkStore } from "../../../../store/masters/parksStore";
import { cleanString, getDateRange, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import { userReports } from "../../../../store/userTransaction/UserReports";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-[75vw] shadow-lg rounded-md bg-white z-20" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Transaction Logs</h3>
          <div className="mt-2 px-7 py-3">
            {children}
          </div>
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserTransactionsOrderTracker = () => {
  const location = useLocation();
  const { orderId, mobileNumber, parkName, date, amount } = location.state || {};
  const navigate = useNavigate();
  const {
    TransactionTrackingStatusByOrderIdData,
    isFetchTransactionTrackingStatusByOrderId,
    fetchTransactionTrackingStatusByOrderId,
  } = userFailureTransaction();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const userReportSearchParams = localStorage.getItem("userReportSearchParams");
  const userDetailedReportSearchParams = localStorage.getItem("userDetailedReportSearchParams");
  const {
    userDetailedReport,
    isFetchUserDetailedReport,
    fetchUserDetailedReport
  } = userReports();
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({});
  };

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "requestTimestamp",
      maxWidth: "200",
      headerName: "Request Time Stamp",
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
          second: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: "responseTimestamp",
      maxWidth: "200",
      headerName: "Response Time Stamp",
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
          second: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: "transactionStatus",
      maxWidth: "180",
      headerName: "Transaction Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value == "INITIATE" ? "Request Sent"
        : params.value == "INPROCESS" ? "Deep Link Status" : "Payment Status Check"
    },
    // {
    //   field: "action",
    //   maxWidth: "130",
    //   headerName: "Action",
    //   headerClass: "text-blue-v2",
    //   // cellRenderer: (params) => (<Button className="text-blue-v2" state={{ mobileNumber: params.data.mobileNumber, status: "" }} to="/user-status-transaction">{params.value}</Button>),
    //   cellRenderer: (params) => (
    //     <button
    //       className="bg-blue-v2 text-white py-1.5 px-2.5 leading-none rounded-lg text-sm"
    //       onClick={() => {
    //         openModal(params.data.resultFullJsonMsg)
    //       }}
    //     >
    //       View Logs
    //     </button>
    //   ),
    // },
    {
      field: "resultMsg",
      flex: 1,
      headerName: "Result Msg",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value}
        </span>
      ),
    },
  ]);

  useEffect(() => {
    // console.log(useLocation().state, "useLocation().state")
    fetchTransactionTrackingStatusByOrderId(orderId);
  }, [orderId]);
  const TimeFormate = (dateParam) => {
    const date = new Date(dateParam);
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
  }
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Transaction Order Tracking Report
              </h1>
            </div>
            <div className="">
              <Link
                to={`/user-detailed-report?${JSON.parse(userDetailedReportSearchParams)}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>

          {/* Transaction Details Cards */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Date</h3>
              <p className="text-sm font-semibold text-gray-900">
                {TimeFormate(date) || 'N/A'}
              </p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Order ID</h3>
              <p className="text-sm font-semibold text-gray-900">{orderId || 'N/A'}</p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Mobile Number</h3>
              <p className="text-sm font-semibold text-gray-900">{mobileNumber || 'N/A'}</p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Park Name</h3>
              <p className="text-sm font-semibold text-gray-900">{parkName || 'N/A'}</p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Amount</h3>
              <p className="text-sm font-semibold text-gray-900">{amount ? formatToCurrency(amount) : 'N/A'}</p>
            </div>
          </div>

          <div>
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={TransactionTrackingStatusByOrderIdData}
              columnDefs={columnDefs}
              isFetchLoading={isFetchTransactionTrackingStatusByOrderId}
            />
          </div>
        </div>
      </AdminLayout>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-left overflow-auto max-h-[70vh]">
          <pre className="whitespace-pre-wrap break-words text-sm bg-gray-50 p-4 rounded-md border border-gray-200">
            {typeof modalContent === 'string' ? modalContent : JSON.stringify(modalContent, null, 2)}
          </pre>
        </div>
      </Modal>
    </>
  );
};

export default UserTransactionsOrderTracker;
