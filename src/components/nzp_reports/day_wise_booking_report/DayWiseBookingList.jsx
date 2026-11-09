import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import AgGridTable from "../../tables/AgGridTable";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { displayValue } from "../../../utils/Helper";
import { getTotalRowData } from "../../../utils/getTotalRowData";
import { useNzpReportsStore } from "../../../store/nzp/NzpReportsStore";

const FILTERS_STORAGE_KEY = "nzp-day-wise-booking-filters";

const defaultFilterValues = () => ({
  fromDate: getCurrentDate(),
  toDate: getCurrentDate(),
});

const formatBookingDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return displayValue(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
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

const DayWiseBookingList = () => {
  const savedFilters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
  const {
    fetchDayWiseBookingData,
    clearDayWiseBookingData,
    dayWiseBookingData,
    isFetchDayWiseBookingData,
  } = useNzpReportsStore();

  const initialValues = {
    ...defaultFilterValues(),
    fromDate:
      savedFilters?.fromDate ||
      savedFilters?.bookingFromDate ||
      getCurrentDate(),
    toDate:
      savedFilters?.toDate || savedFilters?.bookingToDate || getCurrentDate(),
  };

  const [gridData, setGridData] = useState([]);
  const [gridColumnDefs, setGridColumnDefs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (values) => {
    if (new Date(values.fromDate) > new Date(values.toDate)) {
      return;
    }
    setHasSearched(true);
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(values));
    fetchDayWiseBookingData({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };

  const handleReset = (setValues) => {
    const resetValues = defaultFilterValues();
    localStorage.removeItem(FILTERS_STORAGE_KEY);
    setValues(resetValues);
    setHasSearched(false);
    clearDayWiseBookingData();
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
      {
        field: "bookingDate",
        headerName: "Booking Date",
        minWidth: 130,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatBookingDate(params.value),
      },
      textCol("visitorType", "Visitor Type", 140),
      textCol("createdBy", "Created By", 130),
      {
        headerName: "Payment Details",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("totalOnlineAmount", "Online Amount", 130),
          numericCol("totalCashAmount", "Cash Amount", 120),
          numericCol("totalAmount", "Total Amount", 120),
        ],
      },
      {
        headerName: "Entry Details",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("entryAdult", "Entry Adult", 110),
          numericCol("entryChild", "Entry Child", 110),
          numericCol("mainEntranceAmount", "Main Entrance Amount", 160),
        ],
      },
      {
        headerName: "Battery Operated Vehicle – Non Exclusive",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("bovNonExclusiveAdult", "Adult", 90),
          numericCol("bovNonExclusiveChild", "Child", 90),
          numericCol("bovNonExclusiveAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Battery Operated Vehicle – Exclusive",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("bovExclusive11Seater", "11 Seater", 110),
          numericCol("bovExclusive14Seater", "14 Seater", 110),
          numericCol("bovExclusiveAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Safari – Non AC",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("safariNonACAdult", "Adult", 90),
          numericCol("safariNonACChild", "Child", 90),
          numericCol("safariNonACAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Safari – AC",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("safariACAdult", "Adult", 90),
          numericCol("safariACAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Toy Train",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("toyTrainAdult", "Adult", 90),
          numericCol("toyTrainChild", "Child", 90),
          numericCol("toyTrainAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Aquarium",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("aquariumAdult", "Adult", 90),
          numericCol("aquariumChild", "Child", 90),
          numericCol("aquariumAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Nocturnal",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("nocturnalAdult", "Adult", 90),
          numericCol("nocturnalChild", "Child", 90),
          numericCol("nocturnalAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Reptile",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("reptileAdult", "Adult", 90),
          numericCol("reptileChild", "Child", 90),
          numericCol("reptileAmount", "Amount", 110),
        ],
      },
      {
        headerName: "Luggage Details",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("luggageBagUnit", "Luggage Bag Units", 140),
          numericCol("luggageBagAmount", "Luggage Bag Amount", 150),
          numericCol("bigBagUnit", "Big Bag Units", 120),
          numericCol("bigBagAmount", "Big Bag Amount", 130),
          numericCol("smallBagUnit", "Small Bag Units", 130),
          numericCol("smallBagAmount", "Small Bag Amount", 140),
        ],
      },
      {
        headerName: "Camera Details",
        headerClass: "text-blue-v2 text-center",
        marryChildren: true,
        children: [
          numericCol("stillCameraUnit", "Still Camera Units", 140),
          numericCol("stillCameraAmount", "Still Camera Amount", 150),
          numericCol("videoCameraUnit", "Video Camera Units", 140),
          numericCol("videoCameraAmount", "Video Camera Amount", 150),
          numericCol("movieCameraUnit", "Movie Camera Units", 140),
          numericCol("movieCameraAmount", "Movie Camera Amount", 150),
          numericCol("cameraLensTripodUnit", "Camera Lens/Tripod Units", 180),
          numericCol(
            "cameraLensTripodAmount",
            "Camera Lens/Tripod Amount",
            180
          ),
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!hasSearched) return;
    const { columnDefs: nextColumnDefs } = getTotalRowData(
      dayWiseBookingData || [],
      columnDefs
    );
    setGridData(dayWiseBookingData || []);
    setGridColumnDefs(nextColumnDefs);
  }, [dayWiseBookingData, columnDefs, hasSearched]);

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
                min={values.fromDate || getCurrentDate()}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                onChange={(e) => {
                  setFieldValue("toDate", e.target.value);
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
          ExportName="Day Wise Booking Report"
          rowData={gridData}
          columnDefs={gridColumnDefs.length ? gridColumnDefs : columnDefs}
          getPagePinnedBottomRowData={getPagePinnedBottomRowData}
          isFetchLoading={isFetchDayWiseBookingData}
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

export default DayWiseBookingList;
