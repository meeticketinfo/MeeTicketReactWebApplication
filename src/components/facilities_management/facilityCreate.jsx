import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported
import { useNavigate } from "react-router-dom";
import { useFacilityStore } from "../../store/masters/facilitiesStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../../store/authStore";
import { formatToStandardDate } from "../../utils/TypographyHelper";
import { useEffect } from "react";
// Validation schema using Yup

const FacilityCreate = ({
  setIsFacilityCreateVisible,
  isFacilityEditVisible,
  setIsFacilityEditVisible,
}) => {

  const {
    saveFacilityDetails,
    isSaveFacilityDetailsLoading,
    facilityCreateResponse,
    FacilityDetails,
    FacilityEditDetails,
    fetchAllDropdownFacilities,
    adminFacilities
  } = useFacilityStore();
  const { isLoading, isAuthenticated, token, error, decodedTokenData, login } =
    useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;
  //console.log(parkId,'parkid')
  useEffect(() => {
    fetchAllDropdownFacilities();
  }, []);

  const initialValues = {
      Id: isFacilityEditVisible ? FacilityEditDetails.id : "",
    facilityMasterId: isFacilityEditVisible ? FacilityEditDetails.facilityMasterId : "",
    name: isFacilityEditVisible ? FacilityEditDetails.name : "",
    openTime:
      (isFacilityEditVisible && FacilityEditDetails.openTime) || "00:00:00",
    closeTime:
      (isFacilityEditVisible && FacilityEditDetails.closeTime) || "00:00:00",
    description:
      (isFacilityEditVisible && FacilityEditDetails.description) || "",
    isActive: isFacilityEditVisible ? FacilityEditDetails.isActive : true,
    parkId: (isFacilityEditVisible && FacilityEditDetails.parkId) || parkId,
    serviceVarientReqDTOs: [
      { name: "", amount: "", isPriceFixed: false , isActive: true }, // Initial single field
    ],
  };
  console.log("FacilityEditDetails", FacilityEditDetails)
  const validationSchema = Yup.object({
    facilityMasterId: Yup.string()
      .required("Please enter facility name")
      .max(50, "facility name should be less than 50 characters"),
    serviceVarientReqDTOs: !isFacilityEditVisible&&Yup.array().of(
      Yup.object({
        name: Yup.string()
          .required("Please enter Ticket Type.")
          .max(50, "Ticket Type should be less than 50 characters"),
        amount: Yup.number()
          .required("Please Enter Price")
          .positive("Price must be a positive number")
          .typeError("Price must be a number"),
        isPriceFixed: Yup.boolean().required("Please Select Price"),
      })
    ),
    // openTime: Yup.string().required("Please select open time."),
    // closeTime: Yup.string().required("Please select close time."),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {

    const formattedValues = {
      ...values,
      isActive: values.isActive === "true" || values.isActive === true,
      name: values.name,
      facilityMasterId: values.facilityMasterId,
      openTime:
        values.openTime.length === 5
          ? `${values.openTime}:00`
          : values.openTime,
      closeTime:
        values.closeTime.length === 5
          ? `${values.closeTime}:00`
          : values.closeTime,

    };
    console.log(formattedValues, 'valuess dropdwom')
    try {
      // Call the saveFacilityDetails function
      const result = await saveFacilityDetails(
        formattedValues,
        isFacilityEditVisible ? true : false
      );
      console.log("Save result:", result); // Debugging line

      if (result && result.data && result.data.status === 200) {
        toast.success(
          isFacilityEditVisible
            ? "Facility Updated successfully!"
            : "Facility created successfully!"
        );
        setTimeout(() => {
          setIsFacilityCreateVisible(false);
          setIsFacilityEditVisible(false);
        }, 3000);
        resetForm();
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      if (
        xhr &&
        xhr.response &&
        xhr.response.data &&
        xhr.response.data.errors
      ) {
        const formErrors = {};
        Object.keys(xhr.response.data.errors).forEach((key) => {
          if (
            Array.isArray(xhr.response.data.errors[key]) &&
            xhr.response.data.errors[key].length > 0
          ) {
            formErrors[key] = xhr.response.data.errors[key][0];
            toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
          }
        });
      } else {
        toast.error(xhr.response?.data || "An unknown error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  console.log("isFacilityEditVisible", isFacilityEditVisible);
  //  console.log(initialValues,"initial values")

  const handleFacilityChange = (e) => {
    const selectedFacilityId = e.target.value;
    const selectedFacility = adminFacilities.find(
      (facility) => facility.facilityMasterId === selectedFacilityId
    );

    // Update both facilityMasterId and facilityName in Formik values
    setFieldValue("facilityMasterId", selectedFacilityId);
    setFieldValue("facilityName", selectedFacility?.facilityName || "");
  };

  return (
    <div className="container mx-auto mt-10">
      {/* <h2 className="text-black text-2xl font-bold mb-6">Facilities</h2> */}

      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg border border-gray-200">
        <ToastContainer position="top-right" autoClose={3000} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={
            (values, actions) => onSubmit(values, actions, saveFacilityDetails)
            //console.log(values, 'values')
          }
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                {/* Facility Name */}
                <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Select Facility <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="facilityMasterId"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                    onChange={(e) => {
                      const id = e.target.value;

                      setFieldValue("facilityMasterId", id);

                      const Selectedfacility = adminFacilities.find(
                        (facility) => facility.facilityMasterId === Number(id)
                      );

                      setFieldValue("name", Selectedfacility.facilityName);
                    }}
                  >
                    <option value="">Select Facility</option>
                    {adminFacilities?.map((facility) => (
                      <option
                        key={facility.facilityMasterId}
                        value={facility.facilityMasterId}
                      >
                        {facility.facilityName}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="facilityMasterId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Open Time */}
                <div className="">
                  <label
                    htmlFor="openTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Open Time
                  </label>
                  <Field
                    type="time"
                    name="openTime"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.openTime && touched.openTime
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none placeholder:transition-all text-gray-700 placeholder:duration-500 placeholder:ease-in-out focus:placeholder:translate-x-2 bg-white text-sm`}
                    placeholder="Enter Open Time"
                  />
                  <ErrorMessage
                    name="openTime"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Close Time */}
                <div className="">
                  <label
                    htmlFor="closeTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Close Time
                  </label>
                  <Field
                    type="time"
                    name="closeTime"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.closeTime && touched.closeTime
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Close Time"
                  />
                  <ErrorMessage
                    name="closeTime"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none placeholder:transition-all text-gray-700 placeholder:duration-500 placeholder:ease-in-out focus:placeholder:translate-x-2 bg-white text-sm`}
                    placeholder="Enter description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium">Status</label>
                  <Field
                    as="select"
                    name="isActive"
                    onChange={(e) => {
                      const { value } = e.target;
                      setFieldValue("isActive", value === "true");
                    }}
                    className={`mt-1 block w-full px-2 py-1 border ${
                      errors.isActive && touched.isActive
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="isActive"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {!isFacilityEditVisible && (
                  <div className="col-span-3">
                    <h3 className="text-lg font-semibold mb-4">
                      Type of Ticket{" "}
                    </h3>
                    <FieldArray
                      name="serviceVarientReqDTOs"
                      render={(arrayHelpers) => (
                        <>
                          <div className="flex gap-4">
                            <div>
                              {values.serviceVarientReqDTOs.map(
                                (ticket, index) => (
                                  <div
                                    key={index}
                                    // className="grid grid-cols-3 gap-2 border-b pb-2 mb-2"
                                    className="flex gap-2"
                                  >
                                    <div className="flex">
                                      {/* Name */}
                                      <div className="grid grid-cols-3 gap-2">
                                        <div className="mb-4">
                                          <label
                                            htmlFor={`serviceVarientReqDTOs.${index}.name`}
                                            className="block text-sm font-semibold text-gray-700"
                                          >
                                            Type of Ticket Name{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <Field
                                            type="text"
                                            name={`serviceVarientReqDTOs.${index}.name`}
                                            className={`mt-1 block w-full px-2 py-1 border ${
                                              errors.serviceVarientReqDTOs &&
                                              errors.serviceVarientReqDTOs[
                                                index
                                              ] &&
                                              errors.serviceVarientReqDTOs[
                                                index
                                              ].name &&
                                              touched.serviceVarientReqDTOs &&
                                              touched.serviceVarientReqDTOs[
                                                index
                                              ]?.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                                            placeholder="Enter Name"
                                          />
                                          <ErrorMessage
                                            name={`serviceVarientReqDTOs.${index}.name`}
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                          />
                                        </div>
                                        {/* Price */}
                                        <div className="mb-4">
                                          <label
                                            htmlFor={`serviceVarientReqDTOs.${index}.amount`}
                                            className="block text-sm font-semibold text-gray-700"
                                          >
                                            Price{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <Field
                                            type="number"
                                            name={`serviceVarientReqDTOs.${index}.amount`}
                                            className={`mt-1 block w-full px-2 py-1 border ${
                                              errors.serviceVarientReqDTOs &&
                                              errors.serviceVarientReqDTOs[
                                                index
                                              ] &&
                                              errors.serviceVarientReqDTOs[
                                                index
                                              ].amount &&
                                              touched.serviceVarientReqDTOs &&
                                              touched.serviceVarientReqDTOs[
                                                index
                                              ]?.amount
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                                            placeholder="Enter Price"
                                          />
                                          <ErrorMessage
                                            name={`serviceVarientReqDTOs.${index}.amount`}
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                          />
                                        </div>

                                        {/* Price Fixed */}
                                        <div className="flex items-end mb-4">
                                          <label className="text-sm flex space-x-2">
                                            <Field
                                              type="checkbox"
                                              name={`serviceVarientReqDTOs.${index}.isPriceFixed`}
                                              className="sr-only peer"
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                                            <span className="ms-3 text-md font-semibold text-gray-900 whitespace-nowrap">
                                              Price Fixed{" "}
                                              <span className="text-red-500">
                                                *
                                              </span>
                                            </span>
                                            <ErrorMessage
                                              name={`serviceVarientReqDTOs.${index}.isPriceFixed`}
                                              component="span"
                                              className="text-red-500 text-xs mt-1"
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Remove Button */}
                                    <div className="flex items-end mb-4 ">
                                      <button
                                        type="button"
                                        className="bg-red-700 text-base text-white rounded-lg  px-3 py-1"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            {/* Add Button */}
                            <div className="flex items-end mb-4 justify-end">
                              <button
                                type="button"
                                className="whitespace-nowrap bg-blue-v1 text-base text-white rounded-lg  px-3 py-1"
                                onClick={() =>
                                  arrayHelpers.push({
                                    name: "",
                                    amount: "",
                                    isPriceFixed: false,
                                    isActive: true,
                                  })
                                }
                              >
                                Add Ticket
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center p-5">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveFacilityDetailsLoading}
                >
                  {isSaveFacilityDetailsLoading
                    ? "Saving..."
                    : isFacilityEditVisible
                    ? "Update Facility"
                    : "Create Facility"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default FacilityCreate;
