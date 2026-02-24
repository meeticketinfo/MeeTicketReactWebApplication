import { Field, Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import {
  formatToCurrency,
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import { useBusPassTotalTransactionStore } from "../../../../../store/rtc_total_transaction_report_store/Total_transaction_reports_store/BusPassTotalTransactionStore";
import AgGridTable from "../../../../tables/AgGridTable";
import { NavLink } from "react-router-dom";
import ViewBusPass from "../../../components/ViewBusPass";
import PopupModal from "../../../../utils/popup_modal/PopupModal";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const BusPassBookingReportList = () => {
  const savedFilters = JSON.parse(
    localStorage.getItem("bus-pass-booking-report-filters")
  );
  const [isViewBusPassOpen, setIsViewBusPassOpen] = useState(false);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState(null);
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [RegeneratePassPayload, setRegeneratePassPayload] = useState(null);
  const [ViewTicketDetails, setViewTicketDetails] = useState({});

  const [openRegenerateTicketModal, setOpenRegenerateTicketModal] =
    useState(false);
  const {
    AllBusPassesData,
    fetchAllBusPasses,
    fetchRtcBusPassBookingData,
    RtcBusPassBookingRecordsData,
    isFetchRtcBusPassBookingData,
    fetchRtcBusPassVerifyStatusData,
    isFetchRtcBusPassVerifyStatusData,
    fetchRtcBusPassInitiateData,
    isFetchRtcBusPassInitiateData,
    fetchRtcGeneratePassData,
    isFetchRtcGeneratePassData,
  } = useBusPassTotalTransactionStore();
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    mobileNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
    transactionId: savedFilters?.transactionId
      ? savedFilters.transactionId
      : "",
    BusPassType: savedFilters?.BusPassType ? savedFilters.BusPassType : "",
    typeOfPayment: savedFilters?.typeOfPayment
      ? savedFilters.typeOfPayment
      : "",
    bookingStatus: savedFilters?.bookingStatus
      ? savedFilters.bookingStatus
      : "",
  };
  useEffect(() => {
    fetchAllBusPasses();
    fetchRtcBusPassBookingData({
      fromDate: savedFilters?.fromDate || "",
      toDate: savedFilters?.toDate || "",
      mobileNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
      transactionId: savedFilters?.transactionId
        ? savedFilters.transactionId
        : "",
      BusPassType: savedFilters?.BusPassType ? savedFilters.BusPassType : "",
      typeOfPayment: savedFilters?.typeOfPayment
        ? savedFilters.typeOfPayment
        : "",
      bookingStatus: savedFilters?.bookingStatus
        ? savedFilters.bookingStatus
        : "",
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

  const handleVerifyTicket = async () => {
    try {
      const res = await fetchRtcBusPassVerifyStatusData(verifyData);
      console.log("API Response:", res);

      if (res.response?.status === 200) {
        setOpenVerifyModal(false);
        const resultMsg = res.response?.data?.resultMsg;
        const resultStatus = res.response?.data?.resultStatus;
        Swal.fire({
          title: resultStatus,

          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
           ${resultMsg}
         </div>`,

          confirmButtonText: "OK",
          icon: resultStatus === "TXN_SUCCESS" ? "success" : "info",
          customClass: {
            confirmButton: "swal-custom-btn",
            popup: "elegant-swal-popup",
            icon: "small-swal-icon",
          },
          timer: 2500,
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
      setTimeout(() => {
        fetchRtcBusPassBookingData({
          fromDate: savedFilters?.fromDate || getCurrentDate(),
          toDate: savedFilters?.toDate || getCurrentDate(),
          mobileNumber: savedFilters?.phoneNumber
            ? savedFilters.phoneNumber
            : "",
          transactionId: savedFilters?.transactionId
            ? savedFilters.transactionId
            : "",
          BusPassType: savedFilters?.BusPassType
            ? savedFilters.BusPassType
            : "",
          typeOfPayment: savedFilters?.typeOfPayment
            ? savedFilters.typeOfPayment
            : "",
          bookingStatus: savedFilters?.bookingStatus
            ? savedFilters.bookingStatus
            : "",
          pageNumber: currentPage + 1,
          pageSize: PAGE_LIMIT,
        });
      }, 2100);
    }
  };

  //   initiate refund

  const handleInitiateRefund = async () => {
    try {
      const res = await fetchRtcBusPassInitiateData(RefundOrderId);
      console.log("API Response:", res);
      setInitiatRefundModal(false);
      if (res.response) {
        const resultMsg = res.response?.data?.resultMsg;
        const resultStatus = res.response?.data?.resultStatus;
        Swal.fire({
          title: "Success!",

          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
    ${res.response}
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
                ${res.response}
              </div>`,
          icon: "success",
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
      console.log("err", err);
      Swal.fire({
        title: "Failed!",
        text: err.response.data || "Refund failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      fetchRtcBusPassBookingData({
        fromDate: savedFilters?.fromDate || "",
        toDate: savedFilters?.toDate || "",
        mobileNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
        transactionId: savedFilters?.transactionId
          ? savedFilters.transactionId
          : "",
        BusPassType: savedFilters?.BusPassType ? savedFilters.BusPassType : "",
        typeOfPayment: savedFilters?.typeOfPayment
          ? savedFilters.typeOfPayment
          : "",
        bookingStatus: savedFilters?.bookingStatus
          ? savedFilters.bookingStatus
          : "",
        pageNumber: currentPage + 1,
        pageSize: PAGE_LIMIT,
      });
    }
  };

  const handleRegenerateTicket = async () => {
    try {
      const res = await fetchRtcGeneratePassData(RegeneratePassPayload);
      setOpenRegenerateTicketModal(false);
      if (res.response?.status === 200 || res.response?.Status === "200") {
        const resultMsg = res.response?.messageType;
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
        title: "Failed!",
        text: `Regenerate ticket failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setOpenRegenerateTicketModal(false);
      setTimeout(() => {
        fetchRtcBusPassBookingData({
          fromDate: savedFilters?.fromDate || "",
          toDate: savedFilters?.toDate || "",
          mobileNumber: savedFilters?.phoneNumber
            ? savedFilters.phoneNumber
            : "",
          transactionId: savedFilters?.transactionId
            ? savedFilters.transactionId
            : "",
          BusPassType: savedFilters?.BusPassType
            ? savedFilters.BusPassType
            : "",
          typeOfPayment: savedFilters?.typeOfPayment
            ? savedFilters.typeOfPayment
            : "",
          bookingStatus: savedFilters?.bookingStatus
            ? savedFilters.bookingStatus
            : "",
          pageNumber: currentPage + 1,
          pageSize: PAGE_LIMIT,
        });
      }, 2100);
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "S.No",
        headerName: "S.No",
        valueGetter: (params) =>
          currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
        minWidth: 80,
        maxWidth: 80,
        headerClass: "text-blue-v2",
      },
      {
        field: "transactionId",
        headerName: "Transaction ID",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "passTypeName",
        headerName: "Type of Bus passes",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      // ------------------
      // {
      //   field: "loginMobileNo",
      //   headerName: "Login Mobile No",
      //   // flex: 1,
      //   headerClass: "text-blue-v2",
      //   valueFormatter: (params) => (params.value ? params.value : "N/A"),
      // },
      {
        field: "userName",
        headerName: "User Name",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value?.toUpperCase() : "N/A"),
      },
      {
        field: "userMobileNo",
        headerName: "User Mobile No",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "orderId",
        headerName: "Order ID",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "bookingId",
        headerName: "Booking Id",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "bookingDate",
        headerName: "Booking Date",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          const SPECIAL_PASS_ID = "100";
          // use updatedDate for the special pass type; otherwise use bookingDate (params.value)
          const source = params.data?.passTypeId === SPECIAL_PASS_ID ? params.data?.updatedDate || params.value : params.value;
          if (!source) return "N/A";
          const date = new Date(source);
          if (isNaN(date.getTime())) return "N/A";
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
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
      {
        field: "totalAmount",
        headerName: "Total Amount",
        minWidth: 130, 
        maxWidth: 130,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A"),
      },
      {
        field: "settled_Date",
        headerName: "Settled Date",
        // flex: 1,
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
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
      {
        field: "settledamount",
        headerName: "Settled Amount",
        maxWidth: 150,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A"),
      },

      // {
      //   field: "payout_Date",
      //   headerName: "Payout Date",
      //   // maxWidth: 170,
      //   headerClass: "text-blue-v2",
      //   valueFormatter: (params) => {
      //     if (!params.value) return "N/A";
      //     const date = new Date(params.value);
      //     const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
      //     const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
      //     const year = date.getFullYear(); // Get year
      //     const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
      //     const formattedTime = date.toLocaleTimeString("en-US", {
      //       hour: "2-digit",
      //       minute: "2-digit",
      //       second: "2-digit",
      //       hour12: true,
      //     });
      //     return `${formattedDate} ${formattedTime}`;
      //   },
      //   // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      // },

      {
        field: "utr",
        headerName: "UTR",
        // minWidth: 130,
        maxWidth: 140,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
        // formatToCurrency(params.value, "INR", "en-IN") || "00:00",
      },


      {
        field: "utrprocessedtime",
        headerName: "Utr Processed Date",
        // maxWidth: 170,
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
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },

   

      {
        field: "busPassValidityStartTime",
        headerName: "Bus Pass Validity Start Date&Time",
        // maxWidth: 170,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          const SPECIAL_PASS_ID = "100";
          // use updatedDate for the special pass type; fall back to params.value
          const source = params.data?.passTypeId === SPECIAL_PASS_ID ? params.data?.updatedDate || params.value : params.value;
          if (!source) return "N/A";
          const date = new Date(source);
          if (isNaN(date.getTime())) return "N/A";
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
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
    
      {
        field: "busPassValidityEndTime",
        headerName: "Bus Pass Validity End Date&Time",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          const SPECIAL_PASS_ID = "100";
          // For the special pass type use updatedDate + 24 hours, otherwise use busPassValidityEndTime (params.value)
          let dateValue = null;
          if (params.data?.passTypeId === SPECIAL_PASS_ID) {
            if (!params.data?.updatedDate) return "N/A";
            const updated = new Date(params.data.updatedDate);
            if (isNaN(updated.getTime())) return "N/A";
            dateValue = new Date(updated.getTime() + 24 * 60 * 60 * 1000); // add 24 hours
          } else {
            if (!params.value) return "N/A";
            dateValue = new Date(params.value);
            if (isNaN(dateValue.getTime())) return "N/A";
          }

          const day = String(dateValue.getDate()).padStart(2, "0"); // Get day and pad with leading zero
          const month = String(dateValue.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
          const year = dateValue.getFullYear(); // Get year
          const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
          const formattedTime = dateValue.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
          return `${formattedDate} ${formattedTime}`;
        },
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
      // -------------------
      {
        field: "idCardAmount",
        headerName: "ID Card Amount",
        // minWidth: 130,
        maxWidth: 140,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          const SPECIAL_PASS_ID = "100";
          // Show N/A for the special pass type, otherwise format as currency
          if (params.data?.passTypeId === SPECIAL_PASS_ID) {
            return "N/A";
          }
          return params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A";
        },
      },
      {
        field: "busPassAmount",
        headerName: "Bus Pass Amount",
        maxWidth: 150,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? formatToCurrency(params.value, "INR", "en-IN") : "N/A"),
      },
    
      {
        field: "bookingStatus",
        headerName: "Booking  Status",
        minWidth: 160,
        maxWidth: 160,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "typeOfPass",
        headerName: "Type of  Pass",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },

      {
        field: "paymentMode",
        headerName: "Payment Type",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },

      {
        field: "currentPaymentStatus",
        headerName: "Payment Status",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "paytmPaymentStatus",
        headerName: "Actual Paytm Status",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
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
        field: "refundDate",
        headerName: "Refund Initiated Date",
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
        field: "VerifyTicket",
        headerName: "Verify Ticket",
        maxWidth: 140,
        headerClass: "text-blue-v2",
        cellRenderer: (params) => {
          const isDisabled = params.data.verifyStatus !== true;
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
                    setVerifyData(params.data.orderId);
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
        field: "GenerateTicket",
        headerName: "Generate Ticket",
        maxWidth: 160,
        headerClass: "text-blue-v2",
        cellRenderer: (params) => {
          const isDisabled = params.data.isRegenerateEligible !== true;
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
                    const finalPayload = true
                      ? params.data.bookingRequestJson
                      : params.data.renewalRequestJson;
                    setRegeneratePassPayload(finalPayload);
                    setOpenRegenerateTicketModal(true);
                  }
                }}
                disabled={isDisabled}
              >
                {params.data.isRenewal === true
                  ? "Generate Bus Pass (R)"
                  : "Generate Bus Pass"}
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
          const isDisabled = params.data.isRefundEligible !== true;

          // const isDisabled = true;
          return (
            <div className="flex justify-center mt-1">
              <>
                <button
                  className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                    isDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-v2 text-white hover:bg-blue-v1"
                  }`}
                  // disabled={params.data.refundStatus != "Not Refunded"}
                  onClick={() => {
                    setRefundOrderId(params.data.orderId);
                    setInitiatRefundModal(true);
                  }}
                  disabled={isDisabled}
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
        field: "action",
        headerName: "Action",
        maxWidth: 160,
        headerClass: "text-blue-v2",
        cellRenderer: (params) => {
          const isDisabled = !params.data.bookingId;
          return (
            <div className="flex justify-center mt-1">
              <button
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                  isDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-v2 text-white hover:bg-blue-v1"
                }`}
                onClick={() => {
                  setIsViewBusPassOpen(true);
                  setViewTicketDetails({
                    passId: params.data.bookingId,
                    data: params.data,
                  });
                }}
                disabled={isDisabled}
              >
                View Bus Pass
              </button>
            </div>
          );
        },
      },
    ],
    [currentPage, PAGE_LIMIT]
  );

  const onSubmit = (values, { resetForm }) => {
    fetchRtcBusPassBookingData({
      ...values,
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
    // toast.error("error.message");
    localStorage.setItem(
      "bus-pass-booking-report-filters",
      JSON.stringify(values)
    );
  };

  return (
    <div>
      <ToastContainer />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm, setValues }) => (
          <Form className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-3 py-3">
            {/* from date */}
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="date"
                name="fromDate"
                className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                // min={getCurrentDate()}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
                    // Automatically update toDate if it's earlier than fromDate
                    setFieldValue("toDate", fromDateValue);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-xs font-medium text-gray-700"
              >
                To Date
              </label>
              <Field
                type="date"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            {/* phone number */}
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile No
              </label>
              <Field
                type="text"
                maxLength="10"
                name="mobileNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter mobile number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric characters
                  }
                }}
              />
            </div>
            {/* transaction Status */}
            <div>
              <label
                htmlFor="transactionId"
                className="block text-xs font-medium text-gray-700"
              >
                Username/ID card number/Transaction ID
              </label>
              <Field
                type="text"
                name="transactionId"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter transaction ID"
              />
            </div>
            {/* bus pass type */}
            <div>
              <label
                htmlFor="BusPassType"
                className="block text-xs font-medium text-gray-700"
              >
                Bus Pass Type
              </label>
              <Field
                as="select"
                name="BusPassType"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  setFieldValue("BusPassType", e.target.value);
                }}
              >
                <option value="">All</option>
                {AllBusPassesData?.map((item) => (
                  <option value={item.passTypeId}>{item.passTypeName}</option>
                ))}
              </Field>
            </div>
            {/* type of payment */}
            <div>
              <label className="block text-sm font-medium">
                Type of Payment
              </label>
              <Field
                as="select"
                name="typeOfPayment"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select</option>

                {/* <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option> */}
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Other">Other</option>
                <option value="dc">DC</option>
                <option value="cc">CC</option>

              </Field>
            </div>
            {/* Booking Status */}
            <div>
              <label className="block text-sm font-medium">
                Booking Status
              </label>
              <Field
                as="select"
                name="bookingStatus"
                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
              >
                <option value="">Select</option>
                {/* <option value="Confirmed">Confirmed</option> */}
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </Field>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
                onClick={() => {
                  setValues({
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    mobileNumber: "",
                    transactionId: "",
                    BusPassType: "",
                    typeOfPayment: "",
                    bookingStatus: "",
                  });
                  fetchRtcBusPassBookingData({
                    fromDate: getCurrentDate(),
                    toDate: getCurrentDate(),
                    mobileNumber: "",
                    transactionId: "",
                    BusPassType: "",
                    typeOfPayment: "",
                    bookingStatus: "",
                    pageNumber: currentPage + 1,
                    pageSize: PAGE_LIMIT,
                  });
                  localStorage.removeItem("bus-pass-booking-report-filters");
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <AgGridTable
        ExportName="UserStatusTransactionReport"
        rowData={RtcBusPassBookingRecordsData}
        columnDefs={columnDefs}
        isFetchLoading={isFetchRtcBusPassBookingData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={RtcBusPassBookingRecordsData[0]?.totalCount}
        tableHeight={RtcBusPassBookingRecordsData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />

      <ViewBusPass
        isOpen={isViewBusPassOpen}
        onClose={() => setIsViewBusPassOpen(false)}
        AipData={ViewTicketDetails}
      />
      {/* verify */}
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
              {isFetchRtcBusPassVerifyStatusData ? (
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
              {isFetchRtcBusPassInitiateData ? (
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
              {isFetchRtcGeneratePassData ? (
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
};

export default BusPassBookingReportList;
