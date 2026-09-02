import { useState } from "react";
import DepartmentList from "../../../components/department_management/DepartmentList";
import AdminLayout from "../../../layouts/AdminLayout";
import { useModalStore } from "../../../store/modalStore";
import { ToastContainer } from "react-toastify";
import useAuthStore from "../../../store/authStore";
import { ROLE_FOREST_DEPT_ADMIN } from "../../../constants/permissions";

const Departments = () => {
  const {roleDetails} = useAuthStore();
  const role = roleDetails?.name;
  const [isDepartmentTypeCreateVisible, setIsDepartmentTypeCreateVisible] = useState(false);
  const [isDepartmentTypeEditVisible, setIsDepartmentTypeEditVisible] = useState(false);

  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const forestDeptAdmin = ![ROLE_FOREST_DEPT_ADMIN].includes(role);
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Dashboard actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Departments
              </h1>
            </div>
            {/* Right: Actions */}
            {forestDeptAdmin && (
              <div className="flex justify-start gap-2">
                {/* Add view button */}
                <button
                  onClick={() => {
                    setOpenModalId("department-modal");
                  }}
                  className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Department</span>
                </button>
              </div>
            )}
          </div>

          <DepartmentList
            setIsDepartmentTypeCreateVisible={setIsDepartmentTypeCreateVisible}
            isDepartmentTypeEditVisible={isDepartmentTypeEditVisible}
            setIsDepartmentTypeEditVisible={setIsDepartmentTypeEditVisible}
            forestDeptAdmin={forestDeptAdmin}
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default Departments;
