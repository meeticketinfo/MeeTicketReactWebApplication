import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import AgGridTable from "../../../../tables/AgGridTable";
import { getCurrentDate } from "../../../../../utils/TypographyHelper";
import {
  displayValue,
  formatDateOnly,
  formatDisplayDate,
  formatDisplayDateTime,
  naToEmpty,
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

const FILTERS_STORAGE_KEY = "city-bus-individual-filters";

const defaultFilterValues = () => ({
  fromDate: getCurrentDate(),
  toDate: getCurrentDate(),
  mobileNumber: "",
  bookingDate: "",
  pnrNumber: "",
  returnPnrNumber: "",
  paymentMode: "",
  orderId: "",
  transactionId: "",
  seatLayoutType: "",
  busType: "",
  bookingStatus: "",
  departureLocation: 0,
  arrivalLocation: 0,
  intercityBus: "",
  ticketId: "",
  returnTicketId: "",
});

const CityBusIndividualList = () => {
  const savedFilters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
  const [intercityBusFilter, setIntercityBusFilter] = useState(
    savedFilters?.intercityBus || ""
  );

  const {
    fetchCityBusIndividualData,
    CityBusIndividualData,
    isFetchCityBusIndividualData,
  } = useCityBusReportsStore();

  const {
    fetchIntercityBusTypesData,
    fetchIntercitySeatLayoutsData,
    IntercitySeatLayoutsData,
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
  }, [
    fetchIntercityBusTypesData,
    fetchIntercitySeatLayoutsData,
    fetchMavenRoutes,
  ]);

  useEffect(() => {
    fetchCityBusIndividualData({
      fromDate: formatDateOnly(savedFilters?.fromDate ?? getCurrentDate()),
      toDate: formatDateOnly(savedFilters?.toDate ?? getCurrentDate()),
      mobileNumber: naToEmpty(savedFilters?.mobileNumber) || "",
      bookingDate: naToEmpty(savedFilters?.bookingDate) || "",
      pnrNumber: naToEmpty(savedFilters?.pnrNumber) || "",
      returnPnrNumber: naToEmpty(savedFilters?.returnPnrNumber) || "",
      paymentMode: naToEmpty(savedFilters?.paymentMode) || "",
      orderId: naToEmpty(savedFilters?.orderId) || "",
      transactionId: naToEmpty(savedFilters?.transactionId) || "",
      seatLayoutType: naToEmpty(savedFilters?.seatLayoutType) || "",
      busType: naToEmpty(savedFilters?.busType) || "",
      bookingStatus: savedFilters?.bookingStatus ?? "",
      departureLocation: savedFilters?.departureLocation ?? "",
      arrivalLocation: savedFilters?.arrivalLocation ?? "",
      ticketId: naToEmpty(savedFilters?.ticketId) || "",
      returnTicketId: naToEmpty(savedFilters?.returnTicketId) || "",
    });
  }, [fetchCityBusIndividualData]);

  const filteredIndividualData = useMemo(
    () => filterRecordsByIntercityBus(CityBusIndividualData, intercityBusFilter),
    [CityBusIndividualData, intercityBusFilter]
  );

  const handleSearch = (values) => {
    const { intercityBus, ...reportValues } = values;
    const stageIds = getStageIdsFromSelection(
      mavenRoutes,
      values.departureLocation,
      values.arrivalLocation
    );
    setIntercityBusFilter(intercityBus || "");
    fetchCityBusIndividualData({
      ...reportValues,
      fromDate: formatDateOnly(reportValues.fromDate),
      toDate: formatDateOnly(reportValues.toDate),
      mobileNumber: naToEmpty(reportValues.mobileNumber) || "",
      pnrNumber: naToEmpty(reportValues.pnrNumber) || "",
      orderId: naToEmpty(reportValues.orderId) || "",
      transactionId: naToEmpty(reportValues.transactionId) || "",
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
    fetchCityBusIndividualData({
      fromDate: formatDateOnly(getCurrentDate()),
      toDate: formatDateOnly(getCurrentDate()),
      mobileNumber: "",
      bookingDate: "",
      pnrNumber: "",
      returnPnrNumber: "",
      paymentMode: "",
      orderId: "",
      transactionId: "",
      seatLayoutType: "",
      busType: "",
      bookingStatus: "",
      departureLocation: 0,
      arrivalLocation: 0,
      ticketId: "",
      returnTicketId: "",
    });
  };

  const [gridData, setGridData] = useState([]);
  const [gridColumnDefs, setGridColumnDefs] = useState([]);

  const columnDefs = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.NO",
        maxWidth: 70,
        headerClass: "text-blue-v2",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "Total";
          return params.node.rowIndex + 1;
        },
      },
      {
        field: "pnrNumber",
        headerName: "PNR NUMBER",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "returnPNRNumber",
        headerName: "RETURN PNR NO",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(naToEmpty(params.value)),
      },
      {
        field: "departureLocation",
        headerName: "DEPARTURE LOCATION",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "arrivalLocation",
        headerName: "ARRIVAL LOCATION",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "phoneNumber",
        headerName: "MOBILE NUMBER",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "busType",
        headerName: "BUS TYPE",
        maxWidth: 170,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "seatLayoutType",
        headerName: "SEAT LAYOUT TYPE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          const value = naToEmpty(params.value);
          return value ? String(value).toUpperCase() : "N/A";
        },
      },
      {
        field: "isReturnType",
        headerName: "TRAVEL TYPE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          const value = naToEmpty(params.value);
          if (!value || String(value).trim() === "") return "N/A";
          return String(value).toUpperCase();
        },
      },
      {
        field: "gender",
        headerName: "GENDER",
        maxWidth: 120,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => {
          const value = naToEmpty(params.value);
          return value ? String(value).toUpperCase() : "N/A";
        },
      },
      {
        field: "concessionType",
        headerName: "CONCESSION TYPE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "ticketID",
        headerName: "TICKET ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "returnJourneyTicketID",
        headerName: "RETURN JOURNEY TICKET ID",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(naToEmpty(params.value)),
      },
      {
        field: "mid",
        headerName: "MID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(naToEmpty(params.value)),
      },
      {
        field: "purchaseDate",
        headerName: "PURCHASE DATE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDisplayDateTime(params.value),
      },
      {
        field: "travelDate",
        headerName: "TRAVEL DATE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDisplayDate(params.value),
      },
      {
        field: "returnDate",
        headerName: "RETURN JOURNEY TRAVEL DATE",
        hide: true,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDisplayDate(params.value),
      },
      {
        field: "ticketQuantity",
        headerName: "TICKET QUANTITY",
        maxWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => params.value || "0",
        isTotal: true,
      },
      {
        field: "orderId",
        headerName: "ORDER ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(naToEmpty(params.value)),
      },
      {
        field: "modeOfPayment",
        headerName: "PAYMENT MODE",
        maxWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "basicFare",
        headerName: "BASIC FARE",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "passengerFee",
        headerName: "PASSENGER FEE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "waterBottle",
        headerName: "WATER BOTTLE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(naToEmpty(params.value)),
      },
      {
        field: "safetyCess",
        headerName: "SAFETY CESS",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(naToEmpty(params.value)),
      },
      {
        field: "srt",
        headerName: "SRT",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(naToEmpty(params.value)),
      },
      {
        field: "totalTollFare",
        headerName: "TOTAL TOLL FARE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "totalLeviesFee",
        headerName: "TOTAL LEVIES FEE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "serviceFee",
        headerName: "SERVICE FEE",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "serviceTax_GST",
        headerName: "SERVICE TAX",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "flexiFare",
        headerName: "FLEXI FARE",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "eachTicketAmount",
        headerName: "EACH TICKET AMOUNT",
        maxWidth: 170,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => `₹ ${params.value ?? "N/A"}`,
        isTotal: true,
      },
      {
        field: "totalAmount",
        headerName: "TOTAL AMOUNT",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value != null ? `₹ ${params.value}` : "N/A",
        isTotal: true,
      },
      {
        field: "paymentGatewayTransactionId",
        headerName: "PAYMENT TRANSACTION ID",
        headerClass: "text-blue-v2",
        valueFormatter: (params) => displayValue(params.value),
      },
      {
        field: "bookingStatus",
        headerName: "BOOKING STATUS",
        maxWidth: 150,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params?.value ? String(params.value).toUpperCase() : "N/A",
      },
      {
        headerName: "TICKET",
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
                  className="bg-blue-v2 text-xs text-white px-4 py-2 rounded-md font-semibold transition uppercase"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Onwards Journey
                </NavLink>
              ) : (
                <span
                  className="bg-blue-v2 text-xs text-white px-4 py-2 rounded-md font-semibold opacity-50 cursor-not-allowed uppercase"
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
      filteredIndividualData,
      columnDefs
    );
    setGridData(filteredIndividualData);
    setGridColumnDefs(nextColumnDefs);
  }, [filteredIndividualData, columnDefs]);

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
      <Formik
        initialValues={initialValues}
        onSubmit={handleSearch}
        enableReinitialize
      >
        {({ values, setFieldValue, setValues }) => {
          const mappedArrivalStages = getArrivalStagesForDeparture(
            mavenRoutes,
            values.departureLocation
          );
          return (
            <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3 uppercase">
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
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm uppercase focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
                  type="date"
                  name="toDate"
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  min={values.fromDate || getCurrentDate()}
                  onChange={(e) => setFieldValue("toDate", e.target.value)}
                />
              </div>
              <CurrentBookingCityBusField labelClassName="block text-xs font-medium text-gray-700" />
              <CurrentBookingIntercityBusField
                intercityStageNames={intercityStageNames}
                labelClassName="block text-xs font-medium text-gray-700"
                onValueChange={(value) => setIntercityBusFilter(value || "")}
              />
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Mobile No
                </label>
                <Field
                  type="text"
                  name="mobileNumber"
                  maxLength="10"
                  className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter mobile number"
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) e.preventDefault();
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Type of Bus
                </label>
                <Field
                  as="select"
                  name="busType"
                  className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
                <label className="block text-xs font-medium text-gray-700">
                  Seat Layout type
                </label>
                <Field
                  as="select"
                  name="seatLayoutType"
                  className="mt-1 block w-full px-2 py-1 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="">All</option>
                  {IntercitySeatLayoutsData?.filter((item) => item.isActive).map(
                    (item) => (
                      <option
                        key={item.seatLayoutTypesName}
                        value={item.seatLayoutTypesName}
                      >
                        {item.seatLayoutTypesName}
                      </option>
                    )
                  )}
                </Field>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
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
                <label className="block text-xs font-medium text-gray-700">
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
                <label className="block text-xs font-medium text-gray-700">
                  Transaction ID
                </label>
                <Field
                  type="text"
                  name="transactionId"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter Transaction ID"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Booking Status
                </label>
                <Field
                  as="select"
                  name="bookingStatus"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="-1">All</option>
                  <option value="0">Pending</option>
                  <option value="2">Used</option>
                  <option value="3">Expired</option>
                  <option value="4">Cancelled</option>
                  <option value="1">Confirmed</option>
                  <option value="5">Failed</option>
                </Field>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  PNR No
                </label>
                <Field
                  type="text"
                  name="pnrNumber"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter PNR"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Ticket Id
                </label>
                <Field
                  type="text"
                  name="ticketId"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter Ticket Id"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Return PNR No
                </label>
                <Field
                  type="text"
                  name="returnPnrNumber"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter Return PNR"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Return Ticket Id
                </label>
                <Field
                  type="text"
                  name="returnTicketId"
                  className="mt-1 block w-full px-2 py-1 border uppercase border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Enter Return Ticket Id"
                />
              </div>
              <CurrentBookingDepartureField
                departureStages={departureStages}
                setFieldValue={setFieldValue}
                labelClassName="block text-xs font-medium text-gray-700"
              />
              <CurrentBookingArrivalField
                arrivalStages={mappedArrivalStages}
                labelClassName="block text-xs font-medium text-gray-700"
              />
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
        {filteredIndividualData?.length > 0 && (
          <div className="flex justify-end gap-10 font-semibold">
            <span className="bg-gray-100 px-2 border rounded-lg">
              Grand Total Amount: ₹
              {filteredIndividualData.reduce(
                (sum, row) => sum + Number(row.totalAmount || row.amount || 0),
                0
              )}
            </span>
          </div>
        )}
      </div>
      <AgGridTable
        ExportName="City Bus Individual Report"
        rowData={gridData}
        columnDefs={gridColumnDefs.length ? gridColumnDefs : columnDefs}
        getPagePinnedBottomRowData={getPagePinnedBottomRowData}
        isFetchLoading={isFetchCityBusIndividualData}
        showTotalCount={true}
        totalCount={filteredIndividualData?.length || 0}
        showSearch={false}
        tableHeight={gridData.length > 10 ? 550 : 300}
      />
    </div>
  );
};

export default CityBusIndividualList;
