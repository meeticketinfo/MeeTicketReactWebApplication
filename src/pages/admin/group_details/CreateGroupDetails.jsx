import { ErrorMessage, Field, Formik, Form } from 'formik'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFacilityStore } from '../../../store/masters/facilitiesStore';
import { useServiceStore } from '../../../store/masters/servicesStore';
import useAuthStore from '../../../store/authStore';
import { GroupDetailsStore } from './GroupDetailsStore';
import * as Yup from "yup";
const CreateGroupDetails = ({ setIsCreate }) => {
  const { decodedTokenData } = useAuthStore();

  const parkId = decodedTokenData?.data?.ParkId;
  const { fetchAllFacilities, allFacilities } = useFacilityStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const { setGroupDetailsEditDetails, GroupDetailsEditDetails, saveGroupDetails, isSaveGroupDetailsLoading } = GroupDetailsStore();
  console.log("GroupDetailsEditDetails", GroupDetailsEditDetails)
  useEffect(() => {
    fetchAllFacilities()
    fetchAllServices()
  }, []);

  const initialValues = {
    id: GroupDetailsEditDetails ? GroupDetailsEditDetails.id : "",
    facilityId: GroupDetailsEditDetails ? GroupDetailsEditDetails.facilityId : "",
    subFacilityId: GroupDetailsEditDetails ? GroupDetailsEditDetails.subFacilityId : "",
    parkId: parkId,
    groupMinRange: GroupDetailsEditDetails ? GroupDetailsEditDetails.groupMinRange : "",
    groupMaxRange: GroupDetailsEditDetails ? GroupDetailsEditDetails.groupMaxRange : "",
    groupName: GroupDetailsEditDetails ? GroupDetailsEditDetails.groupName : "",
    isEditable: false,
  }
  const validationSchema = Yup.object({
    facilityId: Yup.string().required("Facility Id is required"),
    subFacilityId: Yup.string().required("Facility Id is required"),
    groupName: Yup.string().required("Group Name is required"),
    groupMaxRange: Yup.number()
      .min(0, "Maximum Range cannot be negative")
      .required("Maximum Range is required"),

    groupMinRange: Yup.number()
      .min(0, "Minimum Range cannot be negative")
      .required("Minimum Range is required")
      .test(
        "min-less-than-max",
        "Minimum Range cannot be greater than Maximum Range",
        function (value) {
          return value <= this.parent.groupMaxRange;
        }
      ),
  });

  const onSubmit = async (values, { resetForm }) => {

    const isEdit = GroupDetailsEditDetails ? true : false
    try {
      const res = await saveGroupDetails(values, isEdit);
      console.log("res", res)
      if (res.status === 200) {

        console.log("res", res.status)

        toast.success(
          GroupDetailsEditDetails
            ? "Group Details Updated Successfully"
            : "Group Details Created Successfully"
        );
        setTimeout(() => {
          setIsCreate(false);
          setGroupDetailsEditDetails(null);
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
                  <ErrorMessage
                    name="subFacilityId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
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
                      if (!/^[a-zA-Z\s'-]$/.test(e.key)) {
                        e.preventDefault(); 
                      }
                    }}
                  />
                  <ErrorMessage
                    name="groupName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                {/* Group Max Range */}

                <div>
                  <label className="block text-xs font-medium">
                    Maximum Range <span className="text-red-500">*</span>
                  </label>

                  <Field
                    name="groupMaxRange"
                    type="number"
                    min={0}
                    className="mt-1 block w-full px-2 py-1 border rounded-md shadow-sm bg-white text-sm"
                    placeholder="Enter Maximum Range"
                  />

                  <ErrorMessage
                    name="groupMaxRange"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Minimum Range */}
                <div>
                  <label className="block text-xs font-medium">
                    Minimum Range <span className="text-red-500">*</span>
                  </label>

                  <Field
                    name="groupMinRange"
                    type="number"
                    min={0}
                    className="mt-1 block w-full px-2 py-1 border rounded-md shadow-sm bg-white text-sm"
                    placeholder="Enter Minimum Range"
                  />

                  <ErrorMessage
                    name="groupMinRange"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

              </div>



              {/* Submit */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-v1 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition shadow"
                >
                  {isSaveGroupDetailsLoading ? "Loading..." : (GroupDetailsEditDetails ? "Edit Group Details" : "Add Group Details")}
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
