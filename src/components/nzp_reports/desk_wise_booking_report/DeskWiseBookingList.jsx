import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import AgGridTable from "../../tables/AgGridTable";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { displayValue } from "../../../utils/Helper";
import { getTotalRowData } from "../../../utils/getTotalRowData";
import { useNzpReportsStore } from "../../../store/nzp/NzpReportsStore";

const FILTERS_STORAGE_KEY = "nzp-desk-wise-booking-filters";

const defaultFilterValues = () => ({
  bookingFromDate: getCurrentDate(),
  bookingToDate: getCurrentDate(),
});

const numericCol = (field, headerName, minWidth = 130) => ({
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

const DeskWiseBookingList = () => {
  const savedFilters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
  const {
    fetchDeskWiseBookingData,
    clearDeskWiseBookingData,
    deskWiseBookingData,
    isFetchDeskWiseBookingData,
  } = useNzpReportsStore();

  const initialValues = {
    ...defaultFilterValues(),
    bookingFromDate:
      savedFilters?.bookingFromDate ||
      savedFilters?.fromDate ||
      getCurrentDate(),
    bookingToDate:
      savedFilters?.bookingToDate || savedFilters?.toDate || getCurrentDate(),
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
    fetchDeskWiseBookingData({
      bookingFromDate: values.bookingFromDate,
      bookingToDate: values.bookingToDate,
    });
  };

  const handleReset = (setValues) => {
    const resetValues = defaultFilterValues();
    localStorage.removeItem(FILTERS_STORAGE_KEY);
    setValues(resetValues);
    setHasSearched(false);
    clearDeskWiseBookingData();
    setGridData([]);
    setGridColumnDefs([]);
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "SNo",
        headerName: "S.No",
        minWidth: 70,
        maxWidth: 80,
        headerClass: "text-blue-v2",
        valueGetter: (params) => {
          if (params.data?.isTotal) return "Total";
          return params.node.rowIndex + 1;
        },
      },
      {
        headerName: "Desk Information",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          textCol("createdBy", "Created By", 150),
          textCol("visitorType", "Visitor Type", 140),
        ],
      },
      {
        headerName: "Total Transactions",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("totalNoOfTransactions", "Total No. of Transactions", 180),
          numericCol("totalAmountRs", "Total Amount (₹)", 150),
        ],
      },
      {
        headerName: "Paytm",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("paytmNoOfTransactions", "Paytm No. of Transactions", 180),
          numericCol("paytmAmountRs", "Paytm Amount (₹)", 150),
        ],
      },
      {
        headerName: "Cash",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("cashNoOfTransactions", "Cash No. of Transactions", 180),
          numericCol("cashAmountRs", "Cash Amount (₹)", 140),
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!hasSearched) return;
    const { columnDefs: nextColumnDefs } = getTotalRowData(
      deskWiseBookingData || [],
      columnDefs
    );
    setGridData(deskWiseBookingData || []);
    setGridColumnDefs(nextColumnDefs);
  }, [deskWiseBookingData, columnDefs, hasSearched]);

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
        {({ values, setFieldValue, setValues }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-3 py-3">
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
          ExportName="Desk Wise Booking Report"
          rowData={gridData}
          columnDefs={gridColumnDefs.length ? gridColumnDefs : columnDefs}
          getPagePinnedBottomRowData={getPagePinnedBottomRowData}
          isFetchLoading={isFetchDeskWiseBookingData}
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

export default DeskWiseBookingList;
