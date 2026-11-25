import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import AgGridTable from "../../tables/AgGridTable";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { displayValue } from "../../../utils/Helper";
import { getTotalRowData } from "../../../utils/getTotalRowData";
import { useNzpReportsStore } from "../../../store/nzp/NzpReportsStore";

const FILTERS_STORAGE_KEY = "nzp-ticket-bookings-transaction-filters";

const defaultFilterValues = () => ({
  bookingFromDate: getCurrentDate(),
  bookingToDate: getCurrentDate(),
  mobile: "",
});

const formatDateOnly = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return displayValue(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return displayValue(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const toNum = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const numericCol = (field, headerName, minWidth = 110) => ({
  field,
  headerName,
  minWidth,
  headerClass: "text-blue-v2",
  isTotal: true,
  valueFormatter: (params) =>
    params.value === null || params.value === undefined || params.value === ""
      ? 0
      : params.value,
});

const textCol = (field, headerName, minWidth = 130) => ({
  field,
  headerName,
  minWidth,
  headerClass: "text-blue-v2",
  valueFormatter: (params) =>
    params.value === null || params.value === undefined || params.value === ""
      ? "-"
      : displayValue(params.value),
});

/** Services that use Adult / Child / Amount (Rs.) column shape */
const ADULT_CHILD_SERVICE_PREFIXES = [
  "entry",
  "bovNonExclusive",
  "safariNonAcBus",
  "safariAcBus",
  "toyTrain",
  "aquarium",
  "nocturnalAnimalHouse",
  "reptileHouse",
];

const adultChildServiceGroup = (headerName, prefix) => ({
  headerName,
  headerClass: "text-blue-v2 text-center",
  marryChildren: true,
  children: [
    numericCol(`${prefix}AdultUnit`, "Adult", 90),
    numericCol(`${prefix}ChildUnit`, "Child", 90),
    numericCol(`${prefix}AmountRs`, "Amount (Rs.)", 120),
  ],
});

const enrichAdultChildAmountRows = (rows = []) =>
  (rows || []).map((row) => {
    if (!row || row.isTotal) return row;
    const enriched = { ...row };
    ADULT_CHILD_SERVICE_PREFIXES.forEach((prefix) => {
      enriched[`${prefix}AmountRs`] =
        toNum(row[`${prefix}AdultAmount`]) + toNum(row[`${prefix}ChildAmount`]);
    });
    enriched.cameraServicesAmountRs =
      toNum(row.stillCameraAmount) +
      toNum(row.stillVideoCameraAmount) +
      toNum(row.movieCameraShootingAmount);
    enriched.bovExclusiveAmountRs =
      toNum(row.bovExclusive14SeaterAmount) +
      toNum(row.bovExclusive11SeaterAmount);
    return enriched;
  });

const TicketBookingsTransactionList = () => {
  const savedFilters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
  const {
    fetchTicketBookingsTransactionData,
    clearTicketBookingsTransactionData,
    ticketBookingsTransactionData,
    isFetchTicketBookingsTransactionData,
  } = useNzpReportsStore();

  const initialValues = {
    ...defaultFilterValues(),
    bookingFromDate:
      savedFilters?.bookingFromDate ||
      savedFilters?.fromDate ||
      getCurrentDate(),
    bookingToDate:
      savedFilters?.bookingToDate || savedFilters?.toDate || getCurrentDate(),
    mobile: savedFilters?.mobile || savedFilters?.mobileNumber || "",
  };

  const [gridData, setGridData] = useState([]);
  const [gridColumnDefs, setGridColumnDefs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (values) => {
    if (new Date(values.bookingFromDate) > new Date(values.bookingToDate)) {
      return;
    }
    setHasSearched(true);
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(values));
    fetchTicketBookingsTransactionData({
      bookingFromDate: values.bookingFromDate,
      bookingToDate: values.bookingToDate,
      mobileNumber: values.mobile || "",
    });
  };

  const handleReset = (setValues) => {
    const resetValues = defaultFilterValues();
    localStorage.removeItem(FILTERS_STORAGE_KEY);
    setValues(resetValues);
    setHasSearched(false);
    clearTicketBookingsTransactionData();
    setGridData([]);
    setGridColumnDefs([]);
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "sNo",
        headerName: "S.No",
        minWidth: 70,
        maxWidth: 80,
        headerClass: "text-blue-v2",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "Total";
          if (params.data?.sNo !== null && params.data?.sNo !== undefined) {
            return params.data.sNo;
          }
          return params.node.rowIndex + 1;
        },
      },
      textCol("createdBy", "Created By", 120),
      {
        field: "visitorType",
        headerName: "Visitor Type",
        minWidth: 140,
        headerClass: "text-blue-v2",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "";
          const bookingSource = String(
            params.data?.bookingSource ?? ""
          ).trim();
          if (bookingSource === "MeeTicketApp") {
            return "MeeTicketApp";
          }
          const value = params.data?.visitorType;
          if (value === null || value === undefined || value === "") {
            return "-";
          }
          return value;
        },
        valueFormatter: (params) =>
          params.value === null ||
            params.value === undefined ||
            params.value === ""
            ? "-"
            : displayValue(params.value),
      },
      {
        field: "purchaseDate",
        headerName: "Purchase Date",
        minWidth: 180,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatDateTime(params.value),
      },
      {
        field: "bookingDate",
        headerName: "Booking Date",
        minWidth: 130,
        headerClass: "text-blue-v2",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "";
          return formatDateOnly(params.data?.bookingDate);
        },
        valueFormatter: (params) =>
          params.value === null ||
          params.value === undefined ||
          params.value === ""
            ? "-"
            : params.value,
      },
      textCol("bookingId", "Booking ID", 200),
      textCol("institutionName", "Institution Name", 150),
      {
        field: "discountPercent",
        headerName: "Discount Percent",
        minWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) =>
          params.value === null ||
          params.value === undefined ||
          params.value === ""
            ? "-"
            : params.value,
      },
      textCol("mobileNumber", "Mobile Number", 140),
      textCol("transactionID", "Transaction ID", 160),
      {
        headerName: "Payment Information",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("totalAmount", "Total Amount", 130),
          textCol("paymentStatus", "Payment Status", 150),
          textCol("settlementStatus", "Settlement Status", 150),
          textCol("paymentMode", "Payment Mode", 130),
        ],
      },
      adultChildServiceGroup("Entry", "entry"),
      {
        headerName: "Camera Services",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("stillCameraUnit", "Still Camera", 130),
          numericCol("stillVideoCameraUnit", "Video Camera", 130),
          numericCol("movieCameraShootingChild", "Commercial Camera", 150),
          numericCol("cameraServicesAmountRs", "Amount (Rs.)", 120),
        ],
      },
      adultChildServiceGroup("BOV Non Exclusive", "bovNonExclusive"),
      {
        headerName: "BOV Exclusive",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("bovExclusive14SeaterUnit", "14 Seater", 110),
          numericCol("bovExclusive11SeaterUnit", "11 Seater", 110),
          numericCol("bovExclusiveAmountRs", "Amount (Rs.)", 120),
        ],
      },
      adultChildServiceGroup("Safari – Non AC", "safariNonAcBus"),
      adultChildServiceGroup("Safari – AC", "safariAcBus"),
      adultChildServiceGroup("Toy Train", "toyTrain"),
      adultChildServiceGroup("Aquarium", "aquarium"),
      adultChildServiceGroup("Nocturnal Animal House", "nocturnalAnimalHouse"),
      adultChildServiceGroup("Reptile House", "reptileHouse"),
    ],
    []
  );

  useEffect(() => {
    if (!hasSearched) return;
    const enrichedRows = enrichAdultChildAmountRows(
      ticketBookingsTransactionData || []
    );
    const { columnDefs: nextColumnDefs } = getTotalRowData(
      enrichedRows,
      columnDefs
    );
    setGridData(enrichedRows);
    setGridColumnDefs(nextColumnDefs);
  }, [ticketBookingsTransactionData, columnDefs, hasSearched]);

  const getPagePinnedBottomRowData = useCallback(
    (displayedRows = []) => {
      const pageRows = enrichAdultChildAmountRows(
        (displayedRows || []).filter((row) => !row?.isTotal)
      );
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
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
            <div>
              <label
                htmlFor="bookingFromDate"
                className="block text-xs font-medium text-gray-700 uppercase"
              >
                Booking From Date
              </label>
              <Field
                type="date"
                name="bookingFromDate"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("bookingFromDate", fromDateValue);
                  if (
                    new Date(fromDateValue) > new Date(values.bookingToDate)
                  ) {
                    setFieldValue("bookingToDate", fromDateValue);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="bookingToDate"
                className="block text-xs font-medium text-gray-700 uppercase"
              >
                Booking To Date
              </label>
              <Field
                type="date"
                name="bookingToDate"
                min={values.bookingFromDate || getCurrentDate()}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onChange={(e) => {
                  setFieldValue("bookingToDate", e.target.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="mobile"
                className="block text-xs font-medium text-gray-700 uppercase"
              >
                Mobile Number
              </label>
              <Field
                type="text"
                name="mobile"
                maxLength="10"
                placeholder="Enter mobile number"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
              />
            </div>
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
        )}
      </Formik>

      {hasSearched && (
        <AgGridTable
          ExportName="Ticket Bookings Transaction Report"
          rowData={gridData}
          columnDefs={gridColumnDefs.length ? gridColumnDefs : columnDefs}
          getPagePinnedBottomRowData={getPagePinnedBottomRowData}
          isFetchLoading={isFetchTicketBookingsTransactionData}
          showTotalCount={true}
          totalCount={gridData?.length || 0}
          showSearch={true}
          isPagination={true}
          tableHeight={550}
        />
      )}
    </div>
  );
};

export default TicketBookingsTransactionList;
