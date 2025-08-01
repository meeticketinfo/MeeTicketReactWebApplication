import React, { useEffect, useState } from "react";
import DashboardCard01 from "../../partials/dashboard/DashboardCard01";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { getCurrentDate } from "../../utils/TypographyHelper";
import { superballs } from "ldrs";
import CountUp from "react-countup";
import AgGridTable from "../tables/AgGridTable";
import DashboardCard07 from "../../partials/dashboard/DashboardCard07";
import { Field, Form, Formik } from "formik";
import { useRtcDashboardStore } from "../../store/rtc/RtcDashboardStore";
import PieChart from "../../config/dashboard/Piecharts";
import RtcPieChart from "../../config/dashboard/RtcPieChart";

function RtcDasboard() {
  superballs.register();
  const {
    fetchallPassData,
    allPassData,
    isFetchAllPassDataLoading,
    fetchallPassTypeData,
    allPassTypeData,
    fetchallbuspasses,
    allbuspassData,
    isFetchAllPassTypeDataLoading,
    fetchallDashboardReportData,
    allDashboardReportData,
    isFetchDashboardReportDataLoading,
  } = useRtcDashboardStore();
 console.log("allDashboardReportData",allDashboardReportData)
  const [DashboardDate, setDashboardDate] = useState(getCurrentDate());
  const initialValues = {
    fromDate: "",
    toDate: "",
  };

  const ReportinitialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    passTypeId: "",
  };
  const dashboardCards = [
    {
      lableName: "Total Passes ",
      count: allPassData?.totalPasses || "50",
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Amount ",
      count: allPassData?.totalAmount || "50",
      icon: FaIndianRupeeSign,
    },
  ];
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
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "userName",
      headerName: "User Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "passType",
      headerName: "Pass Type",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
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
      field: "bookingAmount",
      headerName: "Booking Amount",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "status",
      headerName: " Status",

      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value?.toLowerCase() === "approved"
                ? "bg-green-100 text-green-700 shadow-md"
                : params.value?.toLowerCase() === "Issued"
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

  useEffect(() => {
    fetchallPassData({
      fromDate: "",
      toDate: "",
      active: false,
    });
    fetchallPassTypeData({
      fromDate: "",
      toDate: "",
      active: false,
    });
    fetchallDashboardReportData({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      passTypeId: "",
      active: false,
    });
    fetchallbuspasses();
  }, []);

  // overAll on submit
  const overAllOnSubmit = (values) => {
    fetchallPassData({ ...values, active: true });
  };
  const allPassTypeOnSubmit = (values) => {
    fetchallPassTypeData({ ...values, active: true });
  };
  // report on submit
  const reportOnSubmit = (values) => {
    fetchallDashboardReportData({ ...values, active: true });
  };
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <Formik initialValues={initialValues} onSubmit={overAllOnSubmit}>
            {({ values, setFieldValue }) => (
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
                      min={values.fromDate || getCurrentDate()} // Ensure toDate can't be earlier than fromDate
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
                      // disabled={isFetchEntityBookingsLoading}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        {dashboardCards &&
          dashboardCards.map((card, index) => (
            <DashboardCard01
              key={index} // It's important to provide a key when rendering lists
              lableName={card.lableName}
              count={card.count}
              percentageChange={card.percentageChange}
              icon={card.icon}
            />
          ))}

        <div className="col-span-full ">
          <h1 className=" text-xl font-bold">Pass Details</h1>
          {true && (
            <div className="col-span-full ">
              <Formik
                initialValues={initialValues}
                onSubmit={allPassTypeOnSubmit}
              >
                {({ values, setFieldValue }) => (
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
                          type="date"
                          name="fromDate"
                          className={`mt-1 block w-full px-2 py-1 border
         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          // min={getCurrentDate()}
                          onChange={(e) => {
                            const fromDateValue = e.target.value;
                            setFieldValue("fromDate", fromDateValue);
                            if (
                              new Date(fromDateValue) > new Date(values.toDate)
                            ) {
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
                          min={values.fromDate || getCurrentDate()} // Ensure toDate can't be earlier than fromDate
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
                          // disabled={isFetchEntityBookingsLoading}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
        {false ? (
          <div className="px-96 py-20">
            <l-superballs size="40" speed="1.4" color="black"></l-superballs>
          </div>
        ) : (
          allPassTypeData?.map((services, serviceIndex, index) => (
            <div
              key={serviceIndex}
              className={`flex flex-col col-span-full justify-center   md:col-span-4
                  
               bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200`}
            >
              <div className="flex items-center ">
                <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-gray-400 border  rounded-lg shadow-md shadow-gray-300">
                  {/* <img
                    src={FaIndianRupeeSign}
                    className="text-3xl font-bold text-white dark:text-gray-100  w-8"
                  /> */}
                  <FaIndianRupeeSign className="text-3xl font-bold text-white dark:text-gray-100" />
                </div>
                <div className="flex-shrink-0 ml-3">
                  <span className="text-2xl font-bold leading-none text-gray-600">
                    <CountUp
                      end={services.totalPasses}
                      duration={2}
                      prefix=""
                      separator=","
                    />
                  </span>
                  <h1 className="text-sm font-medium">
                    {services.passTypeName}
                  </h1>
                  {services.passTypeName === "Student  Bus Pass " && (
                    <div className="flex flex-wrap gap-2  ">
                      {/* APPROVED */}
                      <div className="flex gap-[2px] items-center">
                        <h3 className="text-xs font-semibold text-gray-500">
                          Approved:
                        </h3>
                        <h3 className="text-base font-semibold text-gray-500">
                          20
                        </h3>
                      </div>
                      {/* PENDING */}
                      <div className="flex gap-[2px] items-center">
                        <h3 className="text-xs font-semibold text-gray-500">
                          Pending:
                        </h3>
                        <h3 className="text-base font-semibold text-gray-500">
                          30
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {/* pi chart */}
        <DashboardCard07>
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <RtcPieChart
                data={allPassTypeData}
                title="Total Passes"
                angleKey="totalPasses"
              />
            </div>
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <RtcPieChart
                data={allPassTypeData}
                title="Total Amount "
                angleKey="totalAmount"
              />
            </div>
          </div>
        </DashboardCard07>
        {/* REPOPRT */}
        <DashboardCard07 header={true} title="Location Bookings">
          <div className="">
            <div>
              <Formik
                initialValues={ReportinitialValues}
                onSubmit={reportOnSubmit}
              >
                {({ values, setFieldValue }) => (
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
                          type="date"
                          name="fromDate"
                          className={`mt-1 block w-full px-2 py-1 border
      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          // min={getCurrentDate()}
                          onChange={(e) => {
                            const fromDateValue = e.target.value;
                            setFieldValue("fromDate", fromDateValue);
                            if (
                              new Date(fromDateValue) > new Date(values.toDate)
                            ) {
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
                          min={values.fromDate || getCurrentDate()} // Ensure toDate can't be earlier than fromDate
                          onChange={(e) => {
                            const toDateValue = e.target.value;
                            setFieldValue("toDate", toDateValue);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium">
                          Pass Type <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="select"
                          name="passTypeId"
                          className={`mt-1 block w-full px-2 py-1 border border-gray-300  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                        >
                          <option value="">Select Pass Type</option>
                          {allbuspassData?.map((buspasses, i) => (
                            <option key={i} value={buspasses.passTypeId}>
                              {buspasses.passTypeName}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                          // disabled={isFetchEntityBookingsLoading}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <AgGridTable
              isFetchLoading={isFetchDashboardReportDataLoading}
              rowData={allDashboardReportData || []}
              columnDefs={columnDefs}
            />
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default RtcDasboard;
