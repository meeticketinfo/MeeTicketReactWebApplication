import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import "tailwindcss/tailwind.css";
import UserCreate from "../../../components/user_management/UserCreate";
import UserList from "../../../components/user_management/UserList";

// Validation schema using Yup

export default function AdminUsers() {
  // State to toggle the FacilityCreate component
  const [isUserCreateVisible, setIsUserCreateVisible] = useState(true);

  // Function to toggle the visibility of UserCreate
  const toggleUserCreate = () => {
    setIsUserCreateVisible((prev) => !prev);
  };
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Park Admin
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            <button
              onClick={toggleUserCreate}
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              <span className="max-xs:sr-only">
                {isUserCreateVisible ? "Create Park Admin" : "Back"}
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        {/* <div className="grid grid-cols-12 gap-6"> */}
        {!isUserCreateVisible ? (
          <UserCreate roleName={"ROLE_ADMIN"} />
        ) : (
          <UserList />
        )}
        {/* </div> */}
      </div>
    </AdminLayout>
  );
}
