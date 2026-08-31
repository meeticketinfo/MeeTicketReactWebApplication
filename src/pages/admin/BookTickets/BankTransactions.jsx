import { Field, Form, Formik } from "formik";
import AdminLayout from "../../../layouts/AdminLayout";
import { useSummaryReportStore } from "../../../store/metro_reports/summaryReportStore";
import { useEffect, useState } from "react";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import AgGridTable from "../../../components/tables/AgGridTable";
import { useParkStore } from "../../../store/masters/parksStore";
import { FiEdit } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import useAuthStore from "../../../store/authStore";
import { useEntityTypesStore } from "../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../store/masters/departmentTypesStore";
import Select from "react-select";
import Swal from "sweetalert2";
import { useparksBankPaymentStore } from "../../../store/reports/parksBankPaymentStore";
import { formatDate } from "../../../utils/Helper";
import { IoIosRefresh } from "react-icons/io";
import Tippy from "@tippyjs/react";
import { FaRegEye } from "react-icons/fa6";
import ForestDeptDepartmentSync from "../../../components/common/ForestDeptDepartmentSync";
export default function BankTransactions() {
  const storedUser = localStorage.getItem("park_Amount");
  const userObject = storedUser ? JSON.parse(storedUser) : "";
  const [openModal, setOpenModal] = useState(false);
  const [VerifyopenModal, setVerifyOpenModal] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState("");
  const [Amount_Date, setAmount_Date] = useState({
    amount: "",
    date: "",
    remarks: "",
    settlementId: "",
  });
  const [verifyDetails, setVerifyDetails] = useState({});
  const [SetteledDetails, setAmountSetteledDetails] = useState({});
  console.log("SetteledDetails", SetteledDetails);
  const {
    isSaveVerifySettlementAmountLoading,
    VerifySettlementAmount,
    saveInitiateSettelementDetails,
    RefreshButton,
    isSaveInitiatAmountLoading,
  } = useparksBankPaymentStore();
  const {
    allParkBankTransactions,
    fetchParkBankTransactions,
    isFetchAllParkBankTransactionsLoading,
    allParks,
    fetchAllParks,
  } = useParkStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  const { decodedTokenData, roleDetails } = useAuthStore();

  const email = decodedTokenData?.data?.email;
  const role = roleDetails?.name;
  const forestDepartment = allDepartmentTypes?.find(
    (dept) => dept.isActive && dept.departmentName === "Forest Department"
  );
  const forestDepartmentId = forestDepartment?.departmentId;
  const localRefreshMap = new Map();
  useEffect(() => {
    fetchParkBankTransactions({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      departmentId: "",
      entityTypeId: "",
      ParkId: "",
    });
  }, [fetchParkBankTransactions]);
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    entityId: "",
    departmentId: "",
    ParkId: "",
  };
  const onSubmit = (values) => {
    console.log("values", values);
    fetchParkBankTransactions({
      fromDate: values.fromDate,
      toDate: values.toDate,
      departmentId: values.departmentId,
      entityTypeId: values.entityId,
      ParkId: values.ParkId,
    });
    localStorage.setItem(
      "park_Amount",
      JSON.stringify({
        fromDate: values.fromDate,
        toDate: values.toDate,
        departmentId: values.departmentId,
        entityTypeId: values.entityId,
        ParkId: values.ParkId,
      })
    );
  };
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        `${formatToStandardDate(params.value)} ` || "N/A",
    },
    {
      field: "parkName",
      headerName: "Location Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "entityTypeName",
      headerName: "Location Category",
      maxWidth: "180",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "bookings",
      headerName: "Bookings",
      maxWidth: "110",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      maxWidth: "110",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "cashCollectedAmount",
      headerName: "Collected Cash Amount",
      headerClass: "text-blue-v2",
      maxWidth: "180",
      cellRenderer: (params) =>
        params.value ? (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) : (
          "0"
        ),
    },
    {
      field: "upiCollectedAmount",
      headerName: "Collected UPI Amount",
      headerClass: "text-blue-v2",
      maxWidth: "180",
      cellRenderer: (params) =>
        params.value ? (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) : (
          "0"
        ),
    },
    {
      field: "totalAmount",
      headerName: "Settlement Total Amount",
      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        params.value ? (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) : (
          "0"
        ),
    },
    {
      field: "verifiedAmount",
      headerName: " Verified Amount",
      headerClass: "text-blue-v2",
      maxWidth: "140",
      cellRenderer: (params) =>
        params.value ? (
          <>
            <span>Rs. </span>
            <span>{params.value}</span>
          </>
        ) : (
          " N/A"
        ),
    },
    {
      field: "pendingVerifiedAmount",
      headerName: "Difference In Verified  Amount",
      Width: "390",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "settledPaymentAMount",
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
    // remarks
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
                    <span>{params.data.settledPaymentAMount ?? "N/A"}</span>
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
      maxWidth: "160",
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

    // status
    {
      field: "status",
      headerName: "Status",

      maxWidth: "150",
      headerClass: "text-blue-v2",
      cellRenderer: (params) =>
        params.value ? (
          <span
            className={`${params.value == "Settled"
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

        if (params.data?.departmentId === 28 || params.data?.parK_ID === "100") {
          return <span className="text-center text-red-500 text-xs font-bold ">HMDA / Zoo Park</span>;
        }
        const settlementId = params.data.settlementId;

        // Use the last clicked time if available, else fall back to API-provided time
        const lastRefreshTimeStr =
          localRefreshMap.get(settlementId) || params.data.lastRefreshedDateTim;

        const lastRefreshTime = new Date(lastRefreshTimeStr);
        const now = new Date();
        const diffMins = (now - lastRefreshTime) / (1000 * 60);
        const isDisabled = diffMins < 30;

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
                  className={`${params.data.status !== "Verified"
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
                      parkId: params.data.parK_ID,
                    });
                    setSettlementAmount(params.data.verifiedAmount);
                  }}
                >
                  Pay Now
                </button>
                {params.data.status !== "Verified" &&
                  params.data.status !== "Not Settled" &&
                  params.data.status !== "Completed" &&
                  params.data.status !== "Processed" &&
                  params.data.status !== "No Settlement" &&
                  params.data.status !== "SettledByPayTM" && (
                    <button
                      className={`mt-2.5 `}
                      disabled={params.data.lastRefreshedDateTim || isDisabled}
                      onClick={() => {
                        HandleRefreshButton(
                          params.data.txnDate,
                          params.data.cbxapirefno,
                          params.data.settlementId,
                          params.data.parK_ID
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
                          className={`text-[24px] text-blue-v2 ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""
                            }`}
                        />
                      </span>
                    </button>
                  )}
              </>
            ) : (
              <>
                <button
                  className={`${params.data.status === "Not Settled"
                      ? "bg-blue-v2"
                      : "bg-gray-300 cursor-not-allowed"
                    } text-white leading-normal px-2 py-1 mt-1.5 rounded-md`}
                  disabled={params.data.status != "Not Settled"}
                  onClick={() => {
                    setVerifyOpenModal(true);
                    setAmount_Date({
                      ...Amount_Date,
                      amount: params.data.totalAmount,
                      date: params.data.travelDate,
                    });
                    setVerifyDetails({
                      ...verifyDetails,
                      parkId: params.data.parK_ID,
                      bookingDate: formatDate(params.data.bookingDate),
                      bookings: params.data.bookings?.toString() || "",
                      quantity: params.data.quantity,
                      parkName: params.data.parkName,
                      cashCollectedAmount: params.data.cashCollectedAmount,
                      totalAmount: params.data.totalAmount,
                      upiCollectedAmount: params.data.upiCollectedAmount,
                      paymentConfirmedAmount:
                        params.data.paymentConfirmedAmount,
                    });
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
      settlementId: Amount_Date.settlementId,
      parkId: SetteledDetails.parkId,
    };
    try {
      console.log("AmountPyload", AmountPyload);
      const res = await saveInitiateSettelementDetails(AmountPyload);

      const { cbX_API_REF_NO } = res?.data.data.data;
      const Payload = {
        id: Amount_Date.settlementId,
        cbX_API_REF_NO: cbX_API_REF_NO,
        parkId: SetteledDetails.parkId,
        date: getCurrentDate(),
      };
      if (res.data.status == 200) {
        RefreshButton(Payload);
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
          fetchParkBankTransactions({
            fromDate: userObject.fromDate || getCurrentDate(),
            toDate: userObject.toDate || getCurrentDate(),
            departmentId: userObject.departmentId || "",
            entityTypeId: userObject.entityTypeId || "",
            ParkId: userObject.ParkId || "",
          });
        });
      } else {
        Swal.fire({
          title: "Failed!",
          text: `Payment of <b>Rs.${Amount_Date.amount}</b> settlement failed. Please try again.`,
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          fetchParkBankTransactions({
            fromDate: userObject.fromDate || getCurrentDate(),
            toDate: userObject.toDate || getCurrentDate(),
            departmentId: userObject.departmentId || "",
            entityTypeId: userObject.entityTypeId || "",
            ParkId: userObject.ParkId || "",
          });
        });
      }
    } catch {
      Swal.fire({
        title: "Failed!",
        text: `Payment of Rs.${Amount_Date.amount} settlement failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        fetchParkBankTransactions({
          fromDate: userObject.fromDate || getCurrentDate(),
          toDate: userObject.toDate || getCurrentDate(),
          departmentId: userObject.departmentId || "",
          entityTypeId: userObject.entityTypeId || "",
          ParkId: userObject.ParkId || "",
        });
      });
    }
  };

  // verify amount

  const handleVerifySettlement = async () => {
    const verifyPayload = {
      ...verifyDetails,
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
        fetchParkBankTransactions({
          fromDate: userObject.fromDate || getCurrentDate(),
          toDate: userObject.toDate || getCurrentDate(),
          departmentId: userObject.departmentId || "",
          entityTypeId: userObject.entityTypeId || "",
          ParkId: userObject.ParkId || "",
        });
      });
    } else {
      Swal.fire({
        title: "Failed!",
        text: `Payment of Rs.${Amount_Date.amount} settlement failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        fetchParkBankTransactions({
          fromDate: userObject.fromDate || getCurrentDate(),
          toDate: userObject.toDate || getCurrentDate(),
          departmentId: userObject.departmentId || "",
          entityTypeId: userObject.entityTypeId || "",
          ParkId: userObject.ParkId || "",
        });
      });
    }
  };

  const HandleRefreshButton = async (Date, cbX_API_REF_NO, id, ParkId) => {
    const convertDateFormat = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };

    const verifyPayload = {
      id: id,
      cbX_API_REF_NO: cbX_API_REF_NO,
      date: convertDateFormat(Date),
      parkId: ParkId,
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
        }).then(() => { });
      }
    } catch {
      Swal.fire({
        title: "Failed!",
        text: ` Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => { });
    }
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
            <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
              <ForestDeptDepartmentSync
                role={role}
                forestDepartmentId={forestDepartmentId}
                setFieldValue={setFieldValue}
              />
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
              {/* department */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Department
                </label>

                <Select
                  name="departmentId"
                  value={
                    allDepartmentTypes
                      ?.filter((dept) => dept.isActive)
                      .map((dept) => ({
                        value: dept.departmentId,
                        label: dept.departmentName,
                      }))
                      .find(
                        (option) =>
                          option.value ===
                          (role === "Role_ForestDeptAdmin"
                            ? forestDepartmentId
                            : values.departmentId)
                      ) || null
                  }
                  options={allDepartmentTypes
                    ?.filter((dept) => dept.isActive)
                    .map((dept) => ({
                      value: dept.departmentId,
                      label: dept.departmentName,
                    }))}
                  onChange={(selectedOption) =>
                    setFieldValue("departmentId", selectedOption?.value || "")
                  }
                  isDisabled={role === "Role_ForestDeptAdmin"}
                  isClearable={role !== "Role_ForestDeptAdmin"}
                  placeholder="Department"
                  className="mt-[4px] text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      outline: "none",
                      boxShadow: "none",
                      borderColor: "#ced4da",
                      borderRadius: "6px",
                      height: "30px",
                      minHeight: "33px",
                    }),

                    menu: (base) => ({
                      ...base,
                      // padding: "4px 0",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      fontSize: "0.775rem",
                      backgroundColor: isFocused ? "#F8F8F8" : "white",
                      color: isFocused ? "#0C3771" : "#000",
                      cursor: "pointer",
                    }),
                  }}
                />
              </div>
              {/* location category */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Location Category
                </label>

                <Select
                  name="entityId"
                  value={
                    allEntityTypes
                      ?.filter((dept) => dept.isActive)
                      .map((dept) => ({
                        value: dept.entityTypeId,
                        label: dept.entityTypeName,
                      }))
                      .find((option) => option.value === values.entityId) ||
                    null // Use values.entityId
                  }
                  options={allEntityTypes
                    ?.filter((entity) => entity.isActive)
                    .map((entity) => ({
                      value: entity.entityTypeId,
                      label: entity.entityTypeName,
                    }))}
                  onChange={(selectedOption) =>
                    setFieldValue("entityId", selectedOption?.value || "")
                  }
                  isClearable
                  placeholder="Location Category"
                  className="mt-[4px] text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      outline: "none",
                      boxShadow: "none",
                      borderColor: "#ced4da",
                      borderRadius: "6px",
                      height: "30px",
                      minHeight: "33px",
                    }),

                    menu: (base) => ({
                      ...base,
                      // padding: "4px 0",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      fontSize: "0.775rem",
                      backgroundColor: isFocused ? "#F8F8F8" : "white",
                      color: isFocused ? "#0C3771" : "#6D7072",
                      cursor: "pointer",
                    }),
                  }}
                />
              </div>
              {/* location */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Location
                </label>

                <Select
                  name="ParkId"
                  value={
                    allParks
                      ?.filter((park) => park.isActive)
                      .map((park) => ({
                        value: park.id,
                        label: park.name,
                      }))
                      .find((option) => option.value === values.ParkId) || null
                  }
                  options={allParks
                    ?.filter((park) => park.isActive)
                    .map((park) => ({
                      value: park.id,
                      label: park.name,
                    }))}
                  onChange={(selectedOption) =>
                    setFieldValue("ParkId", selectedOption?.value || "")
                  }
                  isClearable
                  placeholder="Location"
                  className="mt-[4px] text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      outline: "none",
                      boxShadow: "none",
                      borderColor: "#ced4da",
                      borderRadius: "6px",
                      height: "30px",
                      minHeight: "33px",
                    }),

                    menu: (base) => ({
                      ...base,
                      // padding: "4px 0",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      fontSize: "0.775rem",
                      backgroundColor: isFocused ? "#F8F8F8" : "white",
                      color: isFocused ? "#0C3771" : "#6D7072",
                      cursor: "pointer",
                    }),
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
                    localStorage.removeItem("park_Amount");

                    setValues({
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      entityId: "",
                      departmentId: "",
                      ParkId: "",
                    });

                    fetchParkBankTransactions({
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      departmentId: "",
                      entityTypeId: "",
                      ParkId: "",
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
          rowData={allParkBankTransactions}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAllParkBankTransactionsLoading}
        />
      </div>
      {/* VERIFY POPUP */}
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
              {isSaveVerifySettlementAmountLoading ? (
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
    </AdminLayout>
  );
}
