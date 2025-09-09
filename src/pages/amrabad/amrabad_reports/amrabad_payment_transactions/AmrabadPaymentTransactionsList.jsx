import React, { useEffect, useState } from "react";
import AgGridTable from "../../../../components/tables/AgGridTable";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import Select from "react-select";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import AmrabadPaymentTransactionsForm from "./AmrabadPaymentTransactionsForm";
import PopupModal from "../../../../components/utils/popup_modal/PopupModal";
import Swal from "sweetalert2";
function AmrabadPaymentTransactionsList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState("");
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const {
    isAmrabadTransactionPaymentReportsLoading,
    allAmrabadTransactionPaymentReports,
    fetchAmrabadPaymentTransactions,
    fetchAmrabadVerifyStatus,
    isFetchAmrabadVerifyStatusLoading,
    fetchAmrabadPaymentTransactionRefund,
    isFetchAmrabadPaymentTransactionRefundLoading
  } = useAmrabadConsolidatedStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-payment-report-filters")
  );

  useEffect(() => {
    fetchAmrabadPaymentTransactions({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      package: savedFilters?.package ?? "",
      house: savedFilters?.house ?? "",
      paymentStatus: savedFilters?.paymentStatus? savedFilters.paymentStatus: "",
      paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
      phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
      transactionId: savedFilters?.transactionId? savedFilters.transactionId: "",
      PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  }, [fetchAmrabadPaymentTransactions]);

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
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "transaactionID",
      headerName: "Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "packageName",
      headerName: "Package Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "houseName",
      headerName: "House Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "amountPaid",
      headerName: "Amount Paid",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "bookingType",
      headerName: "Mode of Booking ",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Paymode Mode",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentStaus",
      headerName: "Payment Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "actual_PaytmStatus",
      headerName: "Actual Paytm Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundStatus",
      headerName: "Refund Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundId",
      headerName: "Refund ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentMode",
      headerName: "Refund Initiated Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "Initiate Refund",
      field: "InitiateRefund",
      maxWidth: 130,
      //   hide: email === "esdadmin@gmail.com",
      cellRenderer: (params) => {
        // console.log("params",params)
        return (
          <div className="flex align-center gap-2">
            <>
              <button
                className={` ${
                 true
                    ? "bg-green-400"
                    : "bg-green-100 cursor-not-allowed "
                } text-white font-medium leading-normal px-2 py-1 mt-1.5 rounded-md`}
                // disabled={params.data.refundStatus != "Not Refunded"}
                onClick={() => {
                  setRefundOrderId(params.data.transaactionID);
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
      field: "VerifyTicket",
      headerName: "Verify Ticket",
      maxWidth: 140,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const isDisabled = params.data.actual_PaytmStatus === "TXN_SUCCESS";
        // || params.data.isTicketGenerated;

        return (
          <div className="flex justify-center mt-1">
            <button
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-v2 text-white hover:bg-blue-v1"
              }`}
              onClick={() => {
                if (!isDisabled) {
                  setVerifyData(params.data.transaactionID);
                  setOpenVerifyModal(true);
                }
              }}
              disabled={isDisabled}
            >
              Verify Status
            </button>
          </div>
        );
      },
    },
    {
       field: "paymentMode",
      headerName: "Actions",
    }
  ]);
  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleVerifyTicket = async () => {
    try {
      const res = await fetchAmrabadVerifyStatus(verifyData);
      // console.log("API Response:", res);

      if (res.response?.data?.status === 200) {
        setOpenVerifyModal(false);
        const resultMsg = res.response?.data?.data?.resultStatus;
       
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
          // title: "Oops!",
          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
           ${res.response?.data?.data?.resultMsg || res.response?.data?.message}
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
      console.error("Error during verify:", err);
      setOpenVerifyModal(false);
      Swal.fire({
        title: "Failed!",
        text: `Verify failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      // Delay API call to ensure SweetAlert has closed
      setTimeout(() => {
        fetchAmrabadPaymentTransactions({
          startDate: savedFilters?.fromDate ?? getCurrentDate(),
          endDate: savedFilters?.toDate ?? getCurrentDate(),
          package: savedFilters?.package ?? "",
          house: savedFilters?.house ?? "",
          paymentStatus: savedFilters?.paymentStatus
            ? savedFilters.paymentStatus
            : "",
          paymentMode: savedFilters?.paymentMode
            ? savedFilters.paymentMode
            : "",
          phoneNumber: savedFilters?.phoneNumber
            ? savedFilters.phoneNumber
            : "",
          transactionId: savedFilters?.transactionId
            ? savedFilters.transactionId
            : "",
          PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
          pageSize: PAGE_LIMIT,
        });
      }, 2100);
    }
  };
//   initiate refund
  const handleInitiateRefund = async () => {
   
    try {
      const res = await fetchAmrabadPaymentTransactionRefund({orderId:RefundOrderId});
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
        setInitiatRefundModal(false);
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
      setInitiatRefundModal(false);
      Swal.fire({
        title: "Failed!",
        text: `Refund failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      // Delay API call to ensure SweetAlert has closed
      // loadRefundTransactionsReport(currentPage);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <AmrabadPaymentTransactionsForm
          PageIndex={1}
          pageSize={PAGE_LIMIT}
          SetcurrentPage={setCurrentPage}
        />
        <AgGridTable
          ExportName="Payment Transactions"
          rowData={allAmrabadTransactionPaymentReports?.data || []}
          columnDefs={columnDefs}
          isFetchLoading={isAmrabadTransactionPaymentReportsLoading}
          isPagination={false}
          tableHeight={
            allAmrabadTransactionPaymentReports?.data?.length > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={allAmrabadTransactionPaymentReports.totalCount}
          showTotalCount={true}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
        />
      </div>

      <PopupModal
        popupModalId="first-modal"
        isOpen={openVerifyModal}
        onClose={() => setOpenVerifyModal(false)}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure you want to Verify the ticket status for this booking?
          </h1>

          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              onClick={async () => {
                await handleVerifyTicket();
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              {isFetchAmrabadVerifyStatusLoading ? (
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
              onClick={() => setOpenVerifyModal(false)}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>

      {/* initiate refund modal */}

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
                {false ? (
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
    </div>
  );
}

export default AmrabadPaymentTransactionsList;
