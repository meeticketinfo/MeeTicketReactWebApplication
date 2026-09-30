import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import AgGridTable from "../../../../tables/AgGridTable";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import {
  displayValue,
  formatDisplayDate,
  formatDisplayDateTime,
} from "../../../../../utils/Helper";
import { getTotalRowData } from "../../../../../utils/getTotalRowData";
import { useIntercityMastersStore } from "../../../../../store/intercity/masters/intercityMastersStore";
import { useCityBusReportsStore } from "../../../../../store/rtc/CityBusReportsStore";
import {
  CurrentBookingArrivalField,
  CurrentBookingCityBusField,
  CurrentBookingDepartureField,
  CurrentBookingIntercityBusField,
  filterRecordsByIntercityBus,
  getArrivalStagesForDeparture,
  getStageIdsFromSelection,
} from "../../current_bookings_reports/shared/CurrentBookingReportFilterFields";

const FILTERS_STORAGE_KEY = "city-bus-consolidated-filters";

const defaultFilterValues = () => ({
  purchaseOrBooking: "Purchase",
  fromDate: getCurrentDate(),
  toDate: getCurrentDate(),
  mobileNumber: "",
  bookingDate: "",
  PNRNumber: "",
  paymentMode: "",
  orderId: "",
  transactionId: "",
  typeOfBus: "",
  departureLocation: 0,
  arrivalLocation: 0,
  intercityBus: "",
});

