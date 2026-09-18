import React, { useEffect, useMemo, useState } from "react";
import { useSummaryReportStore } from "../../../store/metro_reports/summaryReportStore";
import useAuthStore from "../../../store/authStore";
import AgGridTable from "../../tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { PiCurrencyInr } from "react-icons/pi";
import { getTotalRowData } from "../../../utils/getTotalRowData";
function SummaryReportList() {
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const {
    allMetroSummaryReports,
    fetchAllMetroSummaryReport,
    isFetchAllMetroSummaryReportsLoading,
  } = useSummaryReportStore();

  useEffect(() => {
    fetchAllMetroSummaryReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchAllMetroSummaryReport]);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [gridData, setGridData] = useState([]);
  const [gridColumnDefs, setGridColumnDefs] = useState([]);
  const pageSize = Number(PAGE_LIMIT) || 20;

  const allReportRows = useMemo(() => {
    if (Array.isArray(allMetroSummaryReports)) {
      return allMetroSummaryReports;
    }
    return [];
  }, [allMetroSummaryReports]);

  const onSubmit = (values) => {
    setCurrentPage(0);
    fetchAllMetroSummaryReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };

  const columnDefs = useMemo(
    () => [
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) => {
        if (params.data?.isTotal) return "Total";
        return currentPage * pageSize + params.node.rowIndex + 1;
      },
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "paymentTransactionId",
      headerName: "Transaction ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "ltmrhlPurchaseId",
      headerName: "LTHMRL Purchase ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "ticketId",
      headerName: "Ticket ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "rjtID",
      headerName: "RJT ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "N/A" : params.value,
    },
    {
      field: "ticketTypeId",
      headerName: "Ticket Type",
      maxWidth: "160",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "fromStationName",
      headerName: "From Station Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "toStationName",
      headerName: "To Station Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "patronPhoneNumber",
      headerName: "Mobile Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "fromDate",
      headerName: "Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
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
      field: "merchantEachTicketFareAfterGst",
      headerName: "Each Ticket Fare",

      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value !== null && params.value !== undefined && params.value !== ""
          ? `Rs. ${params.value}`
          : "N/A",
      isTotal: true,
    },
    {
      field: "changeDestinationAmount",
      headerName: "Change Destination Ticket Fare",
      Width: "100",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value !== null && params.value !== undefined && params.value !== ""
          ? `Rs. ${params.value}`
          : "N/A",
      isTotal: true,
    },
    {
      field: "totalTicketAmount",
      headerName: "Total Ticket Fare",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value !== null && params.value !== undefined && params.value !== ""
          ? `Rs. ${params.value}`
          : "N/A",
      isTotal: true,
    },
    {
      field: "merchantOrderId",
      headerName: "Merchant Order Id",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentOrderId",
      headerName: "Order ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "ticketStatus",
      headerName: "Ticket Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  ],
    [currentPage, pageSize]
  );

  useEffect(() => {
    const pagedRows = allReportRows.slice(
      currentPage * pageSize,
      currentPage * pageSize + pageSize
    );
    const { rowData, columnDefs: nextColumnDefs } = getTotalRowData(
      pagedRows,
      columnDefs
    );
    setGridData(rowData);
    setGridColumnDefs(nextColumnDefs);
  }, [allReportRows, columnDefs, currentPage, pageSize]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
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
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <AgGridTable
        ExportName="Individual Ticket Details"
        rowData={gridData}
        columnDefs={gridColumnDefs.length ? gridColumnDefs : columnDefs}
        isFetchLoading={isFetchAllMetroSummaryReportsLoading}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        totalCount={allReportRows.length}
        showTotalCount={true}
        SetcurrentPage={setCurrentPage}
        tableHeight={allReportRows.length > 10 ? 560 : 330}
      />
    </>
  );
}

export default SummaryReportList;
