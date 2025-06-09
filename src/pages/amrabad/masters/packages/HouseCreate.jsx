import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
const HouseCreate = () => {
  const initialValues = {
    packages: "",
    houseName: "",
    tarrifPerDay: "",
    discounts: "",
    discountType: "",
    discountValue: "",
    amountAfterDiscount: "",
    discountApplicable: "",
    noOfHouseApplicable: "",
    roomLimit: "",
    blockOut: "",
    remarks: "",
    sequence: "",
    images: [],
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
  const validationSchema = Yup.object().shape({
    packages: Yup.string().required("Package selection is required."),
    houseName: Yup.string()
      .required("House name is required.")
      .min(3, "House name must be at least 3 characters."),
    tarrifPerDay: Yup.number()
      .typeError("Tariff must be a number.")
      .required("Tariff per day is required.")
      .positive("Tariff must be a positive number."),
    discounts: Yup.string().required(
      "Please select if discounts are available."
    ),

    discountValue: Yup.string().when("discounts", {
      is: "yes",
      then: Yup.string().required("Discount Value is required."),
      otherwise: Yup.string().nullable(),
    }),

    discountApplicable: Yup.string().when("discounts", {
      is: "yes",
      then: Yup.string().required("Discount Applicable is required."),
      otherwise: Yup.string().nullable(),
    }),

    noOfHouseApplicable: Yup.number().when("discounts", {
      is: "yes",
      then: Yup.number()
        .typeError("Number of houses must be a number.")
        .required("Number of houses is required.")
        .min(1, "At least one house must be applicable."),
      otherwise: Yup.number().nullable(),
    }),
    roomLimit: Yup.string().required("Room Limit is required."),
    blockOut: Yup.string().required("Block Out is required."),
    sequence: Yup.string().required("Sequence is required."),
    images: Yup.array()
      .of(
        Yup.string().test("is-valid-image", "Invalid image type", (value) => {
          // Regular expression for checking valid image data URI format
          return /^data:image\/(jpeg|png|gif);base64,/.test(value);
        })
      )
      .min(1, "You must upload at least one image")
      .max(5, "You can upload up to 5 images only"),
  });

  const handleSubmit = (values, actions) => {
    console.log("Form Submitted:", values);
    actions.setSubmitting(false);
  };
  return (
    <>
      <div className="bg-zinc-50 p-2 shadow-lg rounded-lg">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-3">
                {/* User Select */}
                <div>
                  <label
                    htmlFor="packages"
                    className="block text-xs font-medium"
                  >
                    Packages <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="packages"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="" disabled>
                      Select a package
                    </option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </Field>
                  <ErrorMessage
                    name="packages"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="houseName"
                    className="block text-xs font-medium"
                  >
                    Name of the House <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="houseName"
                    type="text"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Name of the House"
                  />
                  <ErrorMessage
                    name="houseName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Email Id */}
                <div>
                  <label
                    htmlFor="tarrifPerDay"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Tariff per day <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="tarrifPerDay"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter Tariff per day"
                  />
                  <ErrorMessage
                    name="tarrifPerDay"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="discounts"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Discounts <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="discounts"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="" label="Select option" />
                    <option value="Yes" label="Yes" />
                    <option value="No" label="No" />
                  </Field>
                  <ErrorMessage
                    name="discounts"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {values.discounts === "Yes" && (
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

                    {/* Discount Value */}
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
                        <option value="Weekdays">Weekdays</option>
                        <option value="Weekends">Weekends</option>
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
                    htmlFor="noOfHouseApplicable"
                    className="block text-xs font-medium text-gray-700"
                  >
                    No of Houses Available{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="noOfHouseApplicable"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    placeholder="Enter No of Houses Available"
                  />
                  <ErrorMessage
                    name="noOfHouseApplicable"
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
                    htmlFor="blockOut"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Block out <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="blockOut"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Field>
                  <ErrorMessage
                    name="blockOut"
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
                    placeholder="Enter Sequence"
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
                    htmlFor="images"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Upload Images
                  </label>
                  <input
                    id="images"
                    name="images"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    type="file"
                    // accept="image/*"
                    multiple
                    onChange={async (event) => {
                      const files = event.currentTarget.files;
                      if (files) {
                        const base64Images = [];
                        for (let i = 0; i < files.length; i++) {
                          const base64 = await convertToBase64(files[i]);
                          base64Images.push(base64);
                        }
                        setFieldValue("images", base64Images); // Store base64 images in Formik state
                      }
                    }}
                  />
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="col-md-10">
                  <h4 className="block text-xs font-medium text-gray-700">
                    Selected Image Previews:
                  </h4>
                  <div className="flex gap-4 mt-2">
                    {values.images.map((base64Image, index) => (
                      <div key={index} className="relative w-[100px] h-[100px]">
                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedImages = values.images.filter(
                              (_, i) => i !== index
                            );
                            setFieldValue("images", updatedImages);
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
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4 mb-4">
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                  >
                    Create House
                  </button>
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
