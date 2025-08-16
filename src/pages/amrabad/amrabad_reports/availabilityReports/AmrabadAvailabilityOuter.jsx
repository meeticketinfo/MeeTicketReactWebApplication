import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import AgGridTable from "../../../../components/tables/AgGridTable";

const AmrabadAvailabilityOuter = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showInnerReport, setShowInnerReport] = useState(false);

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
  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
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
      crocodile: "2/4"
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
      crocodile: "2/4"
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
      crocodile: "2/4"
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
      crocodile: "3/4"
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
      crocodile: "3/4"
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
      crocodile: "2/4"
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
      crocodile: "2/4"
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
      crocodile: "1/4"
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
      crocodile: "2/4"
    }
  ];

  // Handle cell click for inner report
  const handleCellClick = (params) => {
    if (params.column.colId !== 'sno' && params.column.colId !== 'date') {
      setSelectedCell({
        date: params.data.date,
        accommodation: params.column.colDef.headerName,
        resort: params.column.parent?.colDef?.headerName || 'Unknown Resort',
        value: params.value
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
        cellStyle: { fontWeight: 'bold' },
        headerClass: "bg-gray-50 text-gray-400",
      },
      {
        headerName: "Dates",
        field: "date",
        width: 120,
        sortable: true,
        filter: true,
        cellStyle: { fontWeight: 'bold' },
        headerClass: "bg-gray-50 text-gray-400",
      }
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          }
        ]
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
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
              if (!params.value) return '';
              const [available, total] = params.value.split('/');
              return `${available} / ${total}`;
            },
            headerClass: "bg-gray-50 text-gray-400",
          }
        ]
      }
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
        value: value
      });
      setShowInnerReport(true);
    };
  }, []);

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    setIsLoading(true);
    
    try {
      // Here you would fetch data from API based on the form values
      // For now, we'll use the exact data from the image
      setTimeout(() => {
        setRowData(exactData);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching availability data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ resetForm, values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3">
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
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Field>
            </div>
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
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Field>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Search"}
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                onClick={() => {
                  resetForm();
                  setRowData(exactData);
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-8">
       
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <AgGridTable
            ExportName="Availability Report"
            isPagination={false}
            IsReactPaginate={true}
            columnDefs={columnDefs}
            rowData={rowData}
            showSearch={false}
            tableHeight={600}
          />
        )}
      </div>

      {/* Inner Report Modal */}
      {showInnerReport && selectedCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Detailed Availability Information
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Date: {selectedCell.date} | Resort: {selectedCell.resort} | Accommodation: {selectedCell.accommodation}
                </p>
              </div>
              <button
                onClick={handleCloseInnerReport}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-800">Available Units</h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedCell.value.split('/')[0]}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-sm font-medium text-green-800">Total Units</h3>
                  <p className="text-2xl font-bold text-green-900">
                    {selectedCell.value.split('/')[1]}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-sm font-medium text-orange-800">Occupancy Rate</h3>
                  <p className="text-2xl font-bold text-orange-900">
                    {Math.round((selectedCell.value.split('/')[0] / selectedCell.value.split('/')[1]) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Resort:</strong> {selectedCell.resort}</p>
                    <p><strong>Accommodation Type:</strong> {selectedCell.accommodation}</p>
                    <p><strong>Date:</strong> {selectedCell.date}</p>
                  </div>
                  <div>
                    <p><strong>Availability:</strong> {selectedCell.value}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedCell.value.split('/')[0] > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCell.value.split('/')[0] > 0 ? 'Available' : 'Fully Booked'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmrabadAvailabilityOuter;
