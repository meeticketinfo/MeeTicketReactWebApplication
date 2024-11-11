import { toast } from "react-toastify";

export const handleApiError = (xhr) => {
  if (xhr && xhr.response && xhr.response.data && xhr.response.data.errors) {
    const formErrors = {};
    Object.keys(xhr.response.data.errors).forEach((key) => {
      if (
        Array.isArray(xhr.response.data.errors[key]) &&
        xhr.response.data.errors[key].length > 0
      ) {
        formErrors[key] = xhr.response.data.errors[key][0];
        toast.error(`${key}: ${xhr.response.data.errors[key][0]}`);
      }
    });
  } else {
    toast.error(xhr.response?.data || "An unknown error occurred.");
  }
};
