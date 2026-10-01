import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import AgGridTable from "../../../../../components/tables/AgGridTable";
import PopupModal from "../../../../../components/utils/popup_modal/PopupModal";
import Swal from "sweetalert2";
import { useCityBusReportsStore } from "../../../../../store/rtc/CityBusReportsStore";
import { useCurrentPaymentTransactionStore } from "../../../../../store/rtc/CurrentPaymentTransactionStore";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import {
  getCurrentDateStartTime,
  getCurrentDateEndTime,
} from "../../../../../utils/TypographyHelper";
import { getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { getTotalRowData } from "../../../../../utils/getTotalRowData";
import {
  CurrentBookingArrivalField,
  CurrentBookingCityBusField,
  CurrentBookingDepartureField,
  CurrentBookingIntercityBusField,
  filterRecordsByIntercityBus,
  getArrivalStagesForDeparture,
  getStageIdsFromSelection,
} from "../../current_bookings_reports/shared/CurrentBookingReportFilterFields";

const FILTERS_STORAGE_KEY = "city-bus-payment-report-filters";

function CityBusPaymentTransactionsList() {
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const savedFilters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));

  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState("");
  const [InitiatRefundModal, setInitiatRefundModal] = useState(false);
  const [RefundOrderId, setRefundOrderId] = useState("");
  const [RegenerateTicketData, setRegenerateTicketData] = useState("");
  const [openRegenerateTicketModal, setOpenRegenerateTicketModal] = useState(false);
  const [intercityBusFilter, setIntercityBusFilter] = useState(
    savedFilters?.intercityBus || ""
  );

  const {
    isFetchCityBusPaymentTransactionsData,
    CityBusPaymentTransactionsData,
    fetchCityBusPaymentTransactionsData,
  } = useCityBusReportsStore();

  const {
    fetchCurrentVerifyStatus,
    isFetchCurrentVerifyStatusLoading,
    fetchCurrentPaymentTransactionRefund,
    fetchCurrentRegenerateTicket,
    isFetchCurrentRegenerateTicketLoading,
  } = useCurrentPaymentTransactionStore();

  const { fetchMavenRoutes, mavenRoutes, departureStages, intercityStageNames } =
    useIntercityMastersStore();

  const buildFetchPayload = (filters = savedFilters) => ({
    startDate: filters?.fromDate ?? startOfDay,
    endDate: filters?.toDate ?? endOfDay,
    paymentStatus: filters?.paymentStatus ? filters.paymentStatus : "",
    phoneNumber: filters?.phoneNumber ? filters.phoneNumber : "",
    arrivalLocation: filters?.arrivalLocation ? filters.arrivalLocation : "",
    destinationLocation: filters?.destinationLocation
      ? filters.destinationLocation
      : "",
  });

  useEffect(() => {
    fetchMavenRoutes();
  }, [fetchMavenRoutes]);

  useEffect(() => {
    fetchCityBusPaymentTransactionsData(buildFetchPayload());
  }, [fetchCityBusPaymentTransactionsData]);

  const filteredPaymentTransactions = useMemo(
    () =>
      filterRecordsByIntercityBus(
        CityBusPaymentTransactionsData || [],
        intercityBusFilter
      ),
    [CityBusPaymentTransactionsData, intercityBusFilter]
  );

  const handleIntercityBusChange = (value) => {
    setIntercityBusFilter(value || "");
  };

  const initialValues = {
    fromDate: savedFilters?.fromDate
      ? savedFilters.fromDate
      : getCurrentDateStartTime(),
    toDate: savedFilters?.toDate
      ? savedFilters.toDate
      : getCurrentDateEndTime(),
    paymentStatus: savedFilters?.paymentStatus
      ? savedFilters.paymentStatus
      : null,
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : "",
    arrivalLocation: savedFilters?.arrivalLocation
      ? savedFilters.arrivalLocation
      : 0,
    destinationLocation: savedFilters?.destinationLocation
      ? savedFilters.destinationLocation
      : 0,
    intercityBus: savedFilters?.intercityBus || "",
  };

  const onSubmit = (values) => {
    const { intercityBus, ...reportValues } = values;
    const stageIds = getStageIdsFromSelection(
      mavenRoutes,
      values.destinationLocation,
      values.arrivalLocation
    );

    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(values));
    handleIntercityBusChange(intercityBus);
    fetchCityBusPaymentTransactionsData({
      startDate: reportValues.fromDate,
      endDate: reportValues.toDate,
      paymentStatus: reportValues.paymentStatus || "",
      phoneNumber: reportValues.phoneNumber || "",
      destinationLocation: stageIds.FromStageBoardingID,
      arrivalLocation: stageIds.ToStageBoardingID,
    });
  };

  const [gridData, setGridData] = useState([]);
  const [gridColumnDefs, setGridColumnDefs] = useState([]);

  const columnDefs = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.NO",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "Total";
          return params.node.rowIndex + 1;
        },
        minWidth: 80,
        maxWidth: 80,
        headerClass: "text-blue-v2",
      },
      {
        field: "orderID",
        headerName: "ORDER ID",
        minWidth: 200,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "MobileNumber",
        headerName: "MOBILE NUMBER",
        minWidth: 140,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => (params.value ? params.value : "N/A"),
      },
      {
        field: "TicketQuantity",
        headerName: "TICKET QUANTITY",
        minWidth: 150,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === 0 ? params.value : "N/A",
        isTotal: true,
      },
      {
        field: "amount",
        headerName: "AMOUNT",
        minWidth: 120,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === 0 ? `₹${params.value}` : "N/A",
        isTotal: true,
      },
      {
        field: "purchaseDate",
        headerName: "PURCHASE DATE",
        minWidth: 180,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
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
        minWidth: 150,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params?.value || "N/A",
      },
      {
        field: "actualPaymentStatus",
        headerName: "ACTUAL PAYMENT STATUS",
        minWidth: 200,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params?.value || "N/A",
      },
      {
        field: "refundDate",
        headerName: "REFUND DATE",
        minWidth: 180,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
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
        field: "PGRefundID",
        headerName: "REFUND ID",
        minWidth: 150,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === 0 ? params.value : "N/A",
      },
      {
        field: "RefundStatusName",
        headerName: "REFUND STATUS",
        minWidth: 150,
        flex: 1,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value || params.value === 0 ? params.value : "N/A",
      },
      {
        headerName: "INITIATE REFUND",
        field: "InitiateRefund",
        minWidth: 140,
        flex: 1,
        cellRenderer: (params) => {
          const isDisabled = !params.data.canBeRefundInitiate;
          return (
            <div className="flex justify-center mt-1">
              <button
                className={`px-4 py-2 text-xs font-semibold uppercase rounded-md transition-all duration-200 ${
                  isDisabled
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
            </div>
          );
        },
        headerClass: "text-blue-v2",
      },
      {
        field: "actions",
        headerName: "TICKET",
        minWidth: 180,
        flex: 1,
        headerClass: "text-blue-v2",
        cellRenderer: (params) => {
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
                  to={`/city-bus-ticket-view-details/${pnr}`}
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
        minWidth: 180,
        flex: 1,
        headerClass: "text-blue-v2",
        cellRenderer: (params) => {
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
                  to={`/city-bus-ticket-view-details/${returnPnr}`}
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
    ],
    []
  );

  useEffect(() => {
    const { columnDefs: nextColumnDefs } = getTotalRowData(
      filteredPaymentTransactions,
      columnDefs
    );
    setGridData(filteredPaymentTransactions);
    setGridColumnDefs(nextColumnDefs);
  }, [filteredPaymentTransactions, columnDefs]);

  const getPagePinnedBottomRowData = useCallback(
    (displayedRows = []) => {
      const pageRows = (displayedRows || []).filter((row) => !row?.isTotal);
      if (pageRows.length === 0) return [];

      const { rowData } = getTotalRowData(pageRows, columnDefs);
      return rowData.filter((row) => row?.isTotal);
    },
    [columnDefs]
  );

  const refreshReport = () => {
    const filters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
    fetchCityBusPaymentTransactionsData(buildFetchPayload(filters));
  };

  const handleVerifyTicket = async () => {
    try {
      const res = await fetchCurrentVerifyStatus(verifyData);

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
      setTimeout(() => refreshReport(), 2100);
    }
  };

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
          html: `<div style="font-size: 15px; color: #4B5563; padding-top: 5px;">
              ${resultMsg}
            </div>`,
          confirmButtonText: "OK",
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
      setTimeout(() => refreshReport(), 2100);
    }
  };

  const handleRegenerateTicket = async () => {
    try {
      const res = await fetchCurrentRegenerateTicket({
        pnrNumber: RegenerateTicketData.returnPNRNumber
          ? RegenerateTicketData.returnPNRNumber
          : RegenerateTicketData.pnrNumber,
        paymentTransactionId: RegenerateTicketData.orderID,
        isReturnBooking: RegenerateTicketData.returnPNRNumber ? true : false,
        isTicketReGenerate: true,
        bookingDetailsId: RegenerateTicketData.bookingDetailsId,
        tentativeBookingId: RegenerateTicketData.tentativebookingId,
      });
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
      setTimeout(() => refreshReport(), 2100);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ values, setFieldValue, resetForm }) => {
            const mappedArrivalStages = getArrivalStagesForDeparture(
              mavenRoutes,
              values.destinationLocation
            );
            return (
              <Form className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 py-3 uppercase">
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
                    className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    className={`mt-1 block w-full px-2 py-1 border 
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    min={values.fromDate || getCurrentDateStartTime()}
                    onChange={(e) => {
                      const toDateValue = e.target.value;
                      setFieldValue("toDate", toDateValue);
                    }}
                  />
                </div>
                <CurrentBookingCityBusField />
                <CurrentBookingIntercityBusField
                  intercityStageNames={intercityStageNames}
                  onValueChange={handleIntercityBusChange}
                />
                <div>
                  <label className="block text-sm font-medium">
                    Payment Status
                  </label>
                  <Field
                    as="select"
                    name="paymentStatus"
                    className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="INITIATE">Initiate</option>
                    <option value="INPROCESS">In Process</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="FAILED">Failed</option>
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Mobile No
                  </label>
                  <Field
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter mobile number"
                    className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = value.replace(/[^0-9]/g, "");
                      if (numericValue.length > 10) {
                        return;
                      }
                      if (
                        numericValue.length > 0 &&
                        !/^[6-9]/.test(numericValue)
                      ) {
                        return;
                      }
                      setFieldValue("phoneNumber", numericValue);
                    }}
                  />
                </div>
                <CurrentBookingDepartureField
                  departureStages={departureStages}
                  name="destinationLocation"
                  arrivalFieldName="arrivalLocation"
                  setFieldValue={setFieldValue}
                />
                <CurrentBookingArrivalField
                  arrivalStages={mappedArrivalStages}
                />
                <div className="flex items-end gap-2 ">
                  <button
                    type="submit"
                    className="bg-green-700 uppercase text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="bg-green-700 text-xs uppercase text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                    onClick={() => {
                      localStorage.removeItem(FILTERS_STORAGE_KEY);
                      resetForm({
                        values: {
                          fromDate: getCurrentDateStartTime(),
                          toDate: getCurrentDateEndTime(),
                          paymentStatus: "",
                          phoneNumber: "",
                          arrivalLocation: 0,
                          destinationLocation: 0,
                          intercityBus: "",
                        },
                      });
                      handleIntercityBusChange("");
                      fetchCityBusPaymentTransactionsData({
                        startDate: getCurrentDateStartTime(),
                        endDate: getCurrentDateEndTime(),
                        paymentStatus: "",
                        phoneNumber: "",
                        arrivalLocation: 0,
                        destinationLocation: 0,
                      });
                    }}
                  >
                    Reset
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>

        <AgGridTable
          ExportName="City Bus Payment Transactions"
          rowData={gridData || []}
          columnDefs={gridColumnDefs}
          getPagePinnedBottomRowData={getPagePinnedBottomRowData}
          isFetchLoading={isFetchCityBusPaymentTransactionsData}
          showTotalCount={true}
          totalCount={gridData?.length || 0}
          showSearch={true}
          tableHeight={gridData.length > 10 ? 550 : 300}
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
              Proceed
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

export default CityBusPaymentTransactionsList;
