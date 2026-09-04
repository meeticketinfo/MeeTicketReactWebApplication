import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import CurrentRefundTransactionsReportForm from "./CurrentRefundTransactionsReportForm";
import AgGridTable from "../../../../../tables/AgGridTable";
import { formatToCurrency } from "../../../../../../utils/TypographyHelper";
import PopupModal from "../../../../../utils/popup_modal/PopupModal";
import Breadcrumb from "../../../../../Breadcrumb";
import AdminLayout from "../../../../../../layouts/AdminLayout";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import { useCurrentRefundReportStore } from "../../../../../../store/rtc/CurrentRefundReportStore";
import { ToastContainer } from "react-toastify";
import { useCurrentPaymentTransactionStore } from "../../../../../../store/rtc/CurrentPaymentTransactionStore";
import { filterRecordsByIntercityBus } from "../../shared/CurrentBookingReportFilterFields";

const CurrentRefundTransactionsReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [intercityBusFilter, setIntercityBusFilter] = useState(
    searchParams.get("intercityBus") || ""
  );

  const {
    isFetchCurrentRefundTransactionsInnerReport,
    refundCurrentTransactionsInnerReport,
    fetchCurrentRefundTransactionsInnerReport,
  } = useCurrentRefundReportStore();

  const {
    fetchCurrentPaymentTransactionRefund,
    isFetchCurrentPaymentTransactionRefundLoading,
  } = useCurrentPaymentTransactionStore();

  const isTotalRow = (params) =>
    params?.node?.rowPinned === "bottom" || params?.data?.isTotal;

  const getPagePinnedBottomRowData = useCallback((displayedRows) => [
    {
      isTotal: true,
      pnrNumber: "TOTAL",
      refundAmount: displayedRows.reduce(
        (sum, row) => sum + Number(row.refundAmount || 0),
        0,
      ),
      amount: displayedRows.reduce(
        (sum, row) => sum + Number(row.amount || row.totalAmount || 0),
        0,
      ),
      noOfTickets: displayedRows.reduce(
        (sum, row) => sum + Number(row.noOfTickets || row.ticketQuantity || 0),
        0,
      ),
    },
  ], []);

  const columnDefs = [
    {
      headerName: "S.NO",
      valueGetter: (params) => {
        if (isTotalRow(params)) return "";
        return params.node.rowIndex + 1;
      },
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "pnrNumber",
      headerName: "PNR NO",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return params.value || "TOTAL";
        return params.value || "N/A";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "transactionDateandTime",
      headerName: "DATE AND TIME OF TRANSACTION",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    // {
    //   headerName: "ACTIONS",
    //   field: "actions",
    //   maxWidth: "110",
    //   cellRenderer: (params) => (
    //     <div className="flex align-center gap-2">
    //       <button
    //         className={`${
    //           params.data.refundStatus === "NotRefund"
    //             ? "bg-green-400"
    //             : "bg-green-100 cursor-not-allowed"
    //         } text-white font-medium leading-normal px-2 py-1 mt-1.5 rounded-md uppercase`}
    //         disabled={params.data.refundStatus !== "NotRefund"}
    //         onClick={() => {
    //           setRefundOrderId(params.data.orderID);
    //           setInitiatRefundModal(true);
    //         }}
    //       >
    //         Initiate
    //       </button>
    //     </div>
    //   ),
    //   flex: 1,
    //   headerClass: "text-blue-v2",
    // },
    {
      field: "refundStatus",
      headerName: "REFUND STATUS",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || "N/A";
      },
    },
    {
      field: "refundAmount",
      headerName: "REFUND AMOUNT",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params))
          return formatToCurrency(params.value, "INR", "en-IN") || "";
        return formatToCurrency(params.value, "INR", "en-IN") || "00:00";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "refundDate",
      headerName: "REFUND DATE",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      field: "mobileNumber",
      minWidth: 90,
      headerName: "MOBILE NUMBER",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || params.value === " " ? params.value : "N/A";
      },
    },
    {
      field: "departureLocation",
      headerName: "DEPARTURE LOCATION",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || params.value === " " ? params.value : "N/A";
      },
    },
    {
      field: "arrivalLocation",
      headerName: "ARRIVAL LOCATION",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || params.value === " " ? params.value : "N/A";
      },
    },
    {
      field: "amount",
      headerName: "TOTAL AMOUNT",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params))
          return formatToCurrency(params.value, "INR", "en-IN") || "";
        return formatToCurrency(params.value, "INR", "en-IN") || "00:00";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "noOfTickets",
      headerName: "TICKET QUANTITY",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params))
          return params.value || params.value === 0 ? params.value : "";
        return params.value || params.value === " " ? params.value : "N/A";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "modeofPayment",
      headerName: "PAYMENT MODE",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ?? "N/A";
      },
    },
    {
      field: "transactionStatus",
      headerName: "TRANSACTION STATUS",
      maxWidth: "230",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || params.value === " " ? params.value : "N/A";
      },
    },
    {
      field: "orderID",
      headerName: "ORDER ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || "N/A";
      },
    },
    {
      field: "bookingID",
      headerName: "BOOKING ID",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || "0";
      },
    },
  ];

  const getRefundStatusFromParams = () => {
    const status =
      searchParams.get("refundStatus") ?? searchParams.get("RefundStatus");
    if (status === null || status === "") return "-1";
    return status;
  };

  const loadRefundTransactionsReport = () => {
    fetchCurrentRefundTransactionsInnerReport({
      fromDate:
        cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      mobileNumber: searchParams.get("mobileNumber") || "",
      pnrNumber: searchParams.get("pnrNumber") || "",
      refundStatus: getRefundStatusFromParams(),
    });
  };

  useEffect(() => {
    loadRefundTransactionsReport();
  }, [searchParams]);

  const filteredRefundTransactions = useMemo(
    () =>
      filterRecordsByIntercityBus(
        Array.isArray(refundCurrentTransactionsInnerReport)
          ? refundCurrentTransactionsInnerReport
          : [],
        intercityBusFilter
      ),
    [refundCurrentTransactionsInnerReport, intercityBusFilter]
  );

  const handleIntercityBusChange = (value) => {
    setIntercityBusFilter(value || "");
  };

  const handleInitiateRefund = async () => {
    try {
      const res = await fetchCurrentPaymentTransactionRefund(RefundOrderId);
      setInitiatRefundModal(false);
      if (res.response?.status === 200) {
        const resultMsg = res.response?.data?.refundStatus;
        Swal.fire({
          title: `${resultMsg === "TXN_SUCCESS"
              ? "Success!"
              : resultMsg === "TXN_FAILURE"
                ? "Failed!"
                : "Info!"
            }`,
          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">${resultMsg}</div>`,
          icon: `${resultMsg === "TXN_SUCCESS"
              ? "success"
              : resultMsg === "TXN_FAILURE"
                ? "error"
                : "info"
            }`,
          customClass: {
            confirmButton: "swal-custom-btn",
            popup: "elegant-swal-popup",
            icon: "small-swal-icon",
          },
          timer: 2000,
          width: "360px",
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">${res.response?.data?.message}</div>`,
          icon: "info",
          width: "360px",
          customClass: {
            popup: "custom-swal-popup",
            confirmButton: "swal-custom-btn",
            icon: "small-swal-icon",
          },
          confirmButtonText: "OK",
          background: "#ffffff",
        });
      }
    } catch {
      Swal.fire({
        title: "Failed!",
        text: "Refund failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      loadRefundTransactionsReport();
    }
  };

  const getRefundStatusLabel = (status) => {
    const labels = {
      "-1": "ALL",
      0: "Not Initiated",
      1: "Initiated",
      2: "Refunded",
      3: "Failed",
    };
    return labels[status] ?? status;
  };

  const breadcrumbItems = [
    {
      label: `Refund Transactions Report ${searchParams.get("refundStatus") &&
          searchParams.get("refundStatus") !== "-1"
          ? `(${getRefundStatusLabel(searchParams.get("refundStatus"))})`
          : ""
        }`,
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4 uppercase" />
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold uppercase">
              Refund Transactions Report{" "}
              {searchParams.get("refundStatus") &&
                searchParams.get("refundStatus") !== "-1"
                ? `(${getRefundStatusLabel(searchParams.get("refundStatus"))})`
                : ""}
            </h1>
          </div>
        </div>
        <div>
          <ToastContainer />
          <CurrentRefundTransactionsReportForm
            onIntercityBusChange={handleIntercityBusChange}
          />
          <AgGridTable
            showSearch={false}
            ExportName="CurrentRefundTransactionReport"
            rowData={filteredRefundTransactions}
            columnDefs={columnDefs}
            getPagePinnedBottomRowData={getPagePinnedBottomRowData}
            isFetchLoading={isFetchCurrentRefundTransactionsInnerReport}
            showTotalCount={true}
            totalCount={filteredRefundTransactions?.length || 0}
          />
        </div>
      </div>
      <PopupModal
        popupModalId="current-refund-modal"
        isOpen={InitiatRefundModal}
        onClose={() => setInitiatRefundModal(false)}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure you want to proceed with the refund?
          </h1>
          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              onClick={handleInitiateRefund}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              {isFetchCurrentPaymentTransactionRefundLoading ? (
                <span className="px-8">
                  <l-tailspin
                    size="15"
                    stroke="5"
                    speed="0.9"
                    color="white"
                  ></l-tailspin>
                </span>
              ) : (
                "Proceed"
              )}
            </button>
            <button
              onClick={() => setInitiatRefundModal(false)}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>
    </AdminLayout>
  );
};

export default CurrentRefundTransactionsReport;
