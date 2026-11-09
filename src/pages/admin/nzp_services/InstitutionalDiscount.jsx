import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AdminLayout from "../../../layouts/AdminLayout";
import FormWrapperCard from "../../../components/FormWrapperCard";

const STORAGE_KEY = "nzp_institutional_discount_percent";

const validationSchema = Yup.object({
  institutionalDiscountPercent: Yup.string()
    .required("Please enter discount percent")
    .test(
      "discount-percent-range",
      "Discount percent must be between 1 and 100",
      (value) => {
        const num = Number(value);
        return Number.isFinite(num) && num >= 1 && num <= 100;
      }
    ),
});

const InstitutionalDiscount = () => {
  const [isSaving, setIsSaving] = useState(false);
  const initialPercent =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY) || ""
      : "";

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSaving(true);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        String(values.institutionalDiscountPercent).trim()
      );
      toast.success("Institutional Discount saved successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-4">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Institutional Discount
            </h1>
          </div>
        </div>

        <FormWrapperCard>
          <Formik
            initialValues={{
              institutionalDiscountPercent: initialPercent,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setFieldValue, setFieldTouched, isSubmitting }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Institutional Discount Percent{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="institutionalDiscountPercent"
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter percent"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        setFieldValue("institutionalDiscountPercent", value);
                        setFieldTouched(
                          "institutionalDiscountPercent",
                          true,
                          false
                        );
                      }}
                    />
                    <ErrorMessage
                      name="institutionalDiscountPercent"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-center p-5">
                  <button
                    type="submit"
                    className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1"
                    disabled={isSaving || isSubmitting}
                  >
                    {isSaving || isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </FormWrapperCard>
      </div>
    </AdminLayout>
  );
};

export default InstitutionalDiscount;