const CityBusConsolidatedList = () => {
  const savedFilters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
  const [intercityBusFilter, setIntercityBusFilter] = useState(savedFilters?.intercityBus || "" );

  const {
    fetchCityBusConsolidateData,
    CityBusConsolidateData,
    isFetchCityBusConsolidateData,
  } = useCityBusReportsStore();

  const {
    fetchIntercityBusTypesData,
    fetchIntercitySeatLayoutsData,
    IntercityBusTypesData,
    fetchMavenRoutes,
    mavenRoutes,
    departureStages,
    intercityStageNames,
  } = useIntercityMastersStore();

  const initialValues = {
    ...defaultFilterValues(),
    ...(savedFilters || {}),
  };

  useEffect(() => {
    fetchIntercityBusTypesData();
    fetchIntercitySeatLayoutsData();
    fetchMavenRoutes();
  }, [fetchIntercityBusTypesData, fetchIntercitySeatLayoutsData, fetchMavenRoutes]);

  useEffect(() => {
    fetchCityBusConsolidateData({
      purchaseOrBooking: savedFilters?.purchaseOrBooking ?? "Purchase",
      fromDate: savedFilters?.fromDate ?? getCurrentDate(),
      toDate: savedFilters?.toDate ?? getCurrentDate(),
      mobileNumber: savedFilters?.mobileNumber ?? "",
      bookingDate: savedFilters?.bookingDate ?? "",
      PNRNumber: savedFilters?.PNRNumber ?? "",
      paymentMode: savedFilters?.paymentMode ?? "",
      orderId: savedFilters?.orderId ?? "",
      transactionId: savedFilters?.transactionId ?? "",
      typeOfBus: savedFilters?.typeOfBus ?? "",
      departureLocation: savedFilters?.departureLocation ?? "",
      arrivalLocation: savedFilters?.arrivalLocation ?? "",
    });
  }, [fetchCityBusConsolidateData]);

  const filteredConsolidateData = useMemo(
    () => filterRecordsByIntercityBus(CityBusConsolidateData, intercityBusFilter),
    [CityBusConsolidateData, intercityBusFilter]
  );

  const handleSearch = (values) => {
    const { intercityBus, ...reportValues } = values;
    const stageIds = getStageIdsFromSelection(
      mavenRoutes,
      values.departureLocation,
      values.arrivalLocation
    );
    setIntercityBusFilter(intercityBus || "");
    fetchCityBusConsolidateData({
      ...reportValues,
      departureLocation: stageIds.FromStageBoardingID,
      arrivalLocation: stageIds.ToStageBoardingID,
    });
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(values));
  };

  const handleReset = (setValues) => {
    const resetValues = defaultFilterValues();
    localStorage.removeItem(FILTERS_STORAGE_KEY);
    setValues(resetValues);
    setIntercityBusFilter("");
    fetchCityBusConsolidateData({
      purchaseOrBooking: "Purchase",
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      mobileNumber: "",
      bookingDate: "",
      PNRNumber: "",
      paymentMode: "",
      orderId: "",
      transactionId: "",
      typeOfBus: "",
      departureLocation: 0,
      arrivalLocation: 0,
    });
  };

  const [gridData, setGridData] = useState([]);
  const [gridColumnDefs, setGridColumnDefs] = useState([]);

  const columnDefs = useMemo(
    () => [
      {
        field: "SNo",
        headerName: "S.No",
        maxWidth: 70,
        headerClass: "text-blue-v2",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "Total";
          return params.node.rowIndex + 1;
        },
      },
      {
        field: "PNRNumber",
        headerName: "PNR NUMBER",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "ReturnPNRNo",
        headerName: "RETURN PNR NO",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "DepartureLocation",
        headerName: "DEPARTURE LOCATION",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "ArrivalLocation",
        headerName: "ARRIVAL LOCATION",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "MobileNumber",
        headerName: "MOBILE NUMBER",
        maxWidth: 140,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "BusType",
        headerName: "BUS TYPE",
        maxWidth: 170,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "SeatLayoutType",
        headerName: "SEAT LAYOUT TYPE",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value ? String(params.value).toUpperCase() : "N/A",
      },
      {
        field: "PassengerType",
        headerName: "PASSENGER TYPE",
        maxWidth: 160,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "TravelType",
        headerName: "TRAVEL TYPE",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          if (!params.value || String(params.value).trim() === "") return "N/A";
          return String(params.value).toUpperCase();
        },
      },
      {
        field: "MID",
        headerName: "MID",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "PurchaseDate",
        headerName: "PURCHASE DATE",
        maxWidth: 180,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDisplayDateTime(params.value),
      },
      {
        field: "TravelDate",
        headerName: "TRAVEL DATE",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDisplayDate(params.value),
      },
      {
        field: "ReturnJourneyTravelDate",
        headerName: "RETURN JOURNEY TRAVEL DATE",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDisplayDate(params.value),
      },
      {
        field: "AdultCount",
        headerName: "ADULT COUNT",
        maxWidth: 120,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "0",
        isTotal: true,
      },
      {
        field: "ChildCount",
        headerName: "CHILD COUNT",
        maxWidth: 120,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value ?? "0",
        isTotal: true,
      },
      {
        field: "TicketQuantity",
        headerName: "TICKET QUANTITY",
        maxWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "0",
        isTotal: true,
      },
      {
        field: "BasicFare",
        headerName: "BASIC FARE",
        maxWidth: 100,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalLevies",
        headerName: "TOTAL LEVIES",
        maxWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalTollFare",
        headerName: "TOTAL TOLL FARE",
        hide: true,
        maxWidth: 140,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalGreenCess",
        headerName: "TOTAL GREEN CESS",
        hide: true,
        maxWidth: 140,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalPassengerFee",
        headerName: "TOTAL PASSENGER FEE",
        hide: true,
        maxWidth: 160,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalSafetyFee",
        headerName: "TOTAL SAFETY FEE",
        hide: true,
        maxWidth: 140,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalGSTAmount",
        headerName: "TOTAL GST AMOUNT",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalOtherCharges",
        headerName: "TOTAL OTHER CHARGES",
        hide: true,
        maxWidth: 160,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalRoundOffAmount",
        headerName: "TOTAL ROUND OFF",
        hide: true,
        maxWidth: 140,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalCharges",
        headerName: "TOTAL CHARGES",
        maxWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "TotalAmount",
        headerName: "TOTAL AMOUNT",
        minWidth: 130,
        maxWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value != null ? `₹ ${params.value}` : "N/A",
        isTotal: true,
      },
      {
        field: "OrderID",
        headerName: "ORDER ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "PaymentMode",
        headerName: "PAYMENT MODE",
        maxWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "PGPaymentID",
        headerName: "PG PAYMENT ID",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "TransactionID",
        headerName: "PAYMENT TRANSACTION ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "PaymentDateTime",
        headerName: "PAYMENT DATE TIME",
        maxWidth: 180,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDisplayDateTime(params.value),
      },
      {
        field: "BookingStatusName",
        headerName: "BOOKING STATUS",
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params?.value ? String(params.value).toUpperCase() : "N/A",
      },
      {
        field: "PaymentStatusName",
        headerName: "PAYMENT STATUS",
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params?.value ? String(params.value).toUpperCase() : "N/A",
      },
      {
        headerName: "Ticket",
        field: "action",
        cellRenderer: (params) => {
          if (params.node?.rowPinned === "bottom" || params.data?.isTotal) {
            return "";
          }

          const pnr =
            params.data?.BookingID && params.data?.BookingID !== "N/A"
              ? params.data.BookingID
              : params.data?.bookingID && params.data?.bookingID !== "N/A"
              ? params.data.bookingID
              : null;

          return (
            <div style={{ display: "flex align-center", gap: "0.5rem" }}>
              {pnr ? (
                <NavLink
                  end
                  to={`/city-bus-ticket-view-details/${pnr}`}
                  className="bg-blue-v2 text-white text-xs px-4 py-2 rounded-md font-semibold transition uppercase text-blue-v2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Onwards Journey
                </NavLink>
              ) : (
                <span
                  className="bg-blue-v2 text-white text-xs px-4 py-2 rounded-md font-semibold opacity-50 uppercase cursor-not-allowed text-blue-v2"
                  aria-disabled="true"
                  tabIndex={-1}
                >
                  Onwards Journey
                </span>
              )}
            </div>
          );
        },
        flex: 1,
        headerClass: "text-blue-v2",
      },
    ],
    []
  );

  useEffect(() => {
    const { columnDefs: nextColumnDefs } = getTotalRowData(
      filteredConsolidateData,
      columnDefs
    );
    setGridData(filteredConsolidateData);
    setGridColumnDefs(nextColumnDefs);
  }, [filteredConsolidateData, columnDefs]);

  const getPagePinnedBottomRowData = useCallback(
    (displayedRows = []) => {
      const pageRows = (displayedRows || []).filter((row) => !row?.isTotal);
      if (pageRows.length === 0) return [];

      const { rowData } = getTotalRowData(pageRows, columnDefs);
      return rowData.filter((row) => row?.isTotal);
    },
    [columnDefs]
  );

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSearch} enableReinitialize>
        {({ values, setFieldValue, setValues }) => {
          const mappedArrivalStages = getArrivalStagesForDeparture(
            mavenRoutes,
            values.departureLocation
          );
          return (
            <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
              <div>
                <label className="block text-xs font-light uppercase">
                  Date of Booking/Journey
                </label>
                <Field
                  as="select"
                  name="purchaseOrBooking"
                  className="block w-full px-2 py-1 border border-gray-300 uppercase rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="Purchase">Date of Booking</option>
                  <option value="Booking">Date of Journey</option>
                </Field>
              </div>
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-xs font-medium text-gray-700 uppercase"
                >
                  From Date
                </label>
                <Field
                  type="date"
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
                  className="block text-xs font-medium text-gray-700 uppercase"
                >
                  To Date
                </label>
                <Field
                  type="date"
                  name="toDate"
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  min={values.fromDate || getCurrentDate()}
                  onChange={(e) => {
                    setFieldValue("toDate", e.target.value);
                  }}
                />
              </div>
              <CurrentBookingCityBusField />
              <CurrentBookingIntercityBusField
                intercityStageNames={intercityStageNames}
                onValueChange={(value) => setIntercityBusFilter(value || "")}
              />
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  Mobile No
                </label>
                <Field
                  type="text"
                  name="mobileNumber"
                  maxLength="10"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter mobile number"
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) e.preventDefault();
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  PNR No / Return PNR No
                </label>
                <Field
                  type="text"
                  name="PNRNumber"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter PNR"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  Type of Bus
                </label>
                <Field
                  as="select"
                  name="typeOfBus"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="">All</option>
                  {IntercityBusTypesData?.filter((item) => item.isActive).map(
                    (item) => (
                      <option key={item.busTypesName} value={item.busTypesName}>
                        {item.busTypesName}
                      </option>
                    )
                  )}
                </Field>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  Payment Mode
                </label>
                <Field
                  as="select"
                  name="paymentMode"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="">All</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                </Field>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  Order ID
                </label>
                <Field
                  type="text"
                  name="orderId"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter Order ID"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">
                  Transaction ID
                </label>
                <Field
                  type="text"
                  name="transactionId"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter Transaction ID"
                />
              </div>
              <CurrentBookingDepartureField
                departureStages={departureStages}
                setFieldValue={setFieldValue}
              />
              <CurrentBookingArrivalField arrivalStages={mappedArrivalStages} />
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="bg-green-700 text-xs uppercase text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs uppercase text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                  onClick={() => handleReset(setValues)}
                >
                  Reset
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <div>
        {filteredConsolidateData?.length > 0 && (
          <div className="flex justify-end gap-10 font-semibold">
            <span className="bg-gray-100 px-2 border rounded-lg">
              Grand Total Amount: ₹
              {filteredConsolidateData.reduce(
                (sum, row) => sum + Number(row.TotalAmount || 0),
                0
              )}
            </span>
          </div>
        )}
      </div>
      <AgGridTable
        ExportName="City Bus Consolidated Report"
        rowData={gridData}
        columnDefs={gridColumnDefs.length ? gridColumnDefs : columnDefs}
        getPagePinnedBottomRowData={getPagePinnedBottomRowData}
        isFetchLoading={isFetchCityBusConsolidateData}
        showTotalCount={true}
        totalCount={filteredConsolidateData?.length || 0}
        showSearch={false}
        tableHeight={gridData.length > 10 ? 550 : 300}
      />
    </div>
  );
};

export default CityBusConsolidatedList;
