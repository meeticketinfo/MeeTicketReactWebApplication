import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { Field, Form, Formik } from "formik";
import AgGridTable from "../../components/tables/AgGridTable";
import { getDateRange } from "../../utils/Helper";
import { NavLink } from "react-router-dom";
import { userDashboardStore } from "../../store/userDashboard/userDashboardStore";

function TotalTransactions({ Rangefilter, setActiveTab }) {
  const {
    fetchUserDashboardTransactionData,
    UserDashboardTransactionData,
    isUserDashboardTransactionLoading,
    setisUserViewTransactions,
  } = userDashboardStore();
  superballs.register();
  const savedPayload = JSON.parse(localStorage.getItem("transactionPayload"));
  const { fromDate: todayFrom, toDate: todayTo } = getDateRange("today");
  const formInitialValues = {
    fromDate: savedPayload?.fromDate || todayFrom,
    toDate: savedPayload?.toDate || todayTo,
    mobileNumber: savedPayload?.mobileNumber || "",
  };

  useEffect(() => {
    console.log("API Payload being sent:", savedPayload);
    fetchUserDashboardTransactionData(formInitialValues);
  }, []);

  const overAllOnSubmit = (values) => {
    const payload = {
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: values.mobileNumber,
    };
    console.log("payload", payload);
    localStorage.setItem("transactionPayload", JSON.stringify(payload));
    fetchUserDashboardTransactionData(payload);
  };
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    // -------------------

    {
      field: "phoneNumber",
      headerName: "Mobile Number",
      flex: 1,
      //   maxWidth:650,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "createdDate",
      headerName: "Registration Date",
      headerClass: "text-blue-v2",
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            to={`/user-detailed-report`}
            onClick={() => {
              setisUserViewTransactions(true);
            }}
            className="px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 bg-blue-v2 text-white hover:bg-blue-700"
          >
            View Transactions
          </NavLink>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <Formik
            enableReinitialize={true}
            initialValues={formInitialValues}
            onSubmit={overAllOnSubmit}
          >
            {({ values, setFieldValue, setValues }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
                  <div>
                    <label
                      htmlFor="fromDate"
                      className="block text-xs font-medium text-gray-700"
                    >
                      From Date
                    </label>
                    <Field
                      type="datetime-local"
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
                      className="block text-xs font-medium text-gray-700"
                    >
                      To Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="toDate"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  {/* mobile number */}
                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Mobile Number
                    </label>
                    <Field
                      type="text"
                      maxLength="10"
                      name="mobileNumber"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                      placeholder="Enter mobile number"
                      onKeyPress={(e) => {
                        if (!/^\d$/.test(e.key)) {
                          e.preventDefault(); // Prevent non-numeric characters
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      // disabled={isFetchEntityBookingsLoading}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                      onClick={() => {
                        const { fromDate: resetFromDate, toDate: resetToDate } =
                          getDateRange("today");
                        // Reset form values and filters
                        localStorage.removeItem("UserTransactionReportFilter");
                        localStorage.setItem("range-filter", "today");
                        localStorage.removeItem("transactionPayload");
                        setValues({
                          fromDate: resetFromDate,
                          toDate: resetToDate,
                        });
                        setActiveTab("today");

                        // Reset chart data by clearing relevant stores
                        fetchUserDashboardTransactionData({
                          fromDate: resetFromDate,
                          toDate: resetToDate,
                          mobileNumber: "",
                        });
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <AgGridTable
            ExportName="Completed Bookings Details"
            isFetchLoading={isUserDashboardTransactionLoading}
            rowData={UserDashboardTransactionData || []}
            columnDefs={columnDefs}
          />
        </div>
      </div>
    </>
  );
}

export default TotalTransactions;
