import { ErrorMessage, Field, Formik, Form } from 'formik'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFacilityStore } from '../../../store/masters/facilitiesStore';
import useAuthStore from '../../../store/authStore';
import { LanguageMasterStore } from './LanguageMasterStore';
import * as Yup from "yup";

const CreateGroupDetails = ({ setIsCreate }) => {
  const { decodedTokenData } = useAuthStore();

  const parkId = decodedTokenData?.data?.ParkId;
  const { fetchAllFacilities, allFacilities } = useFacilityStore();
  const { LanguageEditDetails, isSaveLanguageLoading, saveLanguageDetails, setLanguageEditDetails } = LanguageMasterStore();
  console.log("LanguageEditDetails", LanguageEditDetails)
  useEffect(() => {
    fetchAllFacilities()
  }, []);
  const validationSchema = Yup.object({
    facilityId: Yup.string().required("Facility Id is required"),
    languageName: Yup.string().required("Language Name is required"),
  });
  const initialValues = {
    id: LanguageEditDetails ? LanguageEditDetails.id : "",
    facilityId: LanguageEditDetails ? LanguageEditDetails.facilityId : "",
    parkId: parkId,
    languageName: LanguageEditDetails ? LanguageEditDetails.languageName : "",
  }

  const onSubmit = async (values, { resetForm }) => {
    console.log(values)
    const isEdit = LanguageEditDetails ? true : false
    try {
      const res = await saveLanguageDetails(values, isEdit);
      if (res.status === 200) {
        console.log("res", res.data.status)
        toast.success(
          isEdit
            ? "Language Updated Successfully"
            : "Language Created Successfully"
        );
        setTimeout(() => {
          setIsCreate(false);
          setLanguageEditDetails(null);
          resetForm();
        }, 1000);
      } else {
        toast.error("something went wrong");
      }
    } catch (err) {
      console.log("err", err);
      const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      "Something went wrong";
      toast.error(errorMessage);
    }
  }
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, }) => (
          <Form>
            {/* Card */}
            <div className="bg-white rounded-xl shadow-md border p-5">
              {/* Form grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Facility */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Facility <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="facilityId"
                    className="w-full px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Facility</option>
                    {allFacilities
                      ?.filter((facility) => facility.isActive || facility.isCounterEnable)
                      ?.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                          {facility.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="facilityId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* language Name */}
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    language Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="languageName"
                    maxLength={50}
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                    placeholder="Enter language name"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z\s'-]$/.test(e.key)) {
                        e.preventDefault(); // Prevent special characters
                      }
                    }}
                  />
                  <ErrorMessage
                    name="languageName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>
              {/* Submit */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-v1 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition shadow"
                >
                  {isSaveLanguageLoading ? "Loading..." : (LanguageEditDetails ? "Edit Language Details" : "Add Language Details")}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default CreateGroupDetails
