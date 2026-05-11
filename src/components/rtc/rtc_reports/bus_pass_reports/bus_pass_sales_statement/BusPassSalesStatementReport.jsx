import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { FaFileCsv } from "react-icons/fa";
import AdminLayout from "../../../../../layouts/AdminLayout";
import AgGridTable from "../../../../tables/AgGridTable";
import { formatToCurrency } from "../../../../../utils/TypographyHelper";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";

const getTodayDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const BusPassSalesStatementReport = () => {
  const [tableData, setTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [filterValues, setFilterValues] = useState({
    fromDate: getTodayDate(),
    toDate: getTodayDate(),
    mobileNumber: "",
    busPassTypeId: "",
  });
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [busPassTypes, setBusPassTypes] = useState([]);
  const [isBusPassTypesLoading, setIsBusPassTypesLoading] = useState(false);

  const REPORT_ENDPOINT =
    API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_DAILY_MONTHLY_SALES_STATEMENT_REPORT;

  const parseApiResponse = (response) => {
    const payload = response?.data;
    if (Array.isArray(payload)) return payload;
    if (payload?.statusCode === 200 && Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const parseTotalCount = (response, dataArray) => {
    const payload = response?.data;
    if (payload?.totalCount != null) return payload.totalCount;
    if (payload?.data?.totalCount != null) return payload.data.totalCount;
    if (payload?.count != null) return payload.count;
    if (payload?.data?.count != null) return payload.data.count;
    if (Array.isArray(dataArray) && dataArray.length > 0 && dataArray[0]?.totalCount != null)
      return dataArray[0].totalCount;
    return dataArray?.length || 0;
  };

  const buildQueryParams = (values = {}) => {
    const query = {
      FromDate: values.fromDate || undefined,
      ToDate: values.toDate || undefined,
      MobileNumber: values.mobileNumber || undefined,
      BusPassTypeId: values.busPassTypeId || undefined,
      PageNumber: values.pageNumber ?? currentPage + 1,
      PageSize: values.pageSize || PAGE_LIMIT,
    };

    return Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== "")
    );
  };

  const fetchReportData = async (values = {}) => {
    setIsFetchLoading(true);
    try {
      const params = buildQueryParams(values);
      console.log("Fetching from endpoint:", REPORT_ENDPOINT, "params:", params);
      const response = await apiService.get(REPORT_ENDPOINT, params);
      console.log("API Response:", response);

      const responseData = parseApiResponse(response);
      const count = parseTotalCount(response, responseData);
      setTableData(responseData);
      setOriginalData(responseData);
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setTableData([]);
      setOriginalData([]);
      setTotalCount(0);
    } finally {
      setIsFetchLoading(false);
    }
  };

  const fetchBusPassTypes = async () => {
    setIsBusPassTypesLoading(true);
    try {
      console.log("Fetching bus pass types from:", API_ENDPOINTS.MASTERS.BUS_PASS.GET_ALL_BUS_PASSES);
      const response = await apiService.get(API_ENDPOINTS.MASTERS.BUS_PASS.GET_ALL_BUS_PASSES);
      console.log("Bus pass types API response:", response);

      const payload = response?.data;
      let items = [];

      if (Array.isArray(payload)) {
        items = payload;
      } else if (Array.isArray(payload?.data)) {
        items = payload.data;
      } else if (Array.isArray(payload?.result)) {
        items = payload.result;
      } else if (Array.isArray(payload?.data?.data)) {
        items = payload.data.data;
      } else if (Array.isArray(payload?.busPassTypes)) {
        items = payload.busPassTypes;
      }

      if (!items.length) {
        console.warn("Bus pass types response could not be mapped to an array:", response);
      }

      setBusPassTypes(items);
    } catch (error) {
      console.error("Error fetching bus pass types:", error);
      setBusPassTypes([]);
    } finally {
      setIsBusPassTypesLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(filterValues);
    fetchBusPassTypes();
  }, []);

  const columnDefs = [
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      maxWidth: 90,
      headerClass: "text-blue-v2",
    },
    {
      field: "typeOfBusPass",
      headerName: "Type of Buspass",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "passIdNumber",
      headerName: "Pass ID Number",
      minWidth: 140,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "passAmount",
      headerName: "Pass Amount",
      maxWidth: 140,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value != null ? formatToCurrency(params.value, "INR", "en-IN") : "N/A",
    },
 
    {
      field: "orderReferenceId",
      headerName: "Order Reference ID",
      minWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionDateAndTime",
      headerName: "Transaction Date & Time",
      minWidth: 190,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const time = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${day}-${month}-${year}, ${time}`;
      },
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      maxWidth: 160,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <span
          className={`font-semibold ${
            params.value === "Success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {params.value || "N/A"}
        </span>
      ),
    },   
     {
      field: "userMobileNo",
      headerName: "Phone Number",
      minWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  ];

  const handleFilter = async (values) => {
    console.log("Search submitted with values:", values);
    setFilterValues(values);
    setCurrentPage(0);
    await fetchReportData({ ...values, pageNumber: 1, pageSize: PAGE_LIMIT });
  };

  const handleReset = (resetForm) => {
    const resetValues = {
      fromDate: getTodayDate(),
      toDate: getTodayDate(),
      mobileNumber: "",
      busPassTypeId: "",
    };
    resetForm(resetValues);
    setFilterValues(resetValues);
    setCurrentPage(0);
    fetchReportData({ ...resetValues, pageNumber: 1, pageSize: PAGE_LIMIT });
    setSearchText("");
  };

  const filteredRows = tableData.filter((row) => {
    if (!searchText) return true;
    const query = searchText.toLowerCase();
    return (
      row.typeOfBusPass.toLowerCase().includes(query) ||
      row.passIdNumber.toLowerCase().includes(query) ||
      row.orderReferenceId.toLowerCase().includes(query) ||
      row.transactionStatus.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Daily & Monthly Sales Statement
          </h1>
        </div>

        <div className="bg-white/80 shadow-sm rounded-3xl p-4">
          <Formik
            initialValues={{
              fromDate: getTodayDate(),
              toDate: getTodayDate(),
              mobileNumber: "",
              busPassTypeId: "",
            
            }}
            onSubmit={(values) => handleFilter(values)}
          >
            {({ values, setFieldValue, resetForm }) => (
              <Form className="grid gap-2 lg:grid-cols-10">

                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    From Date
                  </label>
                  <Field
                    type="date"
                    name="fromDate"
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    max={values.toDate}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    To Date
                  </label>
                  <Field
                    type="date"
                    name="toDate"
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={values.fromDate}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Type of Bus Pass
                  </label>
                  <Field
                    as="select"
                    name="busPassTypeId"
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isBusPassTypesLoading}
                  >
                    <option value="">
                      {isBusPassTypesLoading ? "Loading..." : "Bus Pass Type"}
                    </option>
                    {busPassTypes.map((passType, index) => {
                      const value =
                        passType.id ||
                        passType.busPassTypeId ||
                        passType.passTypeId ||
                        passType.typeOfBusPassId ||
                        passType.value ||
                        index;
                      const label =
                        passType.name ||
                        passType.busPassTypeName ||
                        passType.typeOfBusPass ||
                        passType.passTypeName ||
                        passType.displayName ||
                        passType.label ||
                        "Bus Pass";

                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </Field>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="mobileNumber"
                    maxLength="10"
                    placeholder="Enter mobile number"
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end gap-3 md:col-span-5 lg:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                    onClick={() => handleReset(resetForm)}
                  >
                    Reset
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-6 bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          
          <AgGridTable
            showSearch={false}
            ExportName="BusPassSalesStatementReport"
            rowData={filteredRows}
            columnDefs={columnDefs}
            isFetchLoading={isFetchLoading}
            tableHeight={filteredRows.length > 10 ? 560 : 330}
            isPagination={false}
            IsReactPaginate={true}
            setPageLimit={(value) => {
              const newPageSize = Number(value);
              setPAGE_LIMIT(newPageSize);
              setCurrentPage(0);
              fetchReportData({
                ...filterValues,
                pageNumber: 1,
                pageSize: newPageSize,
              });
            }}
            pageLimit={PAGE_LIMIT}
            handlePageClick={(item) => {
              const page = item.selected;
              setCurrentPage(page);
              fetchReportData({
                ...filterValues,
                pageNumber: page + 1,
                pageSize: PAGE_LIMIT,
              });
            }}
            currentPage={currentPage}
            showTotalCount={true}
            totalCount={totalCount}
            SetcurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default BusPassSalesStatementReport;
