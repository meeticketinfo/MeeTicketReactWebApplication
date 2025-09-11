import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import IntercityRefundTransactionsReportForm from "./IntercityRefundTransactionsReportForm";
import AgGridTable from "../../../../../tables/AgGridTable";
import { formatToCurrency } from "../../../../../../utils/TypographyHelper";
import PopupModal from "../../../../../utils/popup_modal/PopupModal";
import Breadcrumb from "../../../../../Breadcrumb";
import AdminLayout from "../../../../../../layouts/AdminLayout";
import { useRtcRefundStore } from "../../../../../../store/rtc/RtcRefundTransactionStore";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
const IntercityRefundTransactionsReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const amrabadRefundTransactionSearchParams =
    localStorage.getItem("busPassRefundInnerTransactionSearchParams") || "";
  const {
    isFetchBusPassRefundTransactionsInnerReport,
    refundBusPassTransactionsInnerReport,
    refundTransactionsPagination,
    fetchBusPassRefundTransactionsInnerReport,
    fetchBusPassInitiateRefundOrderId,
    isInitiateRefund,
  } = useRtcRefundStore();
  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionDateandTime",
      headerName: "Date and Time of Transaction",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
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
      headerName: "Actions",
      field: "actions",
      maxWidth: "100",
      //   hide: email === "esdadmin@gmail.com",
      cellRenderer: (params) => {
        // console.log("params",params)
        return (
          <div className="flex align-center gap-2">
            <>
              <button
                className={` ${
                  params.data.refundStatus === "NotRefund"
                    ? "bg-green-400"
                    : "bg-green-100 cursor-not-allowed "
                } text-white font-medium leading-normal px-2 py-1 mt-1.5 rounded-md`}
                disabled={params.data.refundStatus != "NotRefund"}
                onClick={() => {
                  setRefundOrderId(params.data.orderID);
                  setInitiatRefundModal(true);
                }}
              >
                Initiate
              </button>
            </>
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "refundStatus",
      headerName: "RefundStatus",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value || params.value === " " ? params.value : "N/A",
    },
    {
      field: "mobileNumber",
      minWidth: 100,
      headerName: "Mobile Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value || params.value === " " ? params.value : "N/A",
    },
    {
      field: "typeofBusPass",
      headerName: "Type of Bus Pass",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      maxWidth: "100",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "noOfTickets",
      headerName: "No of Tickets",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "modeofTransaction",
      headerName: "Mode of Transaction",
      // maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "modeofPayment",
      headerName: "Mode of Payment",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "orderID",
      headerName: "Order ID",
      // Width: "390",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "bookingID",
      headerName: "Booking ID",
      // Width: "260",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
  ];

  const loadRefundTransactionsReport = (page = 0) => {
    try {
      fetchBusPassRefundTransactionsInnerReport({
        fromDate:
          cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
        toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
        mobileNumber: searchParams.get("mobileNumber") || "",
        busPassType: searchParams.get("BusPassType") || "",
        status:
          searchParams.get("RefundStatus") === "null"
            ? ""
            : searchParams.get("RefundStatus") || "",
        pageNumber: page + 1,
        pageSize: PAGE_LIMIT,
      });
    } catch (error) {
      console.error("Error loading refund transactions report:", error);
    }
  };
  useEffect(() => {
    loadRefundTransactionsReport(currentPage);
  }, [currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleInitiateRefund = async () => {
    console.log("RefundOrderId", RefundOrderId);
    try {
      const res = await fetchBusPassInitiateRefundOrderId(RefundOrderId);
      console.log("API Response:", res);
      setInitiatRefundModal(false);
      if (res.response?.status === 200) {
        const resultMsg = res.response?.data?.message;

        Swal.fire({
          title: "Success!",

          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
              ${resultMsg}
            </div>`,

          confirmButtonText: "OK",
          icon: "success",
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
        setOpenVerifyModal(false);
        Swal.fire({
          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
              ${res.response?.data?.message}
            </div>`,
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
    } catch (err) {
      Swal.fire({
        title: "Failed!",
        text: `Refund failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      // Delay API call to ensure SweetAlert has closed
      loadRefundTransactionsReport(currentPage);
    }
  };

  const breadcrumbItems = [
    {
      label: "Refund Transactions",
      path: `/intercity-refund-report?${amrabadRefundTransactionSearchParams}`,
    },
    {
      label: `Refund Transactions Report ${
        searchParams.get("RefundStatus")
          ? `(${searchParams.get("RefundStatus")})`
          : ""
      }`,
      isLast: true,
    },
  ];

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Refund Transactions Report{" "}
                {searchParams.get("RefundStatus")
                  ? `(${searchParams.get("RefundStatus")})`
                  : ""}
              </h1>
            </div>
            <div className="">
              <Link
                to={`/intercity-refund-report?${amrabadRefundTransactionSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>
          <div>
            <IntercityRefundTransactionsReportForm
              pageNumber={currentPage + 1}
              pageSize={PAGE_LIMIT}
              setCurrentPage={setCurrentPage}
            />
            <AgGridTable
              showSearch={false}
              ExportName="UserStatusTransactionReport"
              rowData={
                Array.isArray(refundBusPassTransactionsInnerReport)
                  ? refundBusPassTransactionsInnerReport
                  : []
              }
              columnDefs={columnDefs}
              isFetchLoading={isFetchBusPassRefundTransactionsInnerReport}
              tableHeight={
                Array.isArray(refundBusPassTransactionsInnerReport) &&
                refundBusPassTransactionsInnerReport?.length > 10
                  ? 560
                  : 330
              }
              isPagination={false}
              IsReactPaginate={true}
              setPageLimit={setPAGE_LIMIT}
              pageLimit={PAGE_LIMIT}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              showTotalCount={true}
              totalCount={refundTransactionsPagination.totalCount}
              SetcurrentPage={setCurrentPage}
            />
          </div>
        </div>
        {/* Initiate Refund */}
        <PopupModal
          popupModalId="first-modal"
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
                onClick={async () => {
                  await handleInitiateRefund();
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
              >
                {isInitiateRefund ? (
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
    </>
  );
};

export default IntercityRefundTransactionsReport;
