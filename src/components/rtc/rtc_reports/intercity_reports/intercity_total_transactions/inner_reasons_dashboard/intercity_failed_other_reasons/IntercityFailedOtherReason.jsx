import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import AdminLayout from "../../../../../../../layouts/AdminLayout";
import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../../utils/Helper";
import Breadcrumb from "../../../../../../../components/Breadcrumb";
import IntercityFailedOtherReasonsChart from "../../charts/IntercityFailedOtherReasonsChart";
import { useIntercityTotalTransactionStore } from "../../store/IntercityTotalTransactionStore";
import IntercityTotalCommonStore from "../../../../../../../store/rtc_total_transaction_report_store/IntercityTotalTransactionStore";
import { useIntercityMastersStore } from "../../../../../../../store/intercity/masters/intercityMastersStore";
import SearchableDropdown from "../../../../../../searchable_dropdown/SearchableDropdown";
import Select from "react-select";
const IntercityFailedOtherReason = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const busType = searchParams.get("busType");
  const mobileNumber = searchParams.get("mobileNumber");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const arrivalLocation = searchParams.get("arrivalLocation");
  const departureLocation = searchParams.get("departureLocation");
  const status = searchParams.get("status");
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { setInnerFilters, outerFilters, resetInnerFilters, innerFilters } =
    IntercityTotalCommonStore();
  const { fetchCitiesData, fetchIntercityBusTypesData, IntercityBusTypesData } =
    useIntercityMastersStore();
  const {
    fetchPaymentFailedOtherReasons,
    paymentFailedOtherReasons,
    isPaymentFailedOtherReasonsLoading,
  } = useIntercityTotalTransactionStore();

  // Pagination state
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);

  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [selectedBusType, setSelectedBusType] = useState(null);

  const busTypeOptions =
    IntercityBusTypesData?.filter((item) => item.isActive)?.map((item) => ({
      value: item.busTypesName,
      label: item.busTypesName,
    })) || [];

  const fetchDepartureCities = async (q) => {
    try {
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setDepartureCities(response.response.result);
        setArrivalCities(response.response.result);
      }
    } catch (error) {
      console.error("Error fetching departure locations:", error);
      setDepartureCities([]);
      setArrivalCities([]);
    } finally {
    }
  };

  const fetchArrivalCities = async (q) => {
    try {
      const response = await fetchCitiesData(q);
      if (response?.response?.result) {
        setArrivalCities(response.response.result);
      }
    } catch (error) {
      console.error("Error fetching arrival locations:", error);
      setArrivalCities([]);
    } finally {
    }
  };

  useEffect(() => {
    fetchIntercityBusTypesData();
    fetchDepartureCities();
    // fetchArrivalCities();
  }, []);

  const filtersToUse = {
    fromDate:
      fromDate ?? innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
    toDate: toDate ?? innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
    mobileNumber:
      mobileNumber ??
      innerFilters.mobileNumber ??
      outerFilters.mobileNumber ??
      "",
    arrivalLocation:
      arrivalLocation ??
      innerFilters.arrivalLocation ??
      outerFilters.arrivalLocation ??
      "",
    departureLocation:
      departureLocation ??
      innerFilters.departureLocation ??
      outerFilters.departureLocation ??
      "",
    busType: busType ?? innerFilters.busType ?? outerFilters.busType ?? "",
  };

  useEffect(() => {
    fetchPaymentFailedOtherReasons({
      ...filtersToUse,
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  }, [
    arrivalLocation,
    departureLocation,
    mobileNumber,
    fromDate,
    toDate,
    currentPage,
    PAGE_LIMIT,
  ]);

  const initialValues = {
    fromDate:
      fromDate ?? innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
    toDate: toDate ?? innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
    arrivalLocation:
      arrivalLocation ??
      innerFilters.arrivalLocation ??
      outerFilters.arrivalLocation ??
      "",
    departureLocation:
      departureLocation ??
      innerFilters.departureLocation ??
      outerFilters.departureLocation ??
      "",
    mobileNumber:
      mobileNumber ??
      innerFilters.mobileNumber ??
      outerFilters.mobileNumber ??
      "",
    busType: busType ?? innerFilters.busType ?? outerFilters.busType ?? "",
  };
  const onSubmit = (values) => {
    setInnerFilters({
      ...values,
      arrivalLocation: arrivalLocation || innerFilters.arrivalLocation || "",
      departureLocation:
        departureLocation || innerFilters.departureLocation || "",
    });
    fetchPaymentFailedOtherReasons({
      ...values,
      pageNumber: currentPage + 1,
      pageSize: PAGE_LIMIT,
    });
  };

  const breadcrumbItems = [
    {
      label: "Total Transactions Report",
      path: `/intercity-total-transaction?status=${status ?? ""}&mobileNumber=${
        mobileNumber || ""
      }&fromDate=${fromDate || ""}&toDate=${toDate || ""}&arrivalLocation=${
        arrivalLocation || ""
      }&departureLocation=${departureLocation || ""}&busType=${busType || ""}`,
      onclick: () => resetInnerFilters(),
    },
    {
      label: "Total Failed (Other Reasons)",
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto uppercase">
        <div className="mb-6">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        </div>
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Total Failed (Other Reasons)
            </h1>
          </div>
          <div className="">
            <Link
              to={`/intercity-total-transaction?status=${
                status ?? ""
              }&mobileNumber=${mobileNumber || ""}&fromDate=${
                fromDate || ""
              }&toDate=${toDate || ""}&arrivalLocation=${
                arrivalLocation || ""
              }&departureLocation=${departureLocation || ""}&busType=${
                busType || ""
              }`}
              className="bg-black text-white font-semibold px-4 py-1.5 rounded"
              onClick={() => {
                resetInnerFilters();
              }}
            >
              Back
            </Link>
          </div>
        </div>
        <div>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ values, setFieldValue, setValues }) => (
              <>
                <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-xs font-medium text-gray-700"
                    >
                      From Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="fromDate"
                      className={`mt-1 block w-full px-2 py-1 border
                                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      onChange={(e) => {
                        const fromDateValue = e.target.value;
                        setFieldValue("fromDate", fromDateValue);
                        if (
                          new Date(fromDateValue) > new Date(values.endDate)
                        ) {
                          // Automatically update toDate if it's earlier than fromDate
                          setFieldValue("toDate", fromDateValue);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-xs font-medium text-gray-700"
                    >
                      To Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                      Mobile No
                    </label>
                    <Field
                      type="text"
                      name="mobileNumber"
                      placeholder="Enter Mobile No"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Bus Type
                    </label>
                    <Field
                      as="select"
                      name="busType"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                      <option value="">All</option>
                      {IntercityBusTypesData?.filter(
                        (item) => item.isActive
                      ).map((item) => (
                        <option value={item.busTypesName}>
                          {item.busTypesName}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Departure Location
                    </label>
                    <SearchableDropdown
                      key={`departure-${values.departureLocation || "empty"}`}
                      name="departureLocation"
                      value={values.departureLocation}
                      onChange={(value) =>
                        setFieldValue("departureLocation", value)
                      }
                      onSearch={fetchDepartureCities}
                      options={departureCities}
                      displayKey="cityName"
                      valueKey="cityId"
                      placeholder="Search"
                      minSearchLength={2}
                      debounceMs={300}
                      className="mt-1"
                      inputClassName="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      dropdownClassName="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                      optionClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      // loading={isIntercityTotalTransactionsLoading}
                      noResultsText="No cities found"
                      loadingText="Searching cities..."
                      initialDisplayText={values.departureLocation}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="arrivalLocation"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Arrival Location
                    </label>
                    <SearchableDropdown
                      key={`arrival-${values.arrivalLocation || "empty"}`}
                      name="arrivalLocation"
                      value={values.arrivalLocation}
                      onChange={(value) =>
                        setFieldValue("arrivalLocation", value)
                      }
                      onSearch={fetchArrivalCities}
                      options={arrivalCities}
                      displayKey="cityName"
                      valueKey="cityId"
                      placeholder="Search"
                      minSearchLength={2}
                      debounceMs={300}
                      className="mt-1"
                      inputClassName="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      dropdownClassName="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                      optionClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      // loading={isIntercityTotalTransactionsLoading}
                      noResultsText="No cities found"
                      loadingText="Searching cities..."
                      initialDisplayText={values.arrivalLocation}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      // disabled={isfetchAllMetroBookingDetailsReportsLoading}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                      onClick={() => {
                        setValues({
                          fromDate: startOfDay,
                          toDate: endOfDay,
                          mobileNumber: "",
                          arrivalLocation: "",
                          departureLocation: "",
                          busType: "",
                        });
                        resetInnerFilters();
                        setCurrentPage(0);
                        fetchPaymentFailedOtherReasons({
                          fromDate: startOfDay,
                          toDate: endOfDay,
                          mobileNumber: "",
                          arrivalLocation: "",
                          departureLocation: "",
                          busType: "",
                          pageNumber: 1,
                          pageSize: PAGE_LIMIT,
                        });
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </Form>

                <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
                  <div className="flex">
                    <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
                      {isPaymentFailedOtherReasonsLoading && (
                        <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                          <div className="loader"></div>
                        </div>
                      )}
                      <IntercityFailedOtherReasonsChart
                        data={paymentFailedOtherReasons || []}
                        title="Failed Other Reasons"
                        angleKey="subCategoryCount"
                        calloutLabelKey="subCategory"
                        arrivalLocation={values.arrivalLocation}
                        departureLocation={values.departureLocation}
                        mobileNumber={values.mobileNumber}
                        fromDate={values.fromDate}
                        toDate={values.toDate}
                        busType={values.busType}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </AdminLayout>
  );
};

export default IntercityFailedOtherReason;
