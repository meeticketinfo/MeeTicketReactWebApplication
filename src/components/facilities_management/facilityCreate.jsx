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
import { useModalStore } from "../../store/modalStore";
// Validation schema using Yup

const FacilityCreate = ({ onDataAdded }) => {
  const {
    saveFacilityDetails,
    isSaveFacilityDetailsLoading,
    facilityCreateResponse,
    FacilityDetails,
    FacilityEditDetails,
    fetchAllDropdownFacilities,
    adminFacilities,
  } = useFacilityStore();
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const { isLoading, isAuthenticated, token, error, decodedTokenData, login } =
    useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;
  //console.log(parkId,'parkid')
  useEffect(() => {
    fetchAllDropdownFacilities();
  }, []);

  const initialValues = {
    Id: FacilityEditDetails.id,
    facilityMasterId: FacilityEditDetails.facilityMasterId,
    facilitySequenceNumber:FacilityEditDetails.sequenceNumber||"",
    name: FacilityEditDetails.name,
    openTime: FacilityEditDetails.openTime || "00:00:00",
    closeTime: FacilityEditDetails.closeTime || "00:00:00",
    description: FacilityEditDetails.description || "",
    TermsConditions: FacilityEditDetails.termsConditions || "",
    isActive: FacilityEditDetails.isActive,
    parkId: FacilityEditDetails.parkId || parkId, 
  };
  console.log("FacilityEditDetails", FacilityEditDetails);
  const validationSchema = Yup.object({
    facilitySequenceNumber:Yup.string()
    .required("Please enter Sequence"),
    facilityMasterId: Yup.string()
      .required("Please enter facility name")
      .max(50, "facility name should be less than 50 characters"),

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
    console.log(formattedValues, "valuess dropdwom");
    try {
      // Call the saveFacilityDetails function
      const result = await saveFacilityDetails(formattedValues, true);
      console.log("Save result:", result); // Debugging line

      if (result && result.data && result.data.status === 200) {
        toast.success("Facility Updated successfully!");
        setTimeout(() => {
          setOpenModalId(null);
          onDataAdded();
          // setIsFacilityCreateVisible(false);
          // setIsFacilityEditVisible(false);
        }, 300);
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
  //  console.log(initialValues,"initial values")

  return (
    <div className="container mx-auto">
      {/* <h2 className="text-black text-2xl font-bold mb-6">Facilities</h2> */}

      <div className=" ">
        {/*  */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={
            (values, actions) => onSubmit(values, actions, saveFacilityDetails)
            //console.log(values, 'values')
          }
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="bg-zinc-50 grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
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
                <div className="col-span-1">
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
               {/* terms and conditions */}
               <div className="md:col-span-2">
                <label className="text-gray-700 dark:text-gray-300 text-sm">
                  Terms and Conditions
                </label>
                <Field
                  name="TermsConditions"
                  placeholder="Enter terms and conditions"
                  maxLength={255}
                  as="textarea"
                  className="mt-1 p-2 w-full rounded-lg border border-gray-300 "
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
                 {/* sequence */}
                 <div>
                  <label className="block text-sm font-medium">
                    Sequence<span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="facilitySequenceNumber"
                    type="number"
                    maxLength={50}
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Sequence"
                  />
                   <ErrorMessage
                    name="facilitySequenceNumber"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                 
                </div>
              </div>

              <div className="flex justify-center p-4">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  disabled={isSaveFacilityDetailsLoading}
                >
                  {isSaveFacilityDetailsLoading
                    ? "Saving..."
                    : "Update Facility"}
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
