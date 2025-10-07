import React from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { IoNavigateOutline } from "react-icons/io5";
import { IoNavigate } from "react-icons/io5";
const AmrabadContactUs = () => {
  return (
    <UserLayout>
      <div className="min-h-screen ">
        {/* Hero Section with Tiger Background */}
        <div className="relative h-44  overflow-hidden">
          {/* Tiger Background Image */}
          <div
            className="absolute inset-0 bg-cover  bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://amrabadtigerreserve.com/wp-content/uploads/2021/02/bengal-tiger-1149535_1280.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Contact Us Text Overlay */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-5xl font-bold text-shadow-sm text-white text-center">
              CONTACT US
            </h1>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="py-10 px-4 sm:px-6 lg:px-8 m-8 rounded-3xl shadow-md bg-gray-100  ">
          <h2 className="text-3xl font-bold mb-8 text-center text-black text-shadow-sm  ">
            What can we help you with?
          </h2>
          <div className="max-w-7xl mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - Contact Information */}
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg shadow-lg p-8 border border-gray-200">
                  <h2 className="text-3xl  font-bold  text-gray-900 mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-blue-v2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold  text-gray-900">
                          Phone
                        </h3>
                        <p className="text-gray-600">+91 9154281766</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-blue-v2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold  text-gray-900">
                          Email
                        </h3>
                        <p className="text-gray-600">atrecotourism@gmail.com</p>
                        <p className="text-gray-600">atrcircle@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Help Section with Tiger Background */}
              <div
                className="relative shadow-lg rounded-lg p-8  text-white overflow-hidden"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Green overlay */}
                <div className="absolute inset-0 bg-blue-v1 bg-opacity-60"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                      <IoNavigate className="h-6 w-6"/>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">DFo Nalgonda</h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                      <IoNavigate className="h-6 w-6"/>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">FDO Achampet</h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                      <IoNavigate className="h-6 w-6"/>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">FDO Amrabad</h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                      <IoNavigate className="h-6 w-6"/>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          FDO Nagarjunasagar
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AmrabadContactUs;
