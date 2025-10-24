import React, { useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import { getCurrentDate } from '../../../utils/TypographyHelper'
import { useWalkersPassReportStore } from './WalkersPassReportStore'
import { useServiceStore } from '../../../store/masters/servicesStore'
import useAuthStore from '../../../store/authStore'

const WalkersPassReportForm = ({ pageNumber, pageSize, SetcurrentPage }) => {
  const { fetchWalkersPassReportData } = useWalkersPassReportStore()
  
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    passTypeId: '',
    subFacilityId: '',
    locationId: '',
    pageNumber: pageNumber || 1,
    PageSize: pageSize || 10
  }

  const { allServices, fetchAllServices } = useServiceStore();
  
  const {  roleDetails } =
  useAuthStore();
const role = roleDetails?.name;
  useEffect(() => {
    fetchAllServices(role);
  }, []);
  const handleSubmit = async (values) => {
    try {
      // Save filters to localStorage
      localStorage.setItem("walkers-pass-report-filters", JSON.stringify(values))
      
      // Reset to first page when searching
      SetcurrentPage(0)
      
      // Call the API with form values
      await fetchWalkersPassReportData({
        fromDate: values.fromDate,
        toDate: values.toDate,
        passTypeId: values.passTypeId,
        subFacilityId: values.subFacilityId,
        locationId: values.locationId,
        pageNumber: 1,
        PageSize: values.PageSize
      })
    } catch (error) {
      console.error('Error fetching walkers pass report data:', error)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
     <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Booking/Purchase Date</label>
              <Field
                as="select"
                name="bookingOrPurchaseDate"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">Select Type</option>
                <option value="purchase">Purchase Date</option>
                <option value="booking">Booking Date</option>
              </Field>
            </div>
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
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
             <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Sub Facility
                  </label>
                  <Field
                    as="select"
                    name="serviceId"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
                </div>
             <div>
               <label
                 className="block text-xs font-medium text-gray-700"
               >
                 Pass Type
               </label>
                <Field
                  as="select"
                  name="passTypeId"
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                >
                  <option value="">ALL</option>
                  <option value="1">Daily Pass</option>
                  <option value="2">Weekly Pass</option>
                  <option value="3">Monthly Pass</option>
                  <option value="4">Annual Pass</option>
                </Field>
             </div>
           
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Status
              </label>
              <Field
                as="select"
                name="status"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="">ALL</option>
                <option value="1">Active</option>
                <option value="2">Inactive</option>
              </Field>
             
            </div>
            {/* submit */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default WalkersPassReportForm