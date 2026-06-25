import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field } from 'formik'
import { getCurrentDate } from '../../../utils/TypographyHelper'
import { useWalkersPassReportStore } from './WalkersPassReportStore'
import { useServiceStore } from '../../../store/masters/servicesStore'
import useAuthStore from '../../../store/authStore'

const WalkersPassReportForm = ({
  SetcurrentPage,
}) => {
  const { fetchWalkersPassReportData } = useWalkersPassReportStore()






  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    passTypeId: '',
    subFacilityId: '',
    locationId: '',
    status: 'CONFIRMED',
    purchaseOrBooking: 'Purchase',
    pageNumber: 1,
    PageSize: 10
  };

  const { fetchAllServices, allPassTypes, fetchAllPassTypes } = useServiceStore();

  const { roleDetails } =
    useAuthStore();
  const role = roleDetails?.name;
  useEffect(() => {
    fetchAllServices(role);
    fetchAllPassTypes();
  }, []);



  // Trigger initial API call with current form values
  useEffect(() => {
    const timer = setTimeout(() => {
      const formattedValues = {
        fromDate: getCurrentDate(),
        toDate: getCurrentDate(),
        passTypeId: "",
        subFacilityId: "",
        locationId: "",
        status: "CONFIRMED",
        pageNumber: 1,
        PageSize: 10,
      };

      console.log("Initial API call with values:", formattedValues);

      fetchWalkersPassReportData(formattedValues);
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchWalkersPassReportData]);
  const onSubmit = async (values, { setSubmitting }) => {
    console.log("SEARCH CLICKED");
    console.log("Values:", values);
    try {
     

      // Reset to first page when searching
      SetcurrentPage(0)

      // Format values based on booking date selection
      const formattedValues = {
        ...values,
        fromDate: values.fromDate ? `${values.fromDate}` : "",
        toDate: values.toDate ? `${values.toDate}` : "",
        passTypeId: values.passTypeId,
        subFacilityId: values.subFacilityId,
        locationId: values.locationId,
        status: values.status,
        purchaseOrBooking: values.purchaseOrBooking,
        pageNumber: 1,
        PageSize: values.PageSize
      };

      setSubmitting(true);
      const filters = formattedValues;
      const result = await fetchWalkersPassReportData(filters);

      if (result?.data?.status === 200) {
        // Success - data loaded
      } else {
        // Handling a response with an unexpected status code
        console.error(result?.data?.message);
      }
    } catch (error) {
      // Catching and handling any errors during the API call
      const errorMessage =
        error?.response?.data?.message ||
        "Error fetching walkers pass report data. Please try again.";
      console.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (resetForm) => {
    try {

      // Reset form to initial values
      const defaultValues = {
        fromDate: getCurrentDate(),
        toDate: getCurrentDate(),
        passTypeId: '',
        subFacilityId: '',
        locationId: '',
        status: 'CONFIRMED',
        purchaseOrBooking: 'Purchase',
        pageNumber: 1,
        PageSize: 10
      };

      resetForm({ values: defaultValues });


      // Reset to first page
      SetcurrentPage(0);

      // Call API with default values
      const formattedValues = {
        fromDate: getCurrentDate(),
        toDate: getCurrentDate(),
        passTypeId: "",
        subFacilityId: "",
        locationId: "",
        status: "CONFIRMED",
        pageNumber: 1,
        PageSize: 10
      };

      console.log("Formatted Values:", formattedValues);
      await fetchWalkersPassReportData(formattedValues);
    } catch (error) {
      console.error('Error resetting form:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">

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
                <option value="">Annual Walker&apos;s Pass</option>
                <option value="">Monthly Walker&apos;s Pass</option>
                <option value="">Annual Senior Citizen</option>
                <option value="">Monthly Senior Citizen</option>
                {allPassTypes
                  ?.map((passType) => (
                    <option key={passType.passLocationMasterId} value={passType.passLocationMasterId}>
                      {passType.passName}
                    </option>
                  ))}
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
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="HOLD">HOLD</option>
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
              <button
                type="button"
                onClick={() => handleReset(resetForm)}
                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-600 border border-gray-500 hover:border-gray-600"
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

WalkersPassReportForm.propTypes = {
  SetcurrentPage: PropTypes.func.isRequired,
};

export default WalkersPassReportForm