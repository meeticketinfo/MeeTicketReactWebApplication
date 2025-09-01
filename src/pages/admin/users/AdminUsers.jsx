import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import "tailwindcss/tailwind.css";
import UserCreate from "../../../components/user_management/UserCreate";
import UserList from "../../../components/user_management/UserList";
import ParkAdminList from "../../../components/user_management/ParkAdminList";
import BackButton from "../../../components/BackButton";

// Validation schema using Yup

export default function AdminUsers() {
  // State to toggle the FacilityCreate component
  const [isUserCreateVisible, setIsUserCreateVisible] = useState(false);
  const [isUserEditVisible, setIsUserEditVisible] = useState(false);
  

  // Function to toggle the visibility of UserCreate
  const toggleUserCreate = () => {
    setIsUserCreateVisible((prev) => !prev);
    setIsUserEditVisible(false)
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Location Admin
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            {!isUserCreateVisible ? (
              <button
                onClick={toggleUserCreate}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm"
              >
                <span >Create Location Admin</span>
              </button>
            ) : (
              <BackButton
                label="Back"
                onClick={() => setIsUserCreateVisible(false)}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>

        </div>

        {/* Cards */}
        {/* <div className="grid grid-cols-12 gap-6"> */}
        {isUserCreateVisible ? (
          <UserCreate roleName={"ROLE_ADMIN"}
            setIsUserCreateVisible={setIsUserCreateVisible}
            isUserEditVisible={isUserEditVisible}
            setIsUserEditVisible={setIsUserEditVisible}
          />
        ) : (
          <ParkAdminList
            setIsUserCreateVisible={setIsUserCreateVisible}
            isUserEditVisible={isUserEditVisible}
            setIsUserEditVisible={setIsUserEditVisible}
          />
        )}
        {/* </div> */}
      </div>
    </AdminLayout>
  );
}
