import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useMyProfileStore } from "../../store/MyProfile/MyProfileStore";
import useAuthStore from "../../store/authStore";

function MyProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { ProfileDetails, fetchMyProfileDetails } = useMyProfileStore();
  const { decodedTokenData } = useAuthStore();
  const userId = decodedTokenData?.data?.UserId;
  useEffect(() => {
    fetchMyProfileDetails(userId);
  }, []);

  console.log(ProfileDetails, "details");
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Dashboard actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                Entities
              </h1>
            </div>
            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Add view button */}
            </div>
          </div>

          {ProfileDetails ? (
            <div className=" space-x-9 bg-white/30 backdrop-blur-sm p-4">
              <div className="flex justify-center bg-gray-200">
                {/*Profile Image */}
                <div className="w-1/4">
                  <img
                    className="w-24 h-24 rounded-full"
                    src="\src\images\chief_minister.png"
                    alt="Profile Image"
                  />
                  <div className="absolute bottom-0  right-0 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>

                {/*Name and Contact Info */}
                <div className="flex flex-col space-y-4 w-1/2">
                  <h2 className="text-2xl font-semibold mt-3">
                    {" "}
                    {ProfileDetails.firstName} {ProfileDetails.middleName}{" "}
                    {ProfileDetails.lastName}
                  </h2>
                  <div className="flex justify-between items-center text-center pt-4">
                    <p className="text-gray-700 mt-6">
                      Mobile number:{" "}
                      <a href="tel:+1234567890" className="text-blue-500">
                        {ProfileDetails.phoneNumber}
                      </a>
                    </p>
                    <p className=" text-gray-700 mx-9 mt-6">
                      Email:{" "}
                      <a
                        href="mailto:johndoe@testbg.com"
                        className="text-blue-500"
                      >
                        {ProfileDetails.email}
                      </a>
                    </p>
                    <p className="text-gray-600 mt-6">
                      Status: {ProfileDetails.status ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className="text-sm font-medium text-gray-600 space-y-4">
                    <p className="text-sm font-medium text-gray-600">
                      Profile Completion: 75%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading profile data....</p>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
export default MyProfile;
