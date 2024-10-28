import React, { useState } from "react";
import headerLogo from "../../images/Telangana-logo.png";
import cmImg from "../../images/chief_minister.png";
import ITMinisterImg from "../../images/it_minister.png";
import meetickesTelanganaImg from "../../images/meetickets-telangana.png";
import { Link, Navigate } from "react-router-dom";
import Loader from "../../web_app_loaders/Loader";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard"); // Navigate to dashboard after 2 seconds
    }, 2000);
  };

  return (
    <>
      {loading ? (
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
            <div className="right-section flex justify-center  items-center md:w-1/2 flex-grow">
              <div className="card border-stone-100 p-4 rounded-lg shadow-lg max-w-md w-full border border-neutral-300">
                <h3 className="text-center mt-3 text-lg  text-gray-200 font-semibold">
                  Welcome to MeeTicket
                </h3>
                <form
                  id="loginForm"
                  noValidate
                  className="needs-validation "
                  action="/v1/login/loginaction"
                  method="post"
                  encType="multipart/form-data"
                  autoComplete="off"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="userName"
                      className="form-label block text-gray-200 text-sm"
                    >
                      User Name
                    </label>
                    <input
                      id="userName"
                      name="userName"
                      placeholder="User Name"
                      className="form-control mt-1 block w-full border rounded-md p-2 text-sm"
                      required
                      type="text"
                      maxLength="255"
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-4 relative">
                    <label
                      htmlFor="password"
                      className="form-label block text-gray-200 text-sm"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="form-control mt-1 block w-full border rounded-md p-2 text-sm"
                      required
                      type="password"
                      maxLength="49"
                      autoComplete="off"
                    />
                    <i
                      className="fa-solid fa-eye toggle-password absolute top-3 right-3 cursor-pointer"
                      id="togglePassword"
                    ></i>
                  </div>

                  <div className="mb-4">
                    <div className="captcha-container mb-1 flex items-center">
                      <img
                        src="/captcha"
                        id="imageId"
                        alt="CAPTCHA Image"
                        className="h-20 w-72"
                      />
                      <button
                        type="button"
                        className="text-blue-500 ml-2 text-sm"
                      >
                        <i className="fa-solid fa-repeat"></i>
                      </button>
                    </div>
                    <label
                      htmlFor="captchaInput"
                      className="form-label block text-gray-200 text-sm"
                    >
                      Enter above Letters
                    </label>
                    <input
                      id="captchaInput"
                      name="captchatext"
                      type="text"
                      className="form-control mt-1 block w-full border rounded-md p-2 text-sm"
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-4"></div>

                  <div className="social-auth-links text-center mb-3">
                    <button
                      to="/dashboard" // This will not work until you implement the routing logic after 2 seconds
                      onClick={handleLoginClick}
                      className="btn btn-primary w-full bg-blue-v1 text-white rounded-md p-2"
                    >
                      Sign in
                    </button>
                  </div>
                </form>

                <hr />
                {/* Optional Sign Up Button */}
                {/* <button className="signup-btn">New To MeeTicket? Sign Up</button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
