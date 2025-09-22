import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable from "../../../../../components/tables/AgGridTable";
import {
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import IntercityPaymentTransactionsForm from "./IntercityPaymentTransactionsForm";
import PopupModal from "../../../../../components/utils/popup_modal/PopupModal";
import Swal from "sweetalert2";
import { AiOutlineEye } from "react-icons/ai";
import { useIntercityPaymentTransactionStore } from "../../../../../store/rtc/IntercityPaymentTransactionStore";
import { useAmrabadConsolidatedStore } from "../../../../../store/amrabad/reports/ConsolidatedStore";
function IntercityPaymentTransactionsList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState("");
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [RegenerateTicketOrderId, setRegenerateTicketOrderId] = useState("");
  const [openRegenerateTicketModal, setOpenRegenerateTicketModal] =
    useState(false);
  const {
    isFetchIntercityPaymentTransactionsLoading,
    intercityPaymentTransactions,
    fetchIntercityPaymentTransactions,
  } = useIntercityPaymentTransactionStore();
  const {
    fetchAmrabadVerifyStatus,
    isFetchAmrabadVerifyStatusLoading,
    fetchAmrabadPaymentTransactionRefund,
    fetchAmrabadRegenerateTicket,
    isFetchAmrabadRegenerateTicketLoading,
  } = useAmrabadConsolidatedStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("intercity-payment-report-filters")
  );
  useEffect(() => {
    fetchIntercityPaymentTransactions({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      paymentStatus: savedFilters?.paymentStatus
        ? savedFilters.paymentStatus
        : "",
    
      phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
      arrivalLocation:savedFilters?.arrivalLocation ? savedFilters.arrivalLocation : "",
      destinationLocation:savedFilters?.destinationLocation ? savedFilters.destinationLocation : "",
      PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  }, [fetchIntercityPaymentTransactions, currentPage, PAGE_LIMIT]);

  const [columnDefs] = useState([
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) =>
        currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "orderID",
      headerName: "Order ID",
      minWidth: 200,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 120,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "ticketQuantity",
      headerName: "Ticket Quantity",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      maxWidth: 100,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ? `₹${params.value}` : "N/A",
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN');
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "acutalPaymentStatus",
      headerName: "Actual Payment Status",
      maxWidth: 200,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundDate",
      headerName: "Refund Date",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN');
      },
    },
    {
      field: "refundId",
      headerName: "Refund ID",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "refundStatus",
      headerName: "Refund Status",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "VerifyTicket",
      headerName: "Verify Ticket",
      maxWidth: 140,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const isDisabled = params.data.actual_PaytmStatus === "TXN_SUCCESS";
        // || params.data.isTicketGe nerated;

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
      field: "VerifyTicket",
      headerName: "Generate Ticket",
      maxWidth: 160,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const isDisabled = params.data.isTicketGenerated;
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
                  setRegenerateTicketOrderId(params.data.orderID);
                  setOpenRegenerateTicketModal(true);
                }
              }}
              disabled={isDisabled}
            >
              Generate Ticket
            </button>
          </div>
        );
      },
    },
    {
      headerName: "Initiate Refund",
      field: "InitiateRefund",
      maxWidth: 130,
      //   hide: email === "esdadmin@gmail.com",
      cellRenderer: (params) => {
        // console.log("params",params)
        const isDisabled = params.data.canInitiateRefund;
        return (
          <div className="flex justify-center mt-1">
            <>
              <button
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                  isDisabled
                    ? "bg-blue-v2 text-white hover:bg-blue-v1"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
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
      field: "actions",
      headerName: "Actions",
      maxWidth: 160,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const PaytmStatus = params?.data?.acutalPaymentStatus;
        const canView =
          PaytmStatus &&
          PaytmStatus === "TXN_SUCCESS" &&
          params?.data?.amount > 0;
        return (
          <div className="flex justify-center mt-1">
            {canView ? (
              <NavLink
                end
                to={`/intercity-admin/ticket-view-details/${params?.data?.orderID}`}
                className="bg-blue-v2 text-white hover:bg-blue-v1 px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                title="View ticket"
              >
                <span className="text-white text-base">
                  <AiOutlineEye />
                </span>
                <span className="text-white">View ticket</span>
              </NavLink>
            ) : (
              <span className="text-gray-400">Not available</span>
            )}
          </div>
        );
      },
    },
  ]);
  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleVerifyTicket = async () => {
    try {
      const res = await fetchIntercityVerifyStatus(verifyData);
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
        fetchIntercityPaymentTransactions({
          startDate: savedFilters?.fromDate ?? getCurrentDate(),
          endDate: savedFilters?.toDate ?? getCurrentDate(),
          paymentStatus: savedFilters?.paymentStatus
            ? savedFilters.paymentStatus
            : "",
          phoneNumber: savedFilters?.phoneNumber
            ? savedFilters.phoneNumber
            : "",
          arrivalLocation: savedFilters?.arrivalLocation
            ? savedFilters.arrivalLocation
            : "",
          destinationLocation: savedFilters?.destinationLocation
            ? savedFilters.destinationLocation
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
      const res = await fetchAmrabadPaymentTransactionRefund({
        orderId: RefundOrderId,
      });
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

  const handleRegenerateTicket = async () => {
    try {
      const res = await fetchAmrabadRegenerateTicket({
        orderId: RegenerateTicketOrderId,
      });
      console.log("API Response:", res);
      setOpenRegenerateTicketModal(false);
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
        setOpenRegenerateTicketModal(false);
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
      console.error("Error during regenerate ticket:", err);
      setOpenRegenerateTicketModal(false);
      Swal.fire({
        html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
        ${err.response?.data?.message}
      </div>`,
        title: "Failed!",
        text: `Regenerate ticket failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setOpenRegenerateTicketModal(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <IntercityPaymentTransactionsForm
          PageIndex={1}
          pageSize={PAGE_LIMIT}
          SetcurrentPage={setCurrentPage}
        />
        <AgGridTable
          ExportName="Payment Transactions"
          rowData={intercityPaymentTransactions || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchIntercityPaymentTransactionsLoading}
          isPagination={false}
          tableHeight={
            intercityPaymentTransactions?.data?.length > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={intercityPaymentTransactions?.[0]?.totalCount || 0}
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

      {/* regenerate ticket modal */}
      <PopupModal
        popupModalId="first-modal"
        isOpen={openRegenerateTicketModal}
        onClose={() => setOpenRegenerateTicketModal(false)}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure you want to proceed with the regenerate ticket?
          </h1>
          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              onClick={async () => {
                await handleRegenerateTicket();
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              {isFetchAmrabadRegenerateTicketLoading ? (
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
              onClick={() => setOpenRegenerateTicketModal(false)}
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

export default IntercityPaymentTransactionsList;
