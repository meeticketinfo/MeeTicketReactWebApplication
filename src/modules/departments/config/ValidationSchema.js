import * as Yup from "yup";

const ValidationSchema = Yup.object({
  departmentName: Yup.string().required("Please enter Department Name."),
  isActive: Yup.boolean(),
});

export default ValidationSchema;
