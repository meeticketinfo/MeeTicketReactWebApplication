import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Field, Form, Formik } from "formik";
import { formatToCurrency, getCurrentDateEndTime, getCurrentDateStartTime } from "../../utils/TypographyHelper";
import AgGridTable from "../tables/AgGridTable";
import { userTransaction } from "../../store/user/userTransaction";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";

const UserStatusTransactionReport = () => {
  const UserTransactionReportFilter = JSON.parse(localStorage.getItem("UserTransactionReportFilter"));
  const [allParks, setAllParks] = useState([]);
  const navigate = useNavigate();
  const { userStatusTransactionReport, isFetchUserStatusTransactionReport, fetchUserStatusTransactionReport } = userTransaction();
  const { mobileNumber, status } = useLocation().state || {};

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "date",
      maxWidth: "180",
      headerName: "Date",
      headerClass: "text-blue-v2",      
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
      field: "mobileNumber",
      headerName: "Mobile No.",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "parkName",
      headerName: "Park Name",
      maxWidth: "200",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "bookingId",
      headerName: "Booking ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "resultMsg",
      headerName: "Result Msg",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
  ]);
  
  useEffect(() => {
    const getParksByResponse = async () => {
      try {
        const response = await fetchUserStatusTransactionReport({
          ...initialValues,
          mobileNumber,
          status
        });

        const parks = response?.response?.map((item) => ({
          id: item.parkId,
          name: item.parkName,
        })).filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );
  
        setAllParks(parks);
      } catch (error) {
        console.error("Failed to fetch user status transaction report", error);
      }
    };
  
    getParksByResponse();
  }, []);

  const initialValues = {
    fromDate: UserTransactionReportFilter?.fromDate || getCurrentDateStartTime(),
    toDate: UserTransactionReportFilter?.toDate || getCurrentDateEndTime(),
    status: status || "",
    parkId: UserTransactionReportFilter?.parkId || "",
  };

  const onSubmit = (values) => {
    fetchUserStatusTransactionReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      mobileNumber: mobileNumber,
      parkId: values.parkId,
      status: values.status || "",
    });
  };
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                User Status Transaction Report
              </h1>
            </div>
            <div className="">
              <button
                onClick={() => navigate("/user-transaction")}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </button>
            </div>
          </div>
          <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
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
                      type="datetime-local"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // min={values.fromDate || getCurrentDateStartTime()}
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    >
                      <option value="">Select Status</option>
                      <option value="CONFIRMED">Success</option>
                      <option value="INPROCESS">In Process</option>
                      <option value="FAILED">Failed</option>
                    </Field>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Location
                    </label>

                    <Select
                      name="parkId"
                      value={
                        allParks
                          ?.map((park) => ({
                            value: park.id,
                            label: park.name,
                          }))
                          .find((option) => option.value === values.parkId) || null
                      }
                      options={allParks
                        ?.map((park) => ({
                          value: park.id,
                          label: park.name,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue("parkId", selectedOption?.value || "")
                      }
                      isClearable
                      placeholder="Location"
                      className="mt-[4px] text-sm"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          outline: "none",
                          boxShadow: "none",
                          borderColor: "#ced4da",
                          borderRadius: "6px",
                          height: "30px",
                          minHeight: "33px",
                        }),

                        menu: (base) => ({
                          ...base,
                          // padding: "4px 0",
                        }),
                        option: (base, { isFocused }) => ({
                          ...base,
                          fontSize: "0.775rem",
                          backgroundColor: isFocused ? "#F8F8F8" : "white",
                          color: isFocused ? "#0C3771" : "#6D7072",
                          cursor: "pointer",
                        }),
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      disabled={isFetchUserStatusTransactionReport}
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={userStatusTransactionReport}
              columnDefs={columnDefs}
              isFetchLoading={isFetchUserStatusTransactionReport}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default UserStatusTransactionReport;