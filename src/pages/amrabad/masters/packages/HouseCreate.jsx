import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";

const HouseCreate = () => {
  //   const initialValues = {
  //     id:"",
  //     firstName:"",
  //     middleName:"",
  //     parkId: "",
  //     lastName:"",
  //     dateOfBirth: "",
  //     emailId:"",
  //     phoneNumber:"",
  //     password:"",
  //     roleId:"",
  //   };
  return (
    <>
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
        <Formik
        //   initialValues={initialValues}
        //   validationSchema={validationSchema}
        //   onSubmit={(values, actions) =>
        //     onSubmit(values, actions, saveGateKeeperDetails)
        //   }
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* User Select */}
                <div>
                  <label
                    htmlFor="packages"
                    className="block text-xs font-medium"
                  >
                    Packages <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="packages"
                    className="mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="" disabled>
                      Select a package
                    </option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </Field>
                  <ErrorMessage
                    name="packages"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="houseName"
                    className="block text-xs font-medium"
                  >
                    Name of the House <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="houseName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Name of the House"
                  />
                  <ErrorMessage
                    name="houseName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Email Id */}
                <div>
                  <label
                    htmlFor="tarrifPerDay"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Tariff per day <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="tarrifPerDay"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter email Id"
                  />
                  <ErrorMessage
                    name="tarrifPerDay"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="discounts"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Discounts <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="discounts"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter Discounts"
                  />
                  <ErrorMessage
                    name="discounts"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="noOfHouseApplicable"
                    className="block text-xs font-medium text-gray-700"
                  >
                    No of Houses Available{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="noOfHouseApplicable"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter No of Houses Available"
                  />
                  <ErrorMessage
                    name="noOfHouseApplicable"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="roomLimit"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Room Limit <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="roomLimit"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter Room Limit"
                  />
                  <ErrorMessage
                    name="roomLimit"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="blockOut"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Block out <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="blockOut"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter Room Limit"
                  />
                  <ErrorMessage
                    name="blockOut"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sequence"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Sequence <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="sequence"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter Room Limit"
                  />
                  <ErrorMessage
                    name="sequence"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="remarks"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Remarks <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="remarks"
                    className={`mt-1 block w-full px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter Room Limit"
                  />
                  <ErrorMessage
                    name="remarks"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              {/* <div className="flex justify-center p-2">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveGateKeeperDetailsLoading}
                >
                  {isSaveGateKeeperDetailsLoading
                    ? "Saving..."
                    : IsEditGateKeeper
                    ? "Edit Gate Keeper"
                    : "Create Gate Keeper"}
                </button>
              </div> */}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default HouseCreate;
