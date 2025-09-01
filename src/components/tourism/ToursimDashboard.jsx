import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import DashboardCard01 from "../../partials/dashboard/DashboardCard01";
import useAuthStore from "../../store/authStore";
import { IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { getCurrentDate } from "../../utils/TypographyHelper";
import Select from "react-select";
import DashboardCard07 from "../../partials/dashboard/DashboardCard07";
import ToursimPieChart from "./ToursimPieChart";
import AgGridTable from "../tables/AgGridTable";
import { usetoursimDashboardStore } from "../../store/dashboard/toursimDashboardStore";

function ToursimDashboard() {
  const {
    fetchallPackageCategoriesData,
    allPackageCategoriesData,
    isFetchallPackageCategoriesDataLoading,
    fetchallPackagesData,
    allPackagesData,
    isFetchAllPackagesDataLoading,
    fetchallPieChartPackagesData,
    allPieChartPackagesData,
    isFetchAllPieChartPackagesDataLoading,
    fetchallPackageTransactionReportData,
    isFetchallPackageTransactionReportDataLoading,
    allPackageTransactionReportData,
  } = usetoursimDashboardStore();
  console.log(
    "allPackageTransactionReportData",
    allPackageTransactionReportData
  );
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "totalFare",
      headerName: "Total Fare",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "toStationName",
      headerName: "To Station Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "purchaseDate",
      headerName: "Purchase Date",
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
      field: "ticketActualFare",
      headerName: "Ticket Actual Fare",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "ticketType",
      headerName: "Ticket Type",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "ticketID",
      headerName: "Ticket ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
  
   
  ]);
  useEffect(() => {
    fetchallPackagesData({
      fromDate: "",
      toDate: "",
      TypeId: "",
      ticketType: "",
      active: false,
    });
    fetchallPieChartPackagesData({
      fromDate: "",
      toDate: "",
      TypeId: "",
      ticketType: "",
      active: false,
    });
    fetchallPackageCategoriesData();
    fetchallPackageTransactionReportData({
      fromDate: "",
      toDate: "",
    });
  }, []);

  const dashboardCards = [
    {
      lableName: "Total Tickets",
      count: allPackagesData?.totalBookings,
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Income",
      count: allPackagesData?.totalAmount,
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const cardsToDisplay = dashboardCards;

  const initialValues = {
    fromDate: "",
    toDate: "",
    TypeId: "",
    ticketType: "",
  };
  const overAllOnSubmit = (values) => {
    // console.log("values", values);
    fetchallPackagesData({ ...values, active: true });
    fetchallPieChartPackagesData({ ...values, active: true });
  };
  const ReportInitialValues = {
    fromDate: "",
    toDate: "",
    
  };
  const reportOnSubmit = (values) => {
    fetchallPackageTransactionReportData({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };
  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-12 gap-6  ">
        <div className="col-span-full ">
          <Formik initialValues={initialValues} onSubmit={overAllOnSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
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
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Package Category
                    </label>

                    <Select
                      name="TypeId"
                      value={
                        allPackageCategoriesData
                          ?.filter((dept) => dept.isActive)
                          .map((dept) => ({
                            value: dept.categoryTypeId,
                            label: dept.categoryName,
                          }))
                          .find((option) => option.value === values.TypeId) ||
                        null // Use values.entityId
                      }
                      options={allPackageCategoriesData
                        ?.filter((entity) => entity.isActive)
                        .map((entity) => ({
                          value: entity.categoryTypeId,
                          label: entity.categoryName,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue("TypeId", selectedOption?.value || "")
                      }
                      isClearable
                      placeholder="Package Category"
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
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Ticket Type
                    </label>

                    <Select
                      name="ticketType"
                      value={
                        [
                          { value: "Adult", label: "Adult" },
                          { value: "Child", label: "Child" },
                        ].find(
                          (option) => option.value === values.ticketType
                        ) || null
                      }
                      options={[
                        { value: "Adult", label: "Adult" },
                        { value: "Child", label: "Child" },
                      ]}
                      onChange={(selectedOption) =>
                        setFieldValue("ticketType", selectedOption?.value || "")
                      }
                      isClearable
                      placeholder="Ticket Type"
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
        {cardsToDisplay &&
          cardsToDisplay.map((card, index) => (
            <DashboardCard01
              key={index} // It's important to provide a key when rendering lists
              lableName={card.lableName}
              count={card.count}
              percentageChange={card.percentageChange}
              icon={card.icon}
            />
          ))}
        {/* pie chart */}
        <DashboardCard07>
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <ToursimPieChart
                data={allPieChartPackagesData}
                title="Total Tickets Booked Based on Package services "
                angleKey="totalBookings"
              />
            </div>
            <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
              <ToursimPieChart
                data={allPieChartPackagesData}
                title="Total Amount Generated Based on Package services "
                angleKey="totalAmount"
              />
            </div>
          </div>
        </DashboardCard07>
        {/* report */}
        <DashboardCard07 header={true} title="Location Bookings">
          <div className="">
            <div>
              <Formik initialValues={ReportInitialValues} onSubmit={reportOnSubmit}>
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
            <AgGridTable
              isFetchLoading={isFetchallPackageTransactionReportDataLoading}
              rowData={allPackageTransactionReportData || []}
              columnDefs={columnDefs}
              // onPageChange={handlePageChange}
              // totalRecords={totalEntityBookingRecords}
              // enableAdvancedFilter={true}
            />
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default ToursimDashboard;
