import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { useRtcReportStore } from "../../../../store/rtc/RtcReportStore";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import AgGridTable from "../../../tables/AgGridTable";
function OrdinaryPassReportList() {
  // const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
  //   useAuthStore();
  const {
    allOrdinaryPassReports,
    isFetchAllallOrdinaryPassReportsLoading,
    fetchAllOrdinaryPassReport,
  } = useRtcReportStore();
  console.log("DayPassDetails", allOrdinaryPassReports);
  useEffect(() => {
    fetchAllOrdinaryPassReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchAllOrdinaryPassReport]);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchAllOrdinaryPassReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };
  const [columnDefs] = useState([
     {
       headerName: "S.No",
       valueGetter: "node.rowIndex + 1",
       maxWidth: "80",
       headerClass: "text-blue-v2",
     },
     {
       field: "transactionID",
       headerName: "Transaction ID",
 
       headerClass: "text-blue-v2",
       valueFormatter: (params) => `${params.value} ` || "N/A",
     },
 
     {
       field: "userName",
       headerName: "User Name",
 
       headerClass: "text-blue-v2",
       valueFormatter: (params) => `${params.value} ` || "N/A",
     },
     {
      field: "mobileNumber",
      headerName: "Mobile Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
  
     {
       field: "purchaseDate",
       headerName: "Purchase Date ",
       headerClass: "text-blue-v2",
       valueFormatter: (params) => {
         if (!params.value) return "N/A";
         const date = new Date(params.value);
         return date.toLocaleString("en-US", {
           year: "numeric",
           month: "2-digit",
           day: "2-digit",
          
         });
       },
     },
     {
       field: "bookingDate",
       headerName: "Booking Date ",
       headerClass: "text-blue-v2",
       valueFormatter: (params) => {
         if (!params.value) return "N/A";
         const date = new Date(params.value);
         return date.toLocaleString("en-US", {
           year: "numeric",
           month: "2-digit",
           day: "2-digit",
           
         });
       },
     },
     {
       field: "startTime",
       headerName: "Start Time ",
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
       field: "endTime",
       headerName: "End Time  ",
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
       field: "totalAmount",
       headerName: "Total Amount",
 
       headerClass: "text-blue-v2",
       valueFormatter: (params) => params.value || "N/A",
     },
     {
      field: "paymentStatus",
      headerName: "Application Status",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value?.toLowerCase() === "approved"
                ? "bg-green-100 text-green-700 shadow-md"
                : params.value?.toLowerCase() === "pending"
                ? "bg-orange-100 text-orange-700 shadow-md"
                : params.value?.toLowerCase() === "rejected"
                ? "bg-red-200 text-red-800 shadow-md"
                : "bg-gray-500 text-white shadow-md"
            } text-xs font-medium me-2 px-2.5 py-0.5 rounded-md`}
          >
           
            {params.value}
          </span>
        </div>
      ),
    },
   ]);
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
      rowData={allOrdinaryPassReports}
      columnDefs={columnDefs}
      isFetchLoading={isFetchAllallOrdinaryPassReportsLoading}
      />
    </>
  );
}

export default OrdinaryPassReportList;
