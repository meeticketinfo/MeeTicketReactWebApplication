import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminLayout from "../../../layouts/AdminLayout";
import FormWrapperCard from "../../../components/FormWrapperCard";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import { useParkStore } from "../../../store/masters/parksStore";
import { useModalStore } from "../../../store/modalStore";

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
  const {
    saveParkDiscount,
    fetchParkDiscount,
    parkDiscountPercent,
    isSaveParkDiscountLoading,
    isFetchParkDiscountLoading,
  } = useParkStore();
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const [initialPercent, setInitialPercent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    fetchParkDiscount()
      .then((result) => {
        if (result?.parkDiscountPercent != null) {
          setInitialPercent(String(result.parkDiscountPercent));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (parkDiscountPercent != null && parkDiscountPercent !== "") {
      setInitialPercent(String(parkDiscountPercent));
    }
  }, [parkDiscountPercent]);

  const openResultPopup = (type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setOpenModalId("park-discount-result");
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await saveParkDiscount(
        values.institutionalDiscountPercent
      );
      const apiBody = result?.data?.data ?? result?.data ?? {};
      const statusCode = apiBody?.statusCode ?? result?.data?.status;
      const message =
        apiBody?.message || "Park discount percentage saved successfully.";

      if (statusCode === 200) {
        const savedPercent = apiBody?.data?.discountPercent;
        if (savedPercent != null) {
          setInitialPercent(String(savedPercent));
        } else {
          setInitialPercent(String(values.institutionalDiscountPercent).trim());
        }
        openResultPopup("success", message);
      } else {
        openResultPopup(
          "error",
          message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      const errorBody = error?.response?.data;
      openResultPopup(
        "error",
        errorBody?.message ||
          errorBody?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
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
                      placeholder={
                        isFetchParkDiscountLoading
                          ? "Loading..."
                          : "Enter percent"
                      }
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
                    disabled={
                      isSaveParkDiscountLoading ||
                      isFetchParkDiscountLoading ||
                      isSubmitting
                    }
                  >
                    {isSaveParkDiscountLoading || isSubmitting
                      ? "Saving..."
                      : "Save"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </FormWrapperCard>

        <PopupModal
          popupModalId="park-discount-result-modal"
          isOpen={openModalId === "park-discount-result"}
          onClose={closeModal}
          size="small"
          overlayClassName="bg-gray-800 bg-opacity-60"
          contentClassName={`bg-white ${
            popupType === "error" ? "border-2 border-red-500" : ""
          }`}
          defaultBodyPadding={true}
        >
          <div className="px-8 py-10 text-center">
            <h1
              className={`font-semibold text-base ${
                popupType === "error" ? "text-red-600" : "text-blue-v1"
              }`}
            >
              {popupMessage}
            </h1>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={closeModal}
                className={`${
                  popupType === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-v1 hover:bg-blue-v2"
                } text-white px-6 py-1.5 shadow-md rounded-md`}
              >
                Okay
              </button>
            </div>
          </div>
        </PopupModal>
      </div>
    </AdminLayout>
  );
};

export default InstitutionalDiscount;
