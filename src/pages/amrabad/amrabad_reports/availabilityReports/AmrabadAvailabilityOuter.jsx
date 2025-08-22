import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { useAmarabadAvailabilityReportsStore } from "./store/AmarabadAvailabilityReportsStore";
import AmarabdAvailabilityOuterList from "./AmarabadAvailabilityOuterList";
const AmrabadAvailabilityOuter = () => {
  const { fetchAmarabadAvailabilityOuterReports, amrabadAvailabilityOuterReports, isFetchAmarabadAvailabilityOuterReportsLoading } = useAmarabadAvailabilityReportsStore();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showInnerReport, setShowInnerReport] = useState(false);
  const [hiddenFields, setHiddenFields] = useState({
    month: false,
    year: false,
    fromDate: false,
    toDate: false,
  });

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const years = [];
  for (let year = currentYear; year <= currentYear + 15; year++) {
    years.push(year);
  }

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    month: currentMonth,
    year: currentYear,
  };

  // Exact data from the image
  const exactData = [
    {
      sno: 1,
      date: "01-06 2025",
      chitalandotter: "2/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "4/4",
      farhatreehouse: "2/4",
      rivertern: "2/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "4/4",
      crocodile: "2/4",
    },
    {
      sno: 2,
      date: "02-06 2025",
      chitalandotter: "2/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "2/4",
      farhatreehouse: "2/4",
      rivertern: "2/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "2/4",
      crocodile: "2/4",
    },
    {
      sno: 3,
      date: "03-06 2025",
      chitalandotter: "2/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "3/4",
      farhatreehouse: "2/4",
      rivertern: "2/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "3/4",
      crocodile: "2/4",
    },
    {
      sno: 4,
      date: "04-06 2025",
      chitalandotter: "2/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "2/4",
      farhatreehouse: "3/4",
      rivertern: "2/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "2/4",
      crocodile: "3/4",
    },
    {
      sno: 5,
      date: "05-06 2025",
      chitalandotter: "2/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "2/4",
      farhatreehouse: "3/4",
      rivertern: "2/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "2/4",
      crocodile: "3/4",
    },
    {
      sno: 6,
      date: "06-06 2025",
      chitalandotter: "3/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "1/4",
      farhatreehouse: "2/4",
      rivertern: "3/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "1/4",
      crocodile: "2/4",
    },
    {
      sno: 7,
      date: "07-06 2025",
      chitalandotter: "2/4",
      dhuvasambar: "4/4",
      chenchuhutroundmudhouse: "2/4",
      farhatreehouse: "2/4",
      rivertern: "2/4",
      turtlehouse: "4/4",
      tortoisedenhouse: "2/4",
      crocodile: "2/4",
    },
    {
      sno: 8,
      date: "08-06 2025",
      chitalandotter: "4/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "2/4",
      farhatreehouse: "1/4",
      rivertern: "4/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "2/4",
      crocodile: "1/4",
    },
    {
      sno: 9,
      date: "09-06 2025",
      chitalandotter: "2/4",
      dhuvasambar: "2/4",
      chenchuhutroundmudhouse: "1/4",
      farhatreehouse: "2/4",
      rivertern: "2/4",
      turtlehouse: "2/4",
      tortoisedenhouse: "1/4",
      crocodile: "2/4",
    },
  ];

  // Handle cell click for inner report
  const handleCellClick = (params) => {
    if (params.column.colId !== "sno" && params.column.colId !== "date") {
      setSelectedCell({
        date: params.data.date,
        accommodation: params.column.colDef.headerName,
        resort: params.column.parent?.colDef?.headerName || "Unknown Resort",
        value: params.value,
      });
      setShowInnerReport(true);
    }
  };

  // Close inner report
  const handleCloseInnerReport = () => {
    setShowInnerReport(false);
    setSelectedCell(null);
  };

  // Generate dynamic columns based on the exact data structure
  const generateExactColumns = () => {
    const baseColumns = [
      {
        headerName: "S.No",
        field: "sno",
        width: 80,
        sortable: true,
        filter: true,
        cellStyle: { fontWeight: "bold" },
        headerClass: "bg-gray-50 text-gray-400",
      },
      {
        headerName: "Dates",
        field: "date",
        width: 120,
        sortable: true,
        filter: true,
        cellStyle: { fontWeight: "bold" },
        headerClass: "bg-gray-50 text-gray-400",
      },
    ];

    const resortColumns = [
      {
        headerName: "Munnanur Jungle Resort",
        headerClass: "bg-blue-50 text-blue-800 font-bold",
        children: [
          {
            headerName: "Chital and Otter",
            field: "chitalandotter",
            width: 150,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available}/ ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
          {
            headerName: "Dhuva, Sambar",
            field: "dhuvasambar",
            width: 150,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
          {
            headerName: "Chenchu Hut - Round Mud House",
            field: "chenchuhutroundmudhouse",
            width: 200,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
          {
            headerName: "Farha - Tree House",
            field: "farhatreehouse",
            width: 150,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
        ],
      },
      {
        headerName: "Domalapenta Akkamaha Devi Stay Package",
        headerClass: "bg-green-50 text-green-800 font-bold",
        children: [
          {
            headerName: "River Tern",
            field: "rivertern",
            width: 120,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
          {
            headerName: "Turtle House",
            field: "turtlehouse",
            width: 130,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
          {
            headerName: "Tortoise Den House",
            field: "tortoisedenhouse",
            width: 150,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
          {
            headerName: "Crocodile",
            field: "crocodile",
            width: 120,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
              if (!params.value) return "";
              const [available, total] = params.value.split("/");
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          },
        ],
      },
    ];

    return [...baseColumns, ...resortColumns];
  };

  // Initialize columns and data
  useEffect(() => {
    const columns = generateExactColumns();
    setColumnDefs(columns);
    setRowData(exactData);

    // Add global click handler
    window.handleNumberClick = (date, accommodation, resort, value) => {
      setSelectedCell({
        date: date,
        accommodation: accommodation,
        resort: resort,
        value: value,
      });
      setShowInnerReport(true);
    };
  }, []);

  // Update row data when API response changes
  useEffect(() => {
    if (amrabadAvailabilityOuterReports && amrabadAvailabilityOuterReports.length > 0) {
      setRowData(amrabadAvailabilityOuterReports);
    }
  }, [amrabadAvailabilityOuterReports]);

  const handleSubmit = async (values) => {
    console.log("Form values:", values);

    try {
      // Prepare filters for API call
      const filters = {
        startDate: values.fromDate || `${values.year}-${String(parseInt(values.month) + 1).padStart(2, '0')}-01`,
        endDate: values.toDate || getLastDateOfMonth(values.year, values.month),
        month: values.month,
        year: values.year,
        PageIndex: 1,
        pageSize: 20
      };

      // Call the outer report API
      await fetchAmarabadAvailabilityOuterReports(filters);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  // Helper function to get last date of month
  const getLastDateOfMonth = (year, month) => {
    const date = new Date(year, parseInt(month) + 1, 0);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ resetForm, values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3">
            {!hiddenFields.fromDate && (
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
                  onChange={(e) => {
                    const fromDateValue = e.target.value;
                    setFieldValue("fromDate", fromDateValue);
                    if (new Date(fromDateValue) > new Date(values.toDate)) {
                      setFieldValue("toDate", fromDateValue);
                    }
                    // Hide month and year when date is selected
                    setHiddenFields((prev) => ({
                      ...prev,
                      month: true,
                      year: true,
                    }));
                  }}
                />
              </div>
            )}
            {!hiddenFields.toDate && (
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
                    // Hide month and year when date is selected
                    setHiddenFields((prev) => ({
                      ...prev,
                      month: true,
                      year: true,
                    }));
                  }}
                />
              </div>
            )}
            {!hiddenFields.month && (
              <div>
                <label
                  htmlFor="month"
                  className="block text-xs font-medium text-gray-700"
                >
                  Month
                </label>
                <Field
                  as="select"
                  name="month"
                  className={`mt-1 block w-full px-2 py-1 border
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  onChange={(e) => {
                    setFieldValue("month", e.target.value);
                    // Hide from date and to date when month is selected
                    setHiddenFields((prev) => ({
                      ...prev,
                      fromDate: true,
                      toDate: true,
                    }));
                  }}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </Field>
              </div>
            )}
            {!hiddenFields.year && (
              <div>
                <label
                  htmlFor="year"
                  className="block text-xs font-medium text-gray-700"
                >
                  Year
                </label>
                <Field
                  as="select"
                  name="year"
                  className={`mt-1 block w-full px-2 py-1 border
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  onChange={(e) => {
                    setFieldValue("year", e.target.value);
                    // Hide from date and to date when year is selected
                    setHiddenFields((prev) => ({
                      ...prev,
                      fromDate: true,
                      toDate: true,
                    }));
                  }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Field>
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 disabled:opacity-50"
                disabled={isFetchAmarabadAvailabilityOuterReportsLoading}
              >
                {isFetchAmarabadAvailabilityOuterReportsLoading ? "Loading..." : "Search"}
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                onClick={() => {
                  resetForm();
                  setRowData(exactData);
                  setHiddenFields({
                    month: false,
                    year: false,
                    fromDate: false,
                    toDate: false,
                  });
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>

    <AmarabdAvailabilityOuterList />
    </div>
  );
};

export default AmrabadAvailabilityOuter;
