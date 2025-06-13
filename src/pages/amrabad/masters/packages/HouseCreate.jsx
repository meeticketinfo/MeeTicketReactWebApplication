import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { useEffect, useState } from "react";
const HouseCreate = ({ isHouseEditVisible, setIsHouseEditVisible }) => {
  const {
    fetchPackagesWithRooms,
    fetchGetAllPackages,
    GetAllPackages,
    saveHouseDetails,
    isSaveHouseDetailsLoading,
    houseEditDetails,
  } = usePackagesStore();
  const [isValidation, setIsValidation] = useState("");
const initialValues = {
    packageId: isHouseEditVisible ? houseEditDetails?.packageId || "" : "",
    roomName: isHouseEditVisible ? houseEditDetails?.roomName || "" : "",
    tariffPerDay: isHouseEditVisible ? houseEditDetails?.tariffPerDay || "" : "",
    hasDiscount: isHouseEditVisible ? (houseEditDetails?.hasDiscount ? "Yes" : "No") : "",
    discountType: isHouseEditVisible ? houseEditDetails?.discountType || "" : "",
    discountValue: isHouseEditVisible ? houseEditDetails?.discountValue || "" : "",
    amountAfterDiscount: isHouseEditVisible ? houseEditDetails?.amountAfterDiscount || "" : "",
    discountApplicable: isHouseEditVisible ? (houseEditDetails?.discountApplicable ? "true" : "false") : "",
    noOfHousesAvailable: isHouseEditVisible ? houseEditDetails?.noOfHousesAvailable || "" : "",
    roomLimit: isHouseEditVisible ? houseEditDetails?.roomLimit || "" : "",
    isBlockout: isHouseEditVisible ? (houseEditDetails?.isBlockout ? "Yes" : "No") : "",
    remarks: isHouseEditVisible ? houseEditDetails?.remarks || "" : "",
    sequence: isHouseEditVisible ? houseEditDetails?.sequence || 0 : 0,
    roomImagesBase64Strings: isHouseEditVisible ? houseEditDetails?.roomImagesBase64Strings || [] : [],
  };
  // Function to convert files to base64 strings
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert to base64
    });
  };
  useEffect(() => {
    fetchGetAllPackages();
  }, []);
  const validationSchema = Yup.object().shape({
    packageId: Yup.string().required("Package selection is required."),
    roomName: Yup.string()
      .required("House name is required.")
      .min(3, "House name must be at least 3 characters."),
    tariffPerDay: Yup.number()
      .typeError("Tariff must be a number.")
      .required("Tariff per day is required.")
      .positive("Tariff must be a positive number."),
    hasDiscount: Yup.string().required(
      "Please select if discounts are available."
    ),
    discountType:
      isValidation === "Yes" &&
      Yup.string().required("Discount Type is required"),
    discountValue:
      isValidation === "Yes" &&
      Yup.string().required("Discount Value is required"),
    discountApplicable:
      isValidation === "Yes" &&
      Yup.string().required("discounts Applicable is required"),
    noOfHousesAvailable: Yup.number().required(
      "No Of House Applicable is required"
    ),
    roomLimit: Yup.string().required("Room Limit is required."),
    isBlockout: Yup.string().required("Block Out is required."),
    sequence: Yup.string().required("Sequence is required."),
    roomImagesBase64Strings: Yup.array()
      .of(
        Yup.string().test("is-valid-image", "Invalid image type", (value) => {
          // Regular expression for checking valid image data URI format
          return /^data:image\/(jpeg|png|gif|svg);base64,/.test(value);
        })
      )
      .min(1, "You must upload at least one image")
      .max(5, "You can upload up to 5 images only"),
  });

   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        ...values,
        packageId: values.packageId,
        hasDiscount: values.hasDiscount === "Yes",
        isBlockout: values.isBlockout === "Yes",
        discountApplicable: values.discountApplicable === "true",
      };

      const result = await saveHouseDetails(payload, isHouseEditVisible);
      if (result?.data?.status === 200) {
        fetchPackagesWithRooms();
        toast.success(isHouseEditVisible ? "House updated successfully" : "House created successfully");
        setIsHouseEditVisible(false);
        resetForm();
      }
    } catch (xhr) {
      if (xhr && xhr.response && typeof xhr.response.data.errors === "object") {
        Object.keys(xhr.response.data.errors).forEach((key) => {
          if (Array.isArray(xhr.response.data.errors[key]) && xhr.response.data.errors[key].length > 0) {
            toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
          }
        });
      } else {
        toast.error(xhr.response?.data || "An error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
         <Formik
        initialValues={initialValues}
        enableReinitialize={true} 
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-3">
                {/* User Select */}
                <div>
                  <label
                    htmlFor="packageId"
                    className="block text-xs font-medium"
                  >
                    Packages <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="packageId"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select Packages</option>
                    {GetAllPackages.map((pkg) => (
                      <option key={pkg.packageId} value={pkg.packageId}>
                        {pkg.roomName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="packageId"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roomName"
                    className="block text-xs font-medium"
                  >
                    Name of the House <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="roomName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Name of the House"
                  />
                  <ErrorMessage
                    name="roomName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Email Id */}
                <div>
                  <label
                    htmlFor="tariffPerDay"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Tariff per day <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="tariffPerDay"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Tariff per day"
                  />
                  <ErrorMessage
                    name="tariffPerDay"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="hasDiscount"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Discounts <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="hasDiscount"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    onChange={(e) => {
                      setIsValidation(e.target.value);
                      setFieldValue("hasDiscount", e.target.value);
                    }}
                  >
                    <option value="" label="Select option" />
                    <option value="Yes" label="Yes" />
                    <option value="No" label="No" />
                  </Field>
                  <ErrorMessage
                    name="hasDiscount"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {values.hasDiscount === "Yes" && (
                  <>
                    {/* Discount Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Discount Type <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="discountType"
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                        <option value="">Select type</option>
                        <option value="Amount">Amount</option>
                        <option value="Percentage">Percentage</option>
                      </Field>
                      <ErrorMessage
                        name="discountType"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Discount Value <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        name="discountValue"
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <ErrorMessage
                        name="discountValue"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    {/* Amount after Discount */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Amount after Discount
                      </label>
                      <Field
                        name="amountAfterDiscount"
                        className="mt-1 block w-full px-2 py-1  border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Discount Applicable */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Discount Applicable{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="discountApplicable"
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                        <option value="">Select option</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Field>
                      <ErrorMessage
                        name="discountApplicable"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label
                    htmlFor="noOfHousesAvailable"
                    className="block text-xs font-medium text-gray-700"
                  >
                    No of Houses Available{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="noOfHousesAvailable"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter No of Houses Available"
                  />
                  <ErrorMessage
                    name="noOfHousesAvailable"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="roomLimit"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Room Limit <span className="text-red-500 text-xs">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="roomLimit"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
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
                    htmlFor="isBlockout"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Block out <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="isBlockout"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Field>
                  <ErrorMessage
                    name="isBlockout"
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
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Sequence Number"
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
                    Remarks
                  </label>
                  <Field
                    as="textarea"
                    name="remarks"
                    rows="4"
                    maxLength="250"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    placeholder="Enter your remarks"
                  />
                </div>

                <div className="col-md-2">
                  <label
                    htmlFor="roomImagesBase64Strings"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Upload Images<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="roomImagesBase64Strings"
                    name="roomImagesBase64Strings"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (event) => {
                      const files = event.currentTarget.files;
                      if (files) {
                        const base64Images = [];
                        for (let i = 0; i < files.length; i++) {
                          const base64 = await convertToBase64(files[i]);
                          base64Images.push(base64);
                        }
                        setFieldValue("roomImagesBase64Strings", base64Images); // Store base64 images in Formik state
                      }
                    }}
                  />
                  <ErrorMessage
                    name="roomImagesBase64Strings"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="col-md-10">
                  <h4 className="block text-xs font-medium text-gray-700">
                    Selected Image Previews:
                  </h4>
                  <div className="flex gap-4 mt-2">
                    {values.roomImagesBase64Strings.map(
                      (base64Image, index) => (
                        <div
                          key={index}
                          className="relative w-[100px] h-[100px]"
                        >
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages =
                                values.roomImagesBase64Strings.filter(
                                  (_, i) => i !== index
                                );
                              setFieldValue(
                                "roomImagesBase64Strings",
                                updatedImages
                              );
                            }}
                            className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>

                          {/* Image preview */}
                          <img
                            src={base64Image}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover rounded shadow-md"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4 mb-4">
                <div>
                  <button
                    type="submit"
                    // disabled={isSubmitting}
                    className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 hover:cursor-pointer "
                  >
                  </button>
                   {isSaveHouseDetailsLoading
                    ? "Saving..."
                    : isHouseEditVisible
                    ? "Update House"
                    : "Create House"}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default HouseCreate;
