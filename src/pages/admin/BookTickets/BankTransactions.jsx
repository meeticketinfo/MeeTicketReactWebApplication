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
import { LuClipboardEdit } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import useAuthStore from "../../../store/authStore";
import { useEntityTypesStore } from "../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../store/masters/departmentTypesStore";
import Select from "react-select";
export default function BankTransactions() {
  const [openModal, setOpenModal] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState("");
  const {
    allParkBankTransactions,
    fetchParkBankTransactions,
    isFetchAllParkBankTransactionsLoading,
  } = useParkStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  const { decodedTokenData } = useAuthStore();

  const email = decodedTokenData?.data?.email;

  useEffect(() => {
    fetchParkBankTransactions({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      departmentId:"",
      entityTypeId:""
    });
  }, [fetchParkBankTransactions]);
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
  }, []);
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    entityId: "",
    departmentId: "",
  };
  const onSubmit = (values) => {
    fetchParkBankTransactions({
      fromDate: values.fromDate,
      toDate: values.toDate,
      departmentId:values.departmentId,
      entityTypeId:values.entityId
    });
  };
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "bookingDate",
      headerName: "Booking Date",
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
      headerName: "Location category",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "bookings",
      headerName: "Bookings",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "cashCollectedAmount",
      headerName: "Collected Cash Amount",
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
      field: "upiCollectedAmount",
      headerName: "Collected UPI Amount",
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
      headerName: "Actions",
      hide: email != "esdfinancialadmin@meeseva.com",
      field: "actions",
      cellRenderer: (params) => (
        <div className=" flex align-center">
          <button
            className="bg-green-400 text-white leading-normal px-2 py-1 mt-1.5 rounded-md"
            onClick={() => {
              setOpenModal(true);
              setSettlementAmount(params.data.totalAmount);
            }}
          >
            Pay Now
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
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
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
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
                      .find((option) => option.value === values.departmentId) ||
                    null // Set the selected value
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
                  isClearable
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
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  // disabled={isFetchAllParkBankTransactionsLoading}
                >
                  Search
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
      <PopupModal
        popupModalId="first-modal"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        // title={"Add Sub-Facility"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            The amount to be settled is Rs. {settlementAmount}.<br /> Please
            confirm to proceed with settlement.
          </h1>
          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={() => {
                setOpenModal(false);
                toast.success("The amount successfully transferred");
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              Proceed
            </button>
            <button
              onClick={() => {
                setOpenModal(false);
              }}
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
