import { Field, Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import {
  formatToCurrency,
  getCurrentDate,
} from "../../../../../utils/TypographyHelper";
import { useBusPassTotalTransactionStore } from "../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";
import AgGridTable from "../../../../tables/AgGridTable";
import { NavLink } from "react-router-dom";
import ViewBusPass from "../../../components/ViewBusPass";
import PopupModal from "../../../../utils/popup_modal/PopupModal";

const obj = [
  {
    paymentTransactionID: "1234567890",
    "Type of Bus passes": "1234567890",
    "Login Mobile No": "1234567890",
    userName: "1234567890",
    "User Mobile No": "1234567890",
    "Order ID": "1234567890",
    "Booking Date": "1234567890",
    "Bus Pass Validity Start Time": "1234567890",
    "Bus Pass Validity End Time": "1234567890",
    "ID Card Amount": "1234567890",
    "Bus Pass Amount": "1234567890",
    "Total Amount": "1234567890",
    "Booking  Status": "1234567890",
    "Type of  Pass": "1234567890",
    paymentType: "1234567890",
    paymentStatus: "1234567890",
    actualPaytmStatus: "1234567890",
  },
];

const BusPassBookingReportList = () => {
  const [isViewBusPassOpen, setIsViewBusPassOpen] = useState(false);
  const savedFilters = JSON.parse(
    localStorage.getItem("bus-pass-booking-report-filters")
  );
  const { AllBusPassesData, fetchAllBusPasses } =
    useBusPassTotalTransactionStore();
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);

  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState("");
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [RegenerateTicketOrderId, setRegenerateTicketOrderId] = useState("");
  const [openRegenerateTicketModal, setOpenRegenerateTicketModal] =
    useState(false);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
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
  }, []);

  // const handleVerifyTicket = async () => {
  //   try {
  //     const res = await fetchAmrabadVerifyStatus(verifyData);
  //     // console.log("API Response:", res);

  //     if (res.response?.data?.status === 200) {
  //       setOpenVerifyModal(false);
  //       const resultMsg = res.response?.data?.data?.resultStatus;

  //       Swal.fire({
  //         title: "Success!",

  //         html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
  //          ${resultMsg}
  //        </div>`,

  //         confirmButtonText: "OK",
  //         icon: "success",
  //         customClass: {
  //           confirmButton: "swal-custom-btn",
  //           popup: "elegant-swal-popup",
  //           icon: "small-swal-icon",
  //         },
  //         timer: 2000,
  //         width: "360px",
  //         showConfirmButton: false,
  //       });
  //     } else {
  //       setOpenVerifyModal(false);
  //       Swal.fire({
  //         // title: "Oops!",
  //         html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
  //          ${res.response?.data?.data?.resultMsg || res.response?.data?.message}
  //        </div>`,
  //         icon: "info",
  //         width: "360px",

  //         customClass: {
  //           popup: "custom-swal-popup",
  //           confirmButton: "swal-custom-btn",
  //           icon: "small-swal-icon",
  //         },
  //         confirmButtonText: "OK",
  //         background: "#ffffff",
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error during verify:", err);
  //     setOpenVerifyModal(false);
  //     Swal.fire({
  //       title: "Failed!",
  //       text: `Verify failed. Please try again.`,
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {

  //     setTimeout(() => {
  //       fetchAmrabadPaymentTransactions({
  //         startDate: savedFilters?.fromDate ?? getCurrentDate(),
  //         endDate: savedFilters?.toDate ?? getCurrentDate(),
  //         purchaseOrBooking: savedFilters?.purchaseOrBooking ?? "Purchase",
  //         package: savedFilters?.package ?? "",
  //         house: savedFilters?.house ?? "",
  //         paymentStatus: savedFilters?.paymentStatus
  //           ? savedFilters.paymentStatus
  //           : "",

  //         modeOfBooking: savedFilters?.modeOfBooking
  //           ? savedFilters.modeOfBooking
  //           : "",
  //         phoneNumber: savedFilters?.phoneNumber
  //           ? savedFilters.phoneNumber
  //           : "",
  //         transactionId: savedFilters?.transactionId
  //           ? savedFilters.transactionId
  //           : "",
  //         PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
  //         pageSize: PAGE_LIMIT,
  //       });
  //     }, 2100);
  //   }
  // };
  //   initiate refund

  // const handleInitiateRefund = async () => {

  //     try {
  //       const res = await fetchAmrabadPaymentTransactionRefund({orderId:RefundOrderId});
  //       console.log("API Response:", res);
  //       setInitiatRefundModal(false);
  //       if (res.response?.status === 200) {
  //         const resultMsg = res.response?.data?.message;

  //         Swal.fire({
  //           title: "Success!",

  //           html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
  //               ${resultMsg}
  //             </div>`,

  //           confirmButtonText: "OK",
  //           icon: "success",
  //           customClass: {
  //             confirmButton: "swal-custom-btn",
  //             popup: "elegant-swal-popup",
  //             icon: "small-swal-icon",
  //           },
  //           timer: 2000,
  //           width: "360px",
  //           showConfirmButton: false,
  //         });
  //       } else {
  //         setInitiatRefundModal(false);
  //         Swal.fire({
  //           html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
  //               ${res.response?.data?.message}
  //             </div>`,
  //           icon: "info",
  //           width: "360px",

  //           customClass: {
  //             popup: "custom-swal-popup",
  //             confirmButton: "swal-custom-btn",
  //             icon: "small-swal-icon",
  //           },
  //           confirmButtonText: "OK",
  //           background: "#ffffff",
  //         });
  //       }
  //     } catch (err) {
  //       setInitiatRefundModal(false);
  //       Swal.fire({
  //         title: "Failed!",
  //         text: `Refund failed. Please try again.`,
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     } finally {

  //     }
  //   };

  // const handleRegenerateTicket = async () => {
  //   try {
  //     const res = await fetchAmrabadRegenerateTicket({orderId:RegenerateTicketOrderId});
  //     console.log("API Response:", res);
  //     setOpenRegenerateTicketModal(false);
  //     if (res.response?.status === 200) {
  //       const resultMsg = res.response?.data?.message;
  //       Swal.fire({
  //         title: "Success!",
  //         html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
  //             ${resultMsg}
  //           </div>`,
  //         confirmButtonText: "OK",
  //         icon: "success",
  //         customClass: {
  //           confirmButton: "swal-custom-btn",
  //           popup: "elegant-swal-popup",
  //           icon: "small-swal-icon",
  //         },
  //         timer: 2000,
  //         width: "360px",
  //         showConfirmButton: false,
  //       });
  //     }
  //     else {
  //       setOpenRegenerateTicketModal(false);
  //       Swal.fire({
  //         html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
  //             ${res.response?.data?.message}
  //           </div>`,
  //         icon: "info",
  //         width: "360px",
  //         customClass: {
  //           popup: "custom-swal-popup",
  //           confirmButton: "swal-custom-btn",
  //           icon: "small-swal-icon",
  //         },
  //         confirmButtonText: "OK",
  //         background: "#ffffff",
  //       });
  //     }
  //   }
  //   catch (err) {
  //     console.error("Error during regenerate ticket:", err);
  //     setOpenRegenerateTicketModal(false);
  //     Swal.fire({
  //       title: "Failed!",
  //       text: `Regenerate ticket failed. Please try again.`,
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  //   finally {
  //     setOpenRegenerateTicketModal(false);
  //   }
  // };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
        minWidth: 80,
        maxWidth: 80,
        headerClass: "text-blue-v2",
      },
      {
        field: "paymentTransactionID",
        headerName: "Transaction ID",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "Type of Bus passes",
        headerName: "Type of Bus passes",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      // ------------------
      {
        field: "Login Mobile No",
        headerName: "Login Mobile No",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "userName",
        headerName: "User Name",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "User Mobile No",
        headerName: "User Mobile No",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },

      {
        field: "Order ID",
        headerName: "Order ID",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },

      {
        field: "Booking Date",
        headerName: "Booking Date",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
      {
        field: "Bus Pass Validity Start Time",
        headerName: "Bus Pass Validity Start Time",
        // maxWidth: 170,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
      {
        field: "Bus Pass Validity End Time",
        headerName: "Bus Pass Validity End Time",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
        // valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
      // -------------------

      {
        field: "ID Card Amount",
        headerName: "ID Card Amount",
        // minWidth: 130,
        maxWidth: 140,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
        // formatToCurrency(params.value, "INR", "en-IN") || "00:00",
      },
      {
        field: "Bus Pass Amount",
        headerName: "Bus Pass Amount",
        maxWidth: 150,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
        // formatToCurrency(params.value, "INR", "en-IN") || "00:00",
      },
      {
        field: "Total Amount",
        headerName: "Total Amount",
        minWidth: 130,
        maxWidth: 130,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
        // formatToCurrency(params.value, "INR", "en-IN") || "00:00",
      },
      {
        field: "Booking  Status",
        headerName: "Booking  Status",
        minWidth: 160,
        maxWidth: 160,
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },

      {
        field: "Type of  Pass",
        headerName: "Type of  Pass",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },

      {
        field: "paymentType",
        headerName: "Payment Type",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },

      {
        field: "paymentStatus",
        headerName: "Payment Status",
        // flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "actualPaytmStatus",
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
        field: "refund_Intiate_Date",
        headerName: "Refund Initiated Date",
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
        field: "GenerateTicket",
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
                    setRegenerateTicketOrderId(params.data.transaactionID);
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
        field: "Action",
        headerName: "Action",
        maxWidth: 160,
        headerClass: "text-blue-v2",
        cellRenderer: (params) => {
          // const isDisabled = params.data.isTicketGenerated;
          // || params.data.isTicketGenerated;

          return (
            <div className="flex justify-center mt-1">
              <button
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                  false
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-v2 text-white hover:bg-blue-v1"
                }`}
                onClick={() => {
                  setIsViewBusPassOpen(true);
                }}
                disabled={false}
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
    console.log("values", values);

    localStorage.setItem(
      "bus-pass-booking-report-filters",
      JSON.stringify(values)
    );
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
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

                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Other">Other</option>
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
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Initiated">Initiated</option>
                <option value="In Process">In Process</option>
                <option value="Cancelled">Cancelled</option>
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
        rowData={obj}
        columnDefs={columnDefs}
        // isFetchLoading={isRtcTotalTransactionsLoading}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        // totalCount={allBusPassBookingReports[0]?.totalCount}
        // tableHeight={RtcTotalTransactionsData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
      />

      <ViewBusPass
        isOpen={isViewBusPassOpen}
        onClose={() => setIsViewBusPassOpen(false)}
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
