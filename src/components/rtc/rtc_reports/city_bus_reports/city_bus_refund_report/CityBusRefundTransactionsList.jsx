import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";
import AgGridTable from "../../../../../components/tables/AgGridTable";
import PopupModal from "../../../../../components/utils/popup_modal/PopupModal";
import { formatToCurrency } from "../../../../../utils/TypographyHelper";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../utils/Helper";
import { getTotalRowData } from "../../../../../utils/getTotalRowData";
import { useCityBusReportsStore } from "../../../../../store/rtc/CityBusReportsStore";
import { useCurrentPaymentTransactionStore } from "../../../../../store/rtc/CurrentPaymentTransactionStore";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import {
  CurrentBookingCityBusField,
  CurrentBookingIntercityBusField,
  filterRecordsByIntercityBus,
} from "../../current_bookings_reports/shared/CurrentBookingReportFilterFields";

const REFUND_STATUS_OPTIONS = [
  { value: "-1", label: "ALL" },
  { value: "0", label: "Not Initiated" },
  { value: "1", label: "Initiated" },
  { value: "2", label: "Refunded" },
  { value: "3", label: "Failed" },
];

const FILTERS_STORAGE_KEY = "city-bus-refund-inner-transaction-search-params";

function CityBusRefundTransactionsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [intercityBusFilter, setIntercityBusFilter] = useState(
    searchParams.get("intercityBus") || ""
  );
  const [gridData, setGridData] = useState([]);
  const [gridColumnDefs, setGridColumnDefs] = useState([]);

  const {
    isFetchCityBusRefundTransactionsData,
    CityBusRefundTransactionsData,
    fetchCityBusRefundTransactionsData,
  } = useCityBusReportsStore();

  const {
    fetchCurrentPaymentTransactionRefund,
    isFetchCurrentPaymentTransactionRefundLoading,
  } = useCurrentPaymentTransactionStore();

  const { fetchMavenRoutes, intercityStageNames } = useIntercityMastersStore();

  useEffect(() => {
    fetchMavenRoutes();
  }, [fetchMavenRoutes]);

  const getRefundStatusFromParams = () => {
    const status =
      searchParams.get("refundStatus") ?? searchParams.get("RefundStatus");
    if (status === null || status === "") return "-1";
    return status;
  };

  const buildFetchPayload = () => ({
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
    mobileNumber: searchParams.get("mobileNumber") || "",
    pnrNumber: searchParams.get("pnrNumber") || "",
    paymentMode: searchParams.get("paymentMode") || "",
    refundStatus: getRefundStatusFromParams(),
  });

  const loadRefundTransactionsReport = () => {
    fetchCityBusRefundTransactionsData(buildFetchPayload());
  };

  useEffect(() => {
    loadRefundTransactionsReport();
  }, [searchParams]);

  const filteredRefundTransactions = useMemo(
    () =>
      filterRecordsByIntercityBus(
        Array.isArray(CityBusRefundTransactionsData)
          ? CityBusRefundTransactionsData
          : [],
        intercityBusFilter
      ),
    [CityBusRefundTransactionsData, intercityBusFilter]
  );

  const handleIntercityBusChange = (value) => {
    setIntercityBusFilter(value || "");
  };

  const initialValues = {
    fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
    toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
    intercityBus: searchParams.get("intercityBus") || "",
    mobileNumber: searchParams.get("mobileNumber") || "",
    pnrNumber: searchParams.get("pnrNumber") || "",
    paymentMode: searchParams.get("paymentMode") || "",
    refundStatus: getRefundStatusFromParams(),
  };

  const onSubmit = (values) => {
    const { intercityBus, ...reportValues } = values;
    const newSearchParams = new URLSearchParams();
    Object.keys(reportValues).forEach((key) => {
      const value = reportValues[key];
      if (value !== undefined && value !== null && value !== "") {
        newSearchParams.set(
          key,
          key.includes("Date") ? cleanString(value, ":", "_") : String(value)
        );
      }
    });
    newSearchParams.set("refundStatus", String(values.refundStatus ?? "-1"));
    if (intercityBus) {
      newSearchParams.set("intercityBus", intercityBus);
    }

    localStorage.setItem(FILTERS_STORAGE_KEY, newSearchParams.toString());
    handleIntercityBusChange(intercityBus);
    // Only update URL params — useEffect([searchParams]) triggers the single API call
    setSearchParams(newSearchParams);
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.NO",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "Total";
          return params.node.rowIndex + 1;
        },
        maxWidth: 80,
        headerClass: "text-blue-v2",
      },
      {
        field: "pnrNumber",
        headerName: "PNR NO",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "transactionDateandTime",
        headerName: "DATE AND TIME OF TRANSACTION",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          if (!params.value) return "N/A";
          const date = new Date(params.value);
          if (isNaN(date.getTime())) return "N/A";
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
        field: "refundStatus",
        headerName: "REFUND STATUS",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "refundAmount",
        headerName: "REFUND AMOUNT",
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          formatToCurrency(params.value, "INR", "en-IN") || "00:00",
        isTotal: true,
      },
      {
        field: "refundDate",
        headerName: "REFUND DATE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          if (!params.value) return "N/A";
          const date = new Date(params.value);
          if (isNaN(date.getTime())) return "N/A";
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
        field: "mobileNumber",
        minWidth: 90,
        headerName: "MOBILE NUMBER",
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === " " ? params.value : "N/A",
      },
      {
        field: "departureLocation",
        headerName: "DEPARTURE LOCATION",
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === " " ? params.value : "N/A",
      },
      {
        field: "arrivalLocation",
        headerName: "ARRIVAL LOCATION",
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === " " ? params.value : "N/A",
      },
      {
        field: "amount",
        headerName: "TOTAL AMOUNT",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          formatToCurrency(params.value, "INR", "en-IN") || "00:00",
        isTotal: true,
      },
      {
        field: "noOfTickets",
        headerName: "TICKET QUANTITY",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === " " ? params.value : "N/A",
        isTotal: true,
      },
      {
        field: "modeofPayment",
        headerName: "PAYMENT MODE",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "N/A",
      },
      {
        field: "transactionStatus",
        headerName: "TRANSACTION STATUS",
        maxWidth: 230,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === " " ? params.value : "N/A",
      },
      {
        field: "orderID",
        headerName: "ORDER ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "N/A",
      },
      {
        field: "bookingID",
        headerName: "BOOKING ID",
        maxWidth: 120,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "0",
      },
    ],
    []
  );

  useEffect(() => {
    const { columnDefs: nextColumnDefs } = getTotalRowData(
      filteredRefundTransactions,
      columnDefs
    );
    setGridData(filteredRefundTransactions);
    setGridColumnDefs(nextColumnDefs);
  }, [filteredRefundTransactions, columnDefs]);

  const getPagePinnedBottomRowData = useCallback(
    (displayedRows = []) => {
      const pageRows = (displayedRows || []).filter((row) => !row?.isTotal);
      if (pageRows.length === 0) return [];

      const { rowData } = getTotalRowData(pageRows, columnDefs);
      return rowData.filter((row) => row?.isTotal);
    },
    [columnDefs]
  );

  const handleInitiateRefund = async () => {
    try {
      const res = await fetchCurrentPaymentTransactionRefund(RefundOrderId);
      setInitiatRefundModal(false);
      if (res.response?.status === 200) {
        const resultMsg = res.response?.data?.refundStatus;
        Swal.fire({
          title: `${
            resultMsg === "TXN_SUCCESS"
              ? "Success!"
              : resultMsg === "TXN_FAILURE"
                ? "Failed!"
                : "Info!"
          }`,
          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">${resultMsg}</div>`,
          icon: `${
            resultMsg === "TXN_SUCCESS"
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
        Swal.fire({
          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">${res.response?.data?.message}</div>`,
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
    } catch {
      Swal.fire({
        title: "Failed!",
        text: "Refund failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      loadRefundTransactionsReport();
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3 uppercase">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="datetime-local"
                name="fromDate"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
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
                type="datetime-local"
                name="toDate"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                min={values.fromDate}
              />
            </div>
            <CurrentBookingCityBusField />
            <CurrentBookingIntercityBusField
              intercityStageNames={intercityStageNames}
              onValueChange={handleIntercityBusChange}
            />
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="mobileNumber"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="pnrNumber"
                className="block text-xs font-medium text-gray-700"
              >
                PNR No
              </label>
              <Field
                type="text"
                name="pnrNumber"
                className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter PNR"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Payment Mode
              </label>
              <Field
                as="select"
                name="paymentMode"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">All</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </Field>
            </div>
            <div>
              <label
                htmlFor="refundStatus"
                className="block text-xs font-medium text-gray-700"
              >
                Refund Status
              </label>
              <Field
                as="select"
                name="refundStatus"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                {REFUND_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs uppercase text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                disabled={isFetchCityBusRefundTransactionsData}
              >
                {isFetchCityBusRefundTransactionsData
                  ? "Searching..."
                  : "Search"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <AgGridTable
        showSearch={true}
        ExportName="CityBusRefundTransactionReport"
        rowData={gridData || []}
        columnDefs={gridColumnDefs}
        getPagePinnedBottomRowData={getPagePinnedBottomRowData}
        isFetchLoading={isFetchCityBusRefundTransactionsData}
        showTotalCount={true}
        totalCount={gridData?.length || 0}
        tableHeight={gridData.length > 10 ? 550 : 300}
      />

      <PopupModal
        popupModalId="city-bus-refund-modal"
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
              onClick={handleInitiateRefund}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              {isFetchCurrentPaymentTransactionRefundLoading ? (
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

export default CityBusRefundTransactionsList;
