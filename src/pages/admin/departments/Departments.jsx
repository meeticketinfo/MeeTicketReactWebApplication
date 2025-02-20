import { useState } from "react";
import DepartmentList from "../../../components/department_management/DepartmentList";
import AdminLayout from "../../../layouts/AdminLayout";
import { useModalStore } from "../../../store/modalStore";
import { ToastContainer } from "react-toastify";

const Departments = () => {
  const [isDepartmentTypeCreateVisible, setIsDepartmentTypeCreateVisible] =
    useState(false);
  const [isDepartmentTypeEditVisible, setIsDepartmentTypeEditVisible] =
    useState(false);

  const { openModalId, setOpenModalId, closeModal } = useModalStore();

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
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Add view button */}
              <button
                onClick={() => {
                  setOpenModalId("department-modal");
                }}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                <span className="max-xs:sr-only">Add Department</span>
              </button>
            </div>
          </div>

          <DepartmentList
            setIsDepartmentTypeCreateVisible={setIsDepartmentTypeCreateVisible}
            isDepartmentTypeEditVisible={isDepartmentTypeEditVisible}
            setIsDepartmentTypeEditVisible={setIsDepartmentTypeEditVisible}
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default Departments;
