import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import headerLogo from "../../images/Telangana-logo.png";
import cmImg from "../../images/chief_minister.png";
import ITMinisterImg from "../../images/it_minister.png";
import meetickesTelanganaImg from "../../images/meetickets-telangana.png";
import Loader from "../../web_app_loaders/Loader";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, token, error, decodedTokenData, login } =
    useAuthStore();

  // Formik initial values
  const initialValues = {
    EmailId: "Testing1@gmail.com",
    password: "Test@123",
  };

  // Validation schema
  const validationSchema = Yup.object({
    EmailId: Yup.string().required("EmailId is required"),
    password: Yup.string().required("Password is required"),
  });

  // Formik submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    const success = await login(values);
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    // if (success) navigate("/dashboard"); // Navigate to dashboard on successful login
    setSubmitting(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="main-container h-screen bg-blue-v2 p-4">
          {/* Header Section */}
          <div className="container-fluid p-3 text-white bg-blue-v1 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="align-middle hidden lg:inline-flex 2xl:hidden justify-end">
                <div className="flex justify-center items-center">
                  <img
                    alt="site-logo"
                    src={headerLogo}
                    width={40}
                    height={40}
                  />
                </div>
                <div className="pl-2 flex flex-col">
                  <p className="text-lg">Government of Telangana</p>
                  <small className="text-[10px] pl-1">ITE&C Department</small>
                </div>
              </div>

              {/* Second Column */}
              <div className="flex justify-end items-center pr-20">
                <div className="flex items-center mr-4">
                  <div className="mr-2 text-right">
                    <p className="text-sm font-semibold">
                      Sri A. Revanth Reddy
                      <span className="block text-xs">
                        Hon'ble Chief Minister <br />
                        Government of Telangana
                      </span>
                    </p>
                  </div>
                  <img src={cmImg} alt="CM" className="w-16 h-20" />
                </div>

                <div className="flex items-center">
                  <div className="mr-2 text-right">
                    <p className="text-sm font-semibold">
                      Sri D. Sridhar Babu
                      <span className="block text-xs">
                        Hon'ble Minister for IT
                        <br />
                        Government of Telangana
                      </span>
                    </p>
                  </div>
                  <img
                    src={ITMinisterImg}
                    alt="Minister"
                    className="w-16 h-20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid main-section mt-2 flex flex-col md:flex-row">
            {/* Left side - MeeTicket Logo */}
            <div className="left-section flex justify-center items-center md:w-1/2">
              <img
                src={meetickesTelanganaImg}
                alt="MeeTicket Logo"
                className="h-[40vh] md:max-h-[100%] object-contain"
              />
            </div>

            {/* Right side - Login Section */}
            <div className="right-section flex justify-center items-center md:w-1/2 flex-grow">
              <div className="card border-stone-100 p-4 rounded-lg shadow-lg max-w-md w-full border border-neutral-300">
                <h3 className="text-center mt-3 text-lg text-gray-200 font-semibold">
                  Welcome to MeeTicket
                </h3>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="needs-validation">
                      <div className="mb-4">
                        <label
                          htmlFor="EmailId"
                          className="form-label block text-gray-200 text-sm"
                        >
                          User Name
                        </label>
                        <Field
                          id="EmailId"
                          name="EmailId"
                          placeholder="User Name"
                          className="form-control mt-1 block w-full border rounded-md p-2 text-sm"
                          autoComplete="off"
                          maxLength="255"
                        />
                        <ErrorMessage
                          name="EmailId"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4 relative">
                        <label
                          htmlFor="password"
                          className="form-label block text-gray-200 text-sm"
                        >
                          Password
                        </label>
                        <Field
                          id="password"
                          name="password"
                          placeholder="Password"
                          className="form-control mt-1 block w-full border rounded-md p-2 text-sm"
                          type="password"
                          autoComplete="off"
                          maxLength="49"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {error && (
                        <div className="text-red-500 text-center mb-4">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full bg-blue-v1 text-white rounded-md p-2"
                      >
                        Sign in
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
