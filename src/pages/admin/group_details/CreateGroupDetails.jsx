import { ErrorMessage, Field, Formik, Form, FieldArray } from 'formik'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFacilityStore } from '../../../store/masters/facilitiesStore';
import { useServiceStore } from '../../../store/masters/servicesStore';
import useAuthStore from '../../../store/authStore';
import { GroupDetailsStore } from './GroupDetailsStore';

const CreateGroupDetails = ({ setIsCreate }) => {
  const {  decodedTokenData } = useAuthStore();
  
  const parkId = decodedTokenData?.data?.ParkId;
  const { fetchAllFacilities, allFacilities } = useFacilityStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const {setGroupDetailsEditDetails,GroupDetailsEditDetails}=GroupDetailsStore();
  console.log("GroupDetailsEditDetails",GroupDetailsEditDetails)
  useEffect(() => {
    fetchAllFacilities()
    fetchAllServices()
  }, []);

  const initialValues = {
    facilityId: "",
    subFacilityId: "",
    parkId: parkId,
    groupMinRange: "",
    groupMaxRange: "",
    groupName: "", 
    isEditable:false,
  }

  const onSubmit = async (values, { resetForm }) => {
    console.log(values)
    // const AddValues = {
    //     masterFacilityId: values.facilityId,
    //     listofAvailableDays: values.dayName,
    // }
    // const EditValues = {
    //     facilityId: values.facilityId,
    //     listofAvailableDays: values.dayName,
    // }

    // const finalValues = FacilityHolidayEditDetails ? EditValues : AddValues
    // const isEdit = FacilityHolidayEditDetails ? true : false
    // try {
    //     const res = await saveFacilityHolidayDetails(finalValues, isEdit);

    //     if (res.data.status === 200) {

    //         console.log("res", res.data.status)
    //         toast.success(
    //             isEdit
    //                 ? "Holiday Updated Successfully"
    //                 : "Holiday Created Successfully"
    //         );
    //         setTimeout(() => {
    //             setIsCreate(false);
    //             setCurrentFacilityHolidayEditDetails(null);
    //             resetForm();
    //         }, 1000);
    //     } else {
    //         toast.error("something went wrong");
    //     }
    // } catch (err) {
    //     console.log("err", err);
    //     toast.error(err.response.data|| err.response.data.message || err.message);
    // }
  }
  return (
    <>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
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
                {/* subfacility */}
                <div>
                  <label className="block text-sm font-medium">
                    Sub Facility <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="subFacilityId"
                    className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select sub facility</option>
                    {allServices
                      ?.filter((service) => service.isActive)
                      ?.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                  </Field>
                  {/* <ErrorMessage
                    name="subFacilityId"
                    component="div"
                    className="text-red-500 text-xs"
                  /> */}
                </div>
                {/* Group name */}
               
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="groupName"
                    maxLength={50}
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                    placeholder="Enter Group name"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9\s'-]$/.test(e.key)) {
                        e.preventDefault(); // Prevent special characters
                      }
                    }}
                  />
                  {/* <ErrorMessage
                    name="groupName"
                    component="div"
                    className="text-red-500 text-xs"
                  /> */}
                </div>
                {/* Group Max Range */}
               
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    Maximum Range <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="groupMaxRange"
                    maxLength={50}
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                    placeholder="Enter Maximum Range"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9\s'-]$/.test(e.key)) {
                        e.preventDefault(); // Prevent special characters
                      }
                    }}
                  />
                  {/* <ErrorMessage
                    name="groupMaxRange"
                    component="div"
                    className="text-red-500 text-xs"
                  /> */}
                </div>

                {/* Group Min Range */}
              
                <div>
                  <label htmlFor="User" className="block text-xs font-medium">
                    Minimum Range <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="groupMinRange"
                    maxLength={50}
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border  rounded-md shadow-sm focus:outline-none  bg-white text-sm`}
                    placeholder="Enter Minimum Range"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9\s'-]$/.test(e.key)) {
                        e.preventDefault(); // Prevent special characters
                      }
                    }}
                  />
                  <ErrorMessage
                    name="groupMinRange"
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
                  {false ? "Loading..." : (false ? "Edit Group Details" : "Add Group Details")}
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
