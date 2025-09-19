import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import {
  formatToStandardDate,
  formatToCurrency,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import Select from "react-select";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import PopupModal from "../../../../components/utils/popup_modal/PopupModal";
import Swal from "sweetalert2";
import { AiOutlineEye } from "react-icons/ai";
import AmrabadPosTransactionForm from "./AmrabadPosTransactionForm";
function AmrabadPosTransactionList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState("");
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [RegenerateTicketOrderId, setRegenerateTicketOrderId] = useState("");
  const [openRegenerateTicketModal, setOpenRegenerateTicketModal] = useState(false);
  const {
    isAmrabadTransactionPaymentReportsLoading,
    allAmrabadTransactionPaymentReports,
    fetchAmrabadPaymentTransactions,
    fetchAmrabadVerifyStatus,
    isFetchAmrabadVerifyStatusLoading,
    fetchAmrabadPaymentTransactionRefund,
    isFetchAmrabadPaymentTransactionRefundLoading,
    fetchAmrabadRegenerateTicket,
    isFetchAmrabadRegenerateTicketLoading
  } = useAmrabadConsolidatedStore();
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-payment-report-filters")
  );

  const staticPosTransactions = {
    totalCount: 5,
    data: [
      {
        sNo: 1,
        posTransactionId: "POS202509190001",
        transactionDateTime: "2025-09-19 09:20:21",
        posMachineId: "AMR001",
        location: "Amrabad",
        operatorMobileNumber: "7330764646",
        ticketType: "2-Wheeler",
        ticketNumber: "TKT20250919001",
        totalAmount: 50.0,
        paymentMethod: "Cash",
        transactionStatus: "SUCCESS",
        customerVehicleNumber: "TS09AB1234",
        customerMobileNumber: "9000011122",
        rowNum: 1,
        pageRowNum: 1,
      },
      {
        sNo: 2,
        posTransactionId: "POS202509190002",
        transactionDateTime: "2025-09-19 09:35:10",
        posMachineId: "AMR001",
        location: "Amrabad",
        operatorMobileNumber: "7330764646",
        ticketType: "4-Wheeler",
        ticketNumber: "TKT20250919002",
        totalAmount: 200.0,
        paymentMethod: "UPI",
        transactionStatus: "FAILED",
        customerVehicleNumber: "TS10CD5678",
        customerMobileNumber: "9000022233",
        rowNum: 2,
        pageRowNum: 2,
      },
      {
        sNo: 3,
        posTransactionId: "POS202509190003",
        transactionDateTime: "2025-09-19 10:00:05",
        posMachineId: "AMR001",
        location: "Amrabad",
        operatorMobileNumber: "7330770538",
        ticketType: "Bus",
        ticketNumber: "TKT20250919003",
        totalAmount: 1000.0,
        paymentMethod: "Card",
        transactionStatus: "SUCCESS",
        customerVehicleNumber: "AP29EF9999",
        customerMobileNumber: "9000033344",
        rowNum: 3,
        pageRowNum: 3,
      },
      {
        sNo: 4,
        posTransactionId: "POS202509190004",
        transactionDateTime: "2025-09-19 10:15:45",
        posMachineId: "AMR002",
        location: "Amrabad",
        operatorMobileNumber: "7330770538",
        ticketType: "2-Wheeler",
        ticketNumber: "TKT20250919004",
        totalAmount: 50.0,
        paymentMethod: "UPI",
        transactionStatus: "SUCCESS",
        customerVehicleNumber: "TS07GH4567",
        customerMobileNumber: "9000044455",
        rowNum: 4,
        pageRowNum: 4,
      },
      {
        sNo: 5,
        posTransactionId: "POS202509190005",
        transactionDateTime: "2025-09-19 10:30:30",
        posMachineId: "AMR002",
        location: "Amrabad",
        operatorMobileNumber: "7330764646",
        ticketType: "4-Wheeler",
        ticketNumber: "TKT20250919005",
        totalAmount: 200.0,
        paymentMethod: "Cash",
        transactionStatus: "PENDING",
        customerVehicleNumber: "TS11IJ8765",
        customerMobileNumber: "9000055566",
        rowNum: 5,
        pageRowNum: 5,
      },
    ],
  };

  useEffect(() => {
    fetchAmrabadPaymentTransactions({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      purchaseOrBooking: savedFilters?.purchaseOrBooking ?? "Purchase",
      package: savedFilters?.package ?? "",
      house: savedFilters?.house ?? "",
      paymentStatus: savedFilters?.paymentStatus? savedFilters.paymentStatus: "",
      // paymentMode: savedFilters?.paymentMode ? savedFilters.paymentMode : "",
      modeOfBooking:savedFilters?.modeOfBooking ? savedFilters.modeOfBooking : "",
      phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
      transactionId: savedFilters?.transactionId? savedFilters.transactionId: "",
      PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  }, [fetchAmrabadPaymentTransactions,currentPage, PAGE_LIMIT]);

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
      field: "posTransactionId",
      headerName: "POS Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionDateTime",
      headerName: "Transaction Date & Time",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "posMachineId",
      headerName: "POS Machine ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "location",
      headerName: "Location",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "operatorMobileNumber",
      headerName: "Login Mobile number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "ticketType",
      headerName: "Ticket Type",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "ticketNumber",
      headerName: "Ticket Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A",
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "customerVehicleNumber",
      headerName: "Vehicle Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "customerMobileNumber",
      headerName: "User Mobile Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
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
        const resultStatus = res.response?.data?.data?.resultStatus;
        
        if (resultStatus === "TXN_FAILURE") {
          Swal.fire({
            title: "Transaction Failed!",
            html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
             ${resultStatus}
           </div>`,
            confirmButtonText: "OK",
            icon: "error",
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
            title: "Success!",
            html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
             ${resultStatus}
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
        }
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
          purchaseOrBooking: savedFilters?.purchaseOrBooking ?? "Purchase",
          package: savedFilters?.package ?? "",
          house: savedFilters?.house ?? "",
          paymentStatus: savedFilters?.paymentStatus
            ? savedFilters.paymentStatus
            : "",
          // paymentMode: savedFilters?.paymentMode
          //   ? savedFilters.paymentMode
          //   : "",
          modeOfBooking: savedFilters?.modeOfBooking
            ? savedFilters.modeOfBooking
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

  const handleRegenerateTicket = async () => {
    try {
      const res = await fetchAmrabadRegenerateTicket({orderId:RegenerateTicketOrderId});
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
      }
      else {
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
    }
    catch (err) {
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
    }
    finally {
      setOpenRegenerateTicketModal(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <AmrabadPosTransactionForm
          PageIndex={1}
          pageSize={PAGE_LIMIT}
          SetcurrentPage={setCurrentPage}
        />
        <AgGridTable
          ExportName="Payment Transactions"
          rowData={staticPosTransactions.data}
          columnDefs={columnDefs}
          isFetchLoading={isAmrabadTransactionPaymentReportsLoading}
          isPagination={false}
          tableHeight={
            staticPosTransactions.data.length > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={staticPosTransactions.totalCount}
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

export default AmrabadPosTransactionList;