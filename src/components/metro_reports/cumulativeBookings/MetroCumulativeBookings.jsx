import { Field, Form, Formik } from "formik";
import AdminLayout from "../../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import AgGridTable from "../../tables/AgGridTable";
import { useMetroBookingStore } from "../../../store/metro_reports/metroBookingReportStore";
import { toast, ToastContainer } from "react-toastify";
import PopupModal from "../../utils/popup_modal/PopupModal";
import useAuthStore from "../../../store/authStore";
import Swal from "sweetalert2";
import { tailspin } from "ldrs";
import { IoIosRefresh } from "react-icons/io";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Import the default styles
tailspin.register();
import { FaRegEye } from "react-icons/fa";
const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  return date.toISOString().split("T")[0];
};
export default function MetroCumulativeBookings() {
  const storedUser = localStorage.getItem("Metro_Amount");
  const userObject = storedUser ? JSON.parse(storedUser) : "";
  const [openModal, setOpenModal] = useState(false);
  const [VerifyopenModal, setVerifyOpenModal] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const localRefreshMap = new Map();

  // console.log("settlementAmount", settlementAmount);

  const [Amount_Date, setAmount_Date] = useState({
    amount: "",
    date: "",
    remarks: "",
    settlementId: "",
  });
  const [SetteledDetails, setAmountSetteledDetails] = useState({});

  const {
    allMetroCumulativeBookingDetailsReports,
    fetchAllMetroCumulativeBookingDetailsReport,
    isFetchAllMetroCumulativeBookingDetailsReportsLoading,
    saveInitiateSettelementDetails,
    isSaveInitiatAmountLoading,
    savePaymentSettlement,
    isSavePaymentSettlementLoading,
    VerifySettlementAmount,
    RefreshButton,
    isSaveRefreshButtonLoading,
  } = useMetroBookingStore();
  const { decodedTokenData } = useAuthStore();
  console.log("isSaveRefreshButtotLoading", isSaveRefreshButtonLoading);
  const email = decodedTokenData?.data?.email;
  useEffect(() => {
    fetchAllMetroCumulativeBookingDetailsReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchAllMetroCumulativeBookingDetailsReport]);

  const initialValues = {
    // fromDate: userObject ? userObject.fromDate : getCurrentDate(),
    // toDate: userObject ? userObject.toDate : getCurrentDate(),

    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchAllMetroCumulativeBookingDetailsReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
    localStorage.setItem(
      "Metro_Amount",
      JSON.stringify({
        fromDate: values.fromDate,
        toDate: values.toDate,
      })
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (gridApi) {
        gridApi.refreshCells({
          force: true, // important to force re-render
          columns: ["actions"], // only refresh Actions column
        });
      }
    }, 10 * 1000); // every 10 seconds

    return () => clearInterval(interval); // cleanup
  }, [gridApi]);
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",

      maxWidth: "80",
      headerClass: "text-blue-v2",
    },

    {
      field: "travelDate",
      headerName: "Travel Date",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "noOfCancelTickets",
      maxWidth: "130",
      headerName: "Cancel Tickets",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "noOfConfirmTickets",
      headerName: "Confirm Tickets",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "noOfTickets",
      headerName: "Total Tickets",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalTicketFare",
      headerName: "Ticket Fare",
      maxWidth: "110",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalCancelledTicketFare",
      headerName: "Cancelled Ticket Fare",
      maxWidth: "170",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalConfirmedTicketFare",
      headerName: "Settlement Ticket Fare",
      maxWidth: "180",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "paytM_CONFIRMED_AMOUNT",
      headerName: "Paytm CONFIRMED AMOUNT",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "0",
    },
    {
      field: "verifiedAmount",
      headerName: "Amount Verified by Finance Team",
      Width: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "pendingVerifiedAmount",
      headerName: "Difference In verified  Amount",
      Width: "390",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "settledPaymentAmount",
      headerName: "Amount Settled by Finance Team",
      Width: "260",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "pendingSettledAmount",
      headerName: "Difference In Settled Amount",
      Width: "260",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },

    {
      field: "remarks",
      headerName: "Remarks",
      maxWidth: 160,
      hide: email === "esdadmin@gmail.com",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        return (
          <Tippy
            content={
              <div className="max-w-xs break-words p-2">
                <div>
                  <h1 className="text-xs">
                    Verified Amount:{" "}
                    <span>{params.data.verifiedAmount ?? "N/A"}</span>
                  </h1>
                </div>
                <div>
                  <h1 className="text-xs">
                    Settled Amount:{" "}
                    <span>{params.data.settledPaymentAmount ?? "N/A"}</span>
                  </h1>
                </div>
                <div>
                  <h1 className="text-sm">
                    Remarks: <span>{params.value ?? "N/A"}</span>
                  </h1>
                </div>
              </div>
            }
            placement="top"
            animation="fade"
            maxWidth={400}
            theme="custom" // Apply the custom theme
          >
            <span>
              <FaRegEye className="text-[24px] text-blue-v2 mt-2.5 " />
            </span>
          </Tippy>
        );
      },
    },

    {
      field: "utr",
      headerName: "UTR Number",
      maxWidth: "150",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value || params.value === " " ? params.value : "N/A",
    },
    {
      field: "utrprocessedtime",
      headerName: "UTR Processed Time",
      maxWidth: "180",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value || params.value == "N/A") return "N/A";
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
      field: "status",
      headerName: "Status",

      maxWidth: "150",
      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        params.value ? (
          <span
            className={`${
              params.value == "Settled"
                ? "text-green-900 bg-green-100 px-2 py-0.5 rounded-lg"
                : params.value == "In Progress"
                ? "text-orange-900 bg-orange-200 px-2 py-0.5 rounded-lg"
                : params.value == "Completed"
                ? "text-green-900 bg-green-200 px-2 py-0.5 rounded-lg"
                : params.value == "Verified"
                ? "text-green-900 bg-blue-200 px-2 py-0.5 rounded-lg"
                : "text-orange-700 bg-orange-100 px-2 py-0.5 rounded-lg"
            } font-normal`}
          >
            {params.value}
          </span>
        ) : (
          "0"
        ),
    },

    {
      headerName: "Actions",
      field: "actions",
      hide: email === "esdadmin@gmail.com",
      cellRenderer: (params) => {
        const settlementId = params.data.settlementId;

        // Use the last clicked time if available, else fall back to API-provided time
        const lastRefreshTimeStr =
          localRefreshMap.get(settlementId) || params.data.lastRefreshedDateTim;

        const lastRefreshTime = new Date(lastRefreshTimeStr);
        const now = new Date();
        const diffMins = (now - lastRefreshTime) / (1000 * 60);
        const isDisabled = diffMins < 1;

        if (isDisabled) {
          const timeout = 60 * 1000 - (now - lastRefreshTime);
          setTimeout(() => {
            params.api.refreshCells({
              rowNodes: [params.node],
              columns: ["actions"], // column field
              force: true,
            });
          }, timeout);
        }

        return (
          <div className="flex align-center gap-2">
            {email !== "esdfinancialadmin@meeseva.com" ? (
              <>
                <button
                  className={`${
                    params.data.status !== "Verified"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-400"
                  } text-white leading-normal px-2 py-1 mt-1.5 rounded-md`}
                  disabled={params.data.status !== "Verified"}
                  onClick={() => {
                    setOpenModal(true);
                    setAmount_Date({
                      ...Amount_Date,
                      amount: params.data.verifiedAmount,
                      date: params.data.travelDate,
                      settlementId: params.data.settlementId,
                    });
                    setAmountSetteledDetails({
                      ...SetteledDetails,
                      travelDate: params.data.travelDate,
                      noOfConfirmTickets: params.data.noOfConfirmTickets,
                      noOfCancelTickets: params.data.noOfCancelTickets,
                      noOfTickets: params.data.totalConfirmedTicketFare,
                      totalTicketFare: params.data.totalTicketFare,
                      amountToSettle: params.data.totalConfirmedTicketFare,
                      totalCancelledTicketFare:
                        params.data.totalCancelledTicketFare,
                      settlementId: params.data.settlementId,
                      payTmconfirmedAmount: params.data.paytM_CONFIRMED_AMOUNT,
                    });
                    setSettlementAmount(params.data.verifiedAmount);
                  }}
                >
                  Pay Now
                </button>
                {(params.data.status === "In Progress" ||
                  params.data.status === "Inquiry Initiated" ||
                  params.data.status === "Risk Validation in progress") && (
                  <button
                    className={`mt-2.5 `}
                    disabled={params.data.lastRefreshedDateTim || isDisabled}
                    onClick={() => {
                      HandleRefreshButton(
                        params.data.txnDate,
                        params.data.cbxapirefno,
                        params.data.settlementId
                      );

                      // Track local click to disable the button immediately
                      localRefreshMap.set(
                        settlementId,
                        new Date().toISOString()
                      );
                    }}
                  >
                    <span>
                      <IoIosRefresh
                        className={`text-[24px] text-blue-v2 ${
                          isDisabled ? "text-gray-300 cursor-not-allowed" : ""
                        }`}
                      />
                    </span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  className={`${
                    params.data.status !== "Not Settled"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-v2"
                  } text-white leading-normal px-2 py-1 mt-1.5 rounded-md`}
                  disabled={params.data.status !== "Not Settled"}
                  onClick={() => {
                    setVerifyOpenModal(true);
                    setAmount_Date({
                      ...Amount_Date,
                      amount: params.data.totalConfirmedTicketFare,
                      date: params.data.travelDate,
                    });
                    setAmountSetteledDetails({
                      ...SetteledDetails,
                      travelDate: params.data.travelDate,
                      noOfConfirmTickets: params.data.noOfConfirmTickets,
                      noOfCancelTickets: params.data.noOfCancelTickets,
                      noOfTickets: params.data.totalConfirmedTicketFare,
                      totalTicketFare: params.data.totalTicketFare,
                      amountToSettle: params.data.totalConfirmedTicketFare,
                      totalCancelledTicketFare:
                        params.data.totalCancelledTicketFare,
                      payTmconfirmedAmount: params.data.paytM_CONFIRMED_AMOUNT,
                    });
                    setSettlementAmount(params.data.totalConfirmedTicketFare);
                  }}
                >
                  Verify Now
                </button>
              </>
            )}
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);

  const handleInitiatAmount = async () => {
    const AmountPyload = {
      amount: `${String(Amount_Date.amount)}.00`,
      date: Amount_Date.date,
      id: Amount_Date.settlementId,
    };
    try {
      const res = await saveInitiateSettelementDetails(AmountPyload);

      const { cbX_API_REF_NO } = res?.data.data.data;
      const Payload = {
        id: SetteledDetails.settlementId,
        cbX_API_REF_NO: cbX_API_REF_NO,
        date: getCurrentDate(),
      };
      if (res.data.status == 200) {
        setTimeout(async () => {
          await RefreshButton(Payload);

          // After RefreshButton is called, then call the API
        }, 2000);
        Swal.fire({
          title: "Success!",
          html: `Payment of <b>Rs.${Amount_Date.amount}</b> has been Initiated Succesfully.`,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-custom-btn",
          },
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Call the API after the SweetAlert modal closes
          setTimeout(() => {
            // After RefreshButton, call the API
            fetchAllMetroCumulativeBookingDetailsReport({
              fromDate: userObject.fromDate || getCurrentDate(),
              toDate: userObject.toDate || getCurrentDate(),
            });
          }, 1000);
        });
      } else {
        Swal.fire({
          title: "Failed!",
          text: `Payment of <b>Rs.${Amount_Date.amount}</b> settlement failed. Please try again.`,
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          setTimeout(() => {
            // After RefreshButton, call the API
            fetchAllMetroCumulativeBookingDetailsReport({
              fromDate: userObject.fromDate || getCurrentDate(),
              toDate: userObject.toDate || getCurrentDate(),
            });
          }, 1000);
        });
      }
    } catch {
      Swal.fire({
        title: "Failed!",
        text: `Payment of Rs.${Amount_Date.amount} settlement failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        setTimeout(() => {
            // After RefreshButton, call the API
            fetchAllMetroCumulativeBookingDetailsReport({
              fromDate: userObject.fromDate || getCurrentDate(),
              toDate: userObject.toDate || getCurrentDate(),
            });
          }, 1000);
      });
    }
  };

  // verify amount

  const handleVerifySettlement = async () => {
    const verifyPayload = {
      ...SetteledDetails,
      verifiedAmount: `${String(Amount_Date.amount)}.00`,
      remarks: Amount_Date.remarks,
    };

    console.log("verifyPayload", verifyPayload);
    const res = await VerifySettlementAmount(verifyPayload);

    if (res.data.status == 200) {
      setVerifyOpenModal(false);

      Swal.fire({
        title: "Success!",
        html: `Payment of <b>Rs.${Amount_Date.amount}</b> has been Verified.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-custom-btn",
        },
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        // Call the API after the SweetAlert modal closes
        fetchAllMetroCumulativeBookingDetailsReport({
          fromDate: userObject.fromDate || getCurrentDate(),
          toDate: userObject.toDate || getCurrentDate(),
        });
      });
    } else {
      Swal.fire({
        title: "Failed!",
        text: `Payment of Rs.${Amount_Date.amount} settlement failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {});
    }
  };

  const HandleRefreshButton = async (Date, cbX_API_REF_NO, id) => {
    const convertDateFormat = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };

    const verifyPayload = {
      id: id,
      cbX_API_REF_NO: cbX_API_REF_NO,
      date: convertDateFormat(Date),
    };
    try {
      const res = await RefreshButton(verifyPayload);
      if (res.data.status == 200) {
        Swal.fire({
          title: "Success!",
          html: `Payment Intiation Refreshed Succesfully`,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-custom-btn",
          },
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Failed!",
          text: ` Please try again.`,
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {});
      }
    } catch {
      Swal.fire({
        title: "Failed!",
        text: ` Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {});
    }
  };

  const gridOptions = {
    getRowStyle: (params) => {
      if (params.data?.status === "Settled") {
        return { background: "rgb(105 255 178 / 20%)" };
      }
    },
  };
  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Bank Payments
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        {/* <SummaryReportList /> */}
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ values, setFieldValue, setValues }) => (
            <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
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
              <div className="flex gap-2 items-end">
                <button
                  type="submit"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  // disabled={isFetchAllParkBankTransactionsLoading}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  onClick={() => {
                    localStorage.removeItem("Metro_Amount");

                    setValues({
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                    });

                    fetchAllMetroCumulativeBookingDetailsReport({
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                    });
                  }}
                >
                  Reset
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <AgGridTable
          ExportName="Bank Payments"
          rowData={allMetroCumulativeBookingDetailsReports}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          isFetchLoading={isFetchAllMetroCumulativeBookingDetailsReportsLoading}
        />
      </div>
      {/* SETTLE POPUP */}
      <PopupModal
        popupModalId="first-modal"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            The amount to be settled is Rs.
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={Amount_Date.amount}
              className="w-[100px] h-[25px] border-none bg-gray-200 shadow-md rounded"
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");

                // if (value === "") {
                //   setAmount_Date((prev) => ({
                //     ...prev,
                //     amount: "",
                //   }));
                //   return;
                // }

                // let numericValue = Number(value);

                // if (numericValue > settlementAmount) {
                //   numericValue = settlementAmount;
                // }

                setAmount_Date((prev) => ({
                  ...prev,
                  amount: value,
                }));
              }}
            />
            <br /> Please confirm to proceed with settlement.
          </h1>

          <div className="flex justify-center gap-6 mt-4 z-30">
            <button
              onClick={async () => {
                await handleInitiatAmount();

                setOpenModal(false);
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              {isSaveInitiatAmountLoading ? (
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
              onClick={() => setOpenModal(false)}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>
      {/* VERIFY POPUP */};
      <PopupModal
        popupModalId="first-modal"
        isOpen={VerifyopenModal}
        onClose={() => setVerifyOpenModal(false)}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            The amount to be settled is Rs.
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={Amount_Date.amount}
              className="w-[100px] h-[25px] border-none bg-gray-200 shadow-md rounded"
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");

                // if (value === "") {
                //   setAmount_Date((prev) => ({
                //     ...prev,
                //     amount: "",
                //   }));
                //   return;
                // }

                // let numericValue = Number(value);

                // if (numericValue > settlementAmount) {
                //   numericValue = settlementAmount;
                // }

                setAmount_Date((prev) => ({
                  ...prev,
                  amount: value,
                }));
              }}
            />
            <br /> Please confirm to proceed with settlement.
          </h1>

          <div className=" flex justify-center mt-4">
            <textarea
              className="bg-gray-100 shadow-lg p-2 w-full rounded-md border-gray-300"
              placeholder="Remarks"
              value={Amount_Date.remarks}
              rows="3"
              maxLength={255}
              onChange={(e) => {
                setAmount_Date((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }));
              }}
            />
          </div>

          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              onClick={async () => {
                await handleVerifySettlement();
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              {isSavePaymentSettlementLoading ? (
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
              onClick={() => setVerifyOpenModal(false)}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>
    </AdminLayout>
  );
}
