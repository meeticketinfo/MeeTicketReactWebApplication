import React, { useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import { Field, Form, Formik } from "formik";

import {
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../../utils/Helper";
import AdminLayout from "../../../../../../../layouts/AdminLayout";
import AmarabadTotalCommonStore from "../../../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";
import Breadcrumb from "../../../../../../../components/Breadcrumb";
import IntercityNotGeneratedChart from "../../charts/IntercityNotGenerateChart";
    
import { useIntercityTotalTransactionStore } from "../../store/IntercityTotalTransactionStore";
const IntercityNotGenerated = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const packageName = searchParams.get("package");
  const house = searchParams.get("house");
  const mobileNumber = searchParams.get("mobileNumber");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const subCategory = searchParams.get("subCategory");
  
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  const { setInnerFilters, outerFilters, resetInnerFilters, innerFilters } =
    AmarabadTotalCommonStore();

  const {
    fetchPaymentsuccessButTicketNotGenerated,
    paymentsuccessButTicketNotGenerated,
    isPaymentsuccessButTicketNotGeneratedLoading,
  } = useIntercityTotalTransactionStore();

  

  useEffect(() => {
    fetchPaymentsuccessButTicketNotGenerated({
      fromDate: fromDate ?? innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
      toDate: toDate ?? innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
      mobileNumber:
        mobileNumber ?? innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
      arrivalLocation: innerFilters.arrivalLocation ?? "",
      departureLocation: innerFilters.departureLocation ?? "",
    });
  }, [mobileNumber, fromDate, toDate]);

  const initialValues = {
    fromDate: fromDate ?? innerFilters.fromDate ?? outerFilters.fromDate ?? startOfDay,
    toDate: toDate ?? innerFilters.toDate ?? outerFilters.toDate ?? endOfDay,
    mobileNumber: mobileNumber ?? innerFilters.mobileNumber ?? outerFilters.mobileNumber ?? "",
    arrivalLocation: innerFilters.arrivalLocation ?? "",
    departureLocation: innerFilters.departureLocation ?? "",
  };
  const onSubmit = (values) => {
    setInnerFilters({
      ...values,
      subCategory: subCategory ?? innerFilters.subCategory ?? "",
    });
    fetchPaymentsuccessButTicketNotGenerated(values);
  };

  const breadcrumbItems = [
    {
      label: "Total Transactions Report",
      path: `/intercity-total-transaction?status=${status ?? ""}&mobileNumber=${mobileNumber ?? ""}&fromDate=${fromDate ?? ""}&toDate=${toDate ?? ""}`,
      onclick: () => resetInnerFilters(),
    },
    {
      label: "Ticket Not Generated Transactions Report",
      isLast: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Payment Successful but Ticket not Generated
            </h1>
          </div>
          <div className="">
            <Link
              to={`/intercity-total-transaction?&mobileNumber=${mobileNumber ?? ""}&fromDate=${fromDate ?? ""}&toDate=${toDate ?? ""}`}
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
                <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-2">
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
                      Mobile Number
                    </label>
                    <Field
                      type="text"
                      name="mobileNumber"
                      placeholder="Enter Mobile Number"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    />
                  </div>

                  {/* Arrival Location */}
                  <div>
                    <label
                      htmlFor="arrivalLocation"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Arrival Location
                    </label>
                    <Field
                      as="select"
                      name="arrivalLocation"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      onChange={(e) => {
                        setFieldValue("arrivalLocation", e.target.value);
                      }}
                    >
                      <option value="">Select</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="warangal">Warangal</option>
                      <option value="karimnagar">Karimnagar</option>
                      <option value="nizamabad">Nizamabad</option>
                      <option value="adilabad">Adilabad</option>
                      <option value="khammam">Khammam</option>
                      <option value="medak">Medak</option>
                      <option value="rangareddy">Rangareddy</option>
                      <option value="nalgonda">Nalgonda</option>
                      <option value="mahabubnagar">Mahabubnagar</option>
                      <option value="siddipet">Siddipet</option>
                      <option value="yadadri">Yadadri</option>
                      <option value="suryapet">Suryapet</option>
                      <option value="jagtial">Jagtial</option>
                      <option value="rajanna">Rajanna</option>
                      <option value="peddapalli">Peddapalli</option>
                      <option value="jayashankar">Jayashankar</option>
                      <option value="bhupalpally">Bhupalpally</option>
                      <option value="mulugu">Mulugu</option>
                      <option value="bhadradri">Bhadradri</option>
                      <option value="ashwaraopet">Ashwaraopet</option>
                      <option value="kothagudem">Kothagudem</option>
                      <option value="mancherial">Mancherial</option>
                      <option value="komaram">Komaram</option>
                      <option value="kumuram">Kumuram</option>
                      <option value="other">Other</option>
                    </Field>
                  </div>

                  {/* Departure Location */}
                  <div>
                    <label
                      htmlFor="departureLocation"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Departure Location
                    </label>
                    <Field
                      as="select"
                      name="departureLocation"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      onChange={(e) => {
                        setFieldValue("departureLocation", e.target.value);
                      }}
                    >
                      <option value="">Select</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="warangal">Warangal</option>
                      <option value="karimnagar">Karimnagar</option>
                      <option value="nizamabad">Nizamabad</option>
                      <option value="adilabad">Adilabad</option>
                      <option value="khammam">Khammam</option>
                      <option value="medak">Medak</option>
                      <option value="rangareddy">Rangareddy</option>
                      <option value="nalgonda">Nalgonda</option>
                      <option value="mahabubnagar">Mahabubnagar</option>
                      <option value="siddipet">Siddipet</option>
                      <option value="yadadri">Yadadri</option>
                      <option value="suryapet">Suryapet</option>
                      <option value="jagtial">Jagtial</option>
                      <option value="rajanna">Rajanna</option>
                      <option value="peddapalli">Peddapalli</option>
                      <option value="jayashankar">Jayashankar</option>
                      <option value="bhupalpally">Bhupalpally</option>
                      <option value="mulugu">Mulugu</option>
                      <option value="bhadradri">Bhadradri</option>
                      <option value="ashwaraopet">Ashwaraopet</option>
                      <option value="kothagudem">Kothagudem</option>
                      <option value="mancherial">Mancherial</option>
                      <option value="komaram">Komaram</option>
                      <option value="kumuram">Kumuram</option>
                      <option value="other">Other</option>
                    </Field>
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
                          package: "",
                          house: "",
                          mobileNumber: "",
                          arrivalLocation: "",
                          departureLocation: "",
                        });
                        resetInnerFilters();
                        fetchPaymentsuccessButTicketNotGenerated({
                          fromDate: startOfDay,
                          toDate: endOfDay,
                          mobileNumber: "",
                          package: "",
                          house: "",
                          arrivalLocation: "",
                          departureLocation: "",
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
                      {isPaymentsuccessButTicketNotGeneratedLoading && (
                        <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                          <div className="loader"></div>
                        </div>
                      )}
                      <IntercityNotGeneratedChart
                        data={paymentsuccessButTicketNotGenerated || []}
                        title="Payment Successful but Ticket not Generated"
                        angleKey="subCategoryCount"
                        calloutLabelKey="subCategory"
                        mobileNumber={values.mobileNumber}
                        fromDate={values.fromDate}
                        toDate={values.toDate}
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

export default IntercityNotGenerated;
