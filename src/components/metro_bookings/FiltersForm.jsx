import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";

const FiltersForm = () => {


    return (
      <>
        {/* Filters for Metro Bookings*/}
        <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
          <Formik>
            <Form autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                {/* From date */}
                <div>
                  <label
                    htmlFor="fromDate"
                    className="block text-sm font-medium"
                  >
                    From Date
                  </label>
                  <Field
                    name="Street1"
                    type="date"
                    className={`mt-1 block w-full px-2 py-1 border
                    ? "border-red-500"
                    : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                </div>
                {/* To date */}
                <div>
                  <label htmlFor="toDate" className="block text-sm font-medium">
                    To Date
                  </label>
                  <Field
                    name="Street1"
                    type="date"
                    className={`mt-1 block w-full px-2 py-1 border 
                    ? "border-red-500"
                    : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    From station
                  </label>
                  <Field
                    as="select"
                    name="DepartmentId"
                    className={`mt-1 block w-full px-2 py-1 border
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select From Station</option>

                    <option></option>
                  </Field>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    To station
                  </label>
                  <Field
                    as="select"
                    name="DepartmentId"
                    className={`mt-1 block w-full px-2 py-1 border
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select to Station</option>

                    <option></option>
                  </Field>
                </div>
                {/*Transaction Status */}
                <div>
                  <label className="block text-sm font-medium">
                    {" "}
                    Transaction Status
                  </label>
                  <Field
                    as="select"
                    name="IsActive"
                    className={`mt-1 block w-full px-2 py-1 border 
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Transaction Status</option>
                    <option value="0">Success</option>
                    <option value="1">Pending</option>
                    <option value="2">Failed</option>
                  </Field>
                </div>
                {/*Metro Line */}
                <div>
                  <label className="block text-sm font-medium">
                    Metro Line
                  </label>
                  <Field
                    as="select"
                    name="DepartmentId"
                    className={`mt-1 block w-full px-2 py-1 border
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Metro Line</option>
                    <option></option>
                  </Field>
                </div>
                {/* Submit Button */}
                <div className="flex items-end">
                  <div className="">
                    <button
                      type="submit"
                      className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                      // disabled={isSaveParkDetailsLoading}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </>
    );
};
export default FiltersForm;
