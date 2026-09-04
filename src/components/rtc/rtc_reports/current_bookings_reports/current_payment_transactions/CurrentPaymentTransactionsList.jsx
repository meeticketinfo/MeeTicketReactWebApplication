import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable from "../../../../../components/tables/AgGridTable";
import CurrentPaymentTransactionsForm from "./CurrentPaymentTransactionsForm";
import PopupModal from "../../../../../components/utils/popup_modal/PopupModal";
import Swal from "sweetalert2";
import { useCurrentPaymentTransactionStore } from "../../../../../store/rtc/CurrentPaymentTransactionStore";
import { getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { filterRecordsByIntercityBus } from "../shared/CurrentBookingReportFilterFields";

function CurrentPaymentTransactionsList() {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState("");
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [RegenerateTicketData, setRegenerateTicketData] = useState("");
  const [openRegenerateTicketModal, setOpenRegenerateTicketModal] =
    useState(false);
  const {
    isFetchCurrentPaymentTransactionsLoading,
    currentPaymentTransactions,
    fetchCurrentPaymentTransactions,
    fetchCurrentVerifyStatus,
    isFetchCurrentVerifyStatusLoading,
    fetchCurrentPaymentTransactionRefund,
    isFetchCurrentPaymentTransactionRefundLoading,
    fetchCurrentRegenerateTicket,
    isFetchCurrentRegenerateTicketLoading,
  } = useCurrentPaymentTransactionStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("current-payment-report-filters")
  );
  const [intercityBusFilter, setIntercityBusFilter] = useState(
    savedFilters?.intercityBus || ""
  );
  useEffect(() => {
    fetchCurrentPaymentTransactions({
      startDate: savedFilters?.fromDate ?? startOfDay,
      endDate: savedFilters?.toDate ?? endOfDay,
      paymentStatus: savedFilters?.paymentStatus
        ? savedFilters.paymentStatus
        : "",

      phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
      arrivalLocation: savedFilters?.arrivalLocation ? savedFilters.arrivalLocation : "",
      destinationLocation: savedFilters?.destinationLocation ? savedFilters.destinationLocation : "",
    });
  }, [fetchCurrentPaymentTransactions]);

  const filteredPaymentTransactions = useMemo(
    () =>
      filterRecordsByIntercityBus(
        currentPaymentTransactions || [],
        intercityBusFilter
      ),
    [currentPaymentTransactions, intercityBusFilter]
  );

  const handleIntercityBusChange = (value) => {
    setIntercityBusFilter(value || "");
  };

  const isTotalRow = (params) =>
    params?.node?.rowPinned === "bottom" || params?.data?.isTotal;

  const getPagePinnedBottomRowData = useCallback((displayedRows) => [
    {
      isTotal: true,
      orderID: "TOTAL",
      ticketQuantity: displayedRows.reduce(
        (sum, row) => sum + Number(row.ticketQuantity || 0),
        0,
      ),
      amount: displayedRows.reduce(
        (sum, row) => sum + Number(row.amount || row.totalAmount || 0),
        0,
      ),
    },
  ], []);

  const [columnDefs] = useState([
    {
      field: "sno",
      headerName: "S.NO",
      valueGetter: (params) => {
        if (isTotalRow(params)) return "";
        return params.node.rowIndex + 1;
      },
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "orderID",
      headerName: "ORDER ID",
      minWidth: 200,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return params.value || "TOTAL";
        return params.value ? params.value : "N/A";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "mobileNumber",
      headerName: "MOBILE NUMBER",
      minWidth: 120,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "ticketQuantity",
      headerName: "TICKET QUANTITY",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params))
          return params.value || params.value === 0 ? params.value : "";
        return params.value || params.value === 0 ? params.value : "N/A";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      maxWidth: 100,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params))
          return params.value || params.value === 0 ? `₹${params.value}` : "";
        return params.value || params.value === 0 ? `₹${params.value}` : "N/A";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "purchaseDate",
      headerName: "PURCHASE DATE",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        if (!params?.value) return "N/A";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return "N/A";
        return (
          date.toLocaleDateString("en-IN") +
          " " +
          date.toLocaleTimeString("en-IN")
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "PAYMENT STATUS",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params?.value || "N/A";
      },
    },
    {
      field: "actualPaymentStatus",
      headerName: "ACTUAL PAYMENT STATUS",
      maxWidth: 200,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params?.value || "N/A";
      },
    },
    {
      field: "refundDate",
      headerName: "REFUND DATE",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        if (!params?.value) return "N/A";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return "N/A";
        return (
          date.toLocaleDateString("en-IN") +
          " " +
          date.toLocaleTimeString("en-IN")
        );
      },
    },
    {
      field: "refundId",
      headerName: "REFUND ID",
      minWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || params.value === 0 ? params.value : "N/A";
      },
    },
    {
      field: "refundStatus",
      headerName: "REFUND STATUS",
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || params.value === 0 ? params.value : "N/A";
      },
    },
    // {
    //   field: "VerifyTicket",
    //   headerName: "VERIFY TICKET",
    //   maxWidth: 140,
    //   headerClass: "text-blue-v2",
    //   cellRenderer: (params) => {
    //     const isDisabled = !params.data.verifyStatus;
    //     // || params.data.isTicketGe nerated;

    //     return (
    //       <div className="flex justify-center mt-1 ">
    //         <button
    //           className={`px-4 py-2 text-xs font-semibold uppercase rounded-md transition-all duration-200 ${
    //             isDisabled
    //               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    //               : "bg-blue-v2 text-white hover:bg-blue-v1"
    //           }`}
    //           onClick={() => {
    //             if (!isDisabled) {
    //               setVerifyData(params.data.orderID);
    //               setOpenVerifyModal(true);
    //             }
    //           }}
    //           disabled={isDisabled}
    //         >
    //           Verify Status
    //         </button>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   field: "VerifyTicket",
    //   headerName: "GENERATE TICKET",
    //   maxWidth: 160,
    //   headerClass: "text-blue-v2",
    //   cellRenderer: (params) => {
    //     const isDisabled = !params.data.generateTicket;
    //     // || params.data.isTicketGenerated;

    //     return (
    //       <div className="flex justify-center mt-1">
    //         <button
    //           className={`px-4 py-2 text-xs font-semibold uppercase rounded-md transition-all duration-200 ${
    //             isDisabled
    //               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    //               : "bg-blue-v2 text-white hover:bg-blue-v1"
    //           }`}
    //           onClick={() => {
    //             if (!isDisabled) {
    //               setRegenerateTicketData(params.data);
    //               setOpenRegenerateTicketModal(true);
    //             }
    //           }}
    //           disabled={isDisabled}
    //         >
    //           Generate Ticket
    //         </button>
    //       </div>
    //     );
    //   },
    // },
    {
      headerName: "INITIATE REFUND",
      field: "InitiateRefund",
      maxWidth: 130,
      //   hide: email === "esdadmin@gmail.com",
      cellRenderer: (params) => {
        if (isTotalRow(params)) return "";
        // console.log("params",params)
        const isDisabled = !params.data.canBeRefundInitiate;
        return (
          <div className="flex justify-center mt-1">
            <>
              <button
                className={`px-4 py-2 text-xs font-semibold uppercase rounded-md transition-all duration-200 ${isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-v2 text-white hover:bg-blue-v1"
                  }`}
                disabled={isDisabled}
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
      field: "actions",
      headerName: "TICKET",
      maxWidth: 160,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        if (isTotalRow(params)) return "";
        const pnr =
          params.data?.BookingID && params.data?.BookingID !== "N/A"
            ? params.data.BookingID
            : params.data?.bookingID && params.data?.bookingID !== "N/A"
              ? params.data.bookingID
              : null;

        return (
          <div className="flex justify-center mt-1">
            {pnr ? (
              <NavLink
                end
                to={`/current-ticket-view-details/${pnr}`}
                className="bg-blue-v2 text-white hover:bg-blue-v1 px-4 uppercase py-2 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                title="View ticket"
              >
                <span className="text-white uppercase">Onwards Journey</span>
              </NavLink>
            ) : (
              <span className="text-gray-400 uppercase">Not available</span>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "TICKET",
      maxWidth: 160,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        if (isTotalRow(params)) return "";
        const returnPnr =
          params.data?.returnPNRNumber &&
            params.data?.returnPNRNumber !== "N/A"
            ? params.data.returnPNRNumber
            : null;

        return (
          <div className="flex justify-center mt-1">
            {returnPnr ? (
              <NavLink
                end
                to={`/current-ticket-view-details/${returnPnr}`}
                className="bg-blue-v2 text-white hover:bg-blue-v1 px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                title="View ticket"
              >
                <span className="text-white uppercase">Return Journey</span>
              </NavLink>
            ) : (
              <span className="text-gray-400 uppercase">Not available</span>
            )}
          </div>
        );
      },
    },
  ]);
  const handleVerifyTicket = async () => {
    try {
      const res = await fetchCurrentVerifyStatus(verifyData);
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
        fetchCurrentPaymentTransactions({
          startDate: savedFilters?.fromDate ?? startOfDay,
          endDate: savedFilters?.toDate ?? endOfDay,
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
        });
      }, 2100);
    }
  };
  //   initiate refund
  const handleInitiateRefund = async () => {
    try {
      const res = await fetchCurrentPaymentTransactionRefund(RefundOrderId);
      console.log("API Response:", res);
      setInitiatRefundModal(false);
      if (res.response?.status === 200) {
        const resultMsg = res.response?.data?.refundStatus;
        console.log(resultMsg, "resultMsg");
        Swal.fire({
          title: `${resultMsg === "TXN_SUCCESS"
            ? "Success!"
            : resultMsg === "TXN_FAILURE"
              ? "Failed!"
              : "Info!"
            }`,

          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
              ${resultMsg}
            </div>`,

          confirmButtonText: "OK",
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
      setInitiatRefundModal(false);
      Swal.fire({
        title: "Failed!",
        text: `Refund failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      // Delay API call to ensure SweetAlert has closed
      setTimeout(() => {
        fetchCurrentPaymentTransactions({
          startDate: savedFilters?.fromDate ?? startOfDay,
          endDate: savedFilters?.toDate ?? endOfDay,
          paymentStatus: savedFilters?.paymentStatus
            ? savedFilters.paymentStatus
            : "",
          phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
          arrivalLocation: savedFilters?.arrivalLocation ? savedFilters.arrivalLocation : "",
          destinationLocation: savedFilters?.destinationLocation ? savedFilters.destinationLocation : "",
        });
      }, 2100);
    }
  };

  const handleRegenerateTicket = async () => {
    try {
      const res = await fetchCurrentRegenerateTicket(
        {
          "pnrNumber": RegenerateTicketData.returnPNRNumber ? RegenerateTicketData.returnPNRNumber : RegenerateTicketData.pnrNumber,
          "paymentTransactionId": RegenerateTicketData.orderID,
          "isReturnBooking": RegenerateTicketData.returnPNRNumber ? true : false,
          "isTicketReGenerate": true,
          "bookingDetailsId": RegenerateTicketData.bookingDetailsId,
          "tentativeBookingId": RegenerateTicketData.tentativebookingId
        }
      );
      console.log("Regenerate Ticket Response", res);
      setOpenRegenerateTicketModal(false);
      if (res.response?.status === 200) {
        const resultMsg = res.response?.data?.result?.message;
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
        ${err.response?.data?.result?.message}
      </div>`,
        title: "Failed!",
        text: `Regenerate ticket failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setOpenRegenerateTicketModal(false);
      // Delay API call to ensure SweetAlert has closed
      setTimeout(() => {
        fetchCurrentPaymentTransactions({
          startDate: savedFilters?.fromDate ?? startOfDay,
          endDate: savedFilters?.toDate ?? endOfDay,
          paymentStatus: savedFilters?.paymentStatus
            ? savedFilters.paymentStatus
            : "",
          phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
          arrivalLocation: savedFilters?.arrivalLocation ? savedFilters.arrivalLocation : "",
          destinationLocation: savedFilters?.destinationLocation ? savedFilters.destinationLocation : "",
        });
      }, 2100);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <CurrentPaymentTransactionsForm
          onIntercityBusChange={handleIntercityBusChange}
        />
        <AgGridTable
          ExportName="Current Payment Transactions"
          rowData={filteredPaymentTransactions || []}
          columnDefs={columnDefs}
          getPagePinnedBottomRowData={getPagePinnedBottomRowData}
          isFetchLoading={isFetchCurrentPaymentTransactionsLoading}
          showTotalCount={true}
          totalCount={filteredPaymentTransactions?.length || 0}
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
              {isFetchCurrentVerifyStatusLoading ? (
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
              {isFetchCurrentRegenerateTicketLoading ? (
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

export default CurrentPaymentTransactionsList;
