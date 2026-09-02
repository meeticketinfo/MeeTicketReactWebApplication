import { useState } from "react";
import DepartmentList from "../../../components/department_management/DepartmentList";
import AdminLayout from "../../../layouts/AdminLayout";
import EntityTypeList from "../../../components/entity_type_management/EntityTypeList";
import { useModalStore } from "../../../store/modalStore";
import useAuthStore from "../../../store/authStore";
import { ROLE_FOREST_DEPT_ADMIN } from "../../../constants/permissions";

const EntityTypes = () => {
  const {roleDetails} = useAuthStore();
  const role = roleDetails?.name;
  const [isEntityTypeCreateVisible, setIsEntityTypeCreateVisible] = useState(false);
  const [isEntityTypeEditVisible, setIsEntityTypeEditVisible] = useState(false);
  const toggleEntityTypeCreate = () => {
    setIsEntityTypeCreateVisible((prev) => !prev);
    setIsEntityTypeEditVisible(false);
    false;
  };

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
                Location Category
              </h1>
            </div>
            {/* Right: Actions */}
            {forestDeptAdmin && (
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Add view button */}
                <button
                  onClick={() => {
                    setOpenModalId("entity-modal");
                    setIsEntityTypeEditVisible(false);
                  }}
                  className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm"
                >
                  <span>Add Location Category</span>
                </button>
              </div>
            )}
          </div>

          <EntityTypeList
            setIsEntityTypeCreateVisible={setIsEntityTypeCreateVisible}
            isEntityTypeCreateVisible={isEntityTypeCreateVisible}
            isEntityTypeEditVisible={isEntityTypeEditVisible}
            setIsEntityTypeEditVisible={setIsEntityTypeEditVisible}
            forestDeptAdmin={forestDeptAdmin}
          />
          {/* </div> */}
        </div>
      </AdminLayout>
    </>
  );
};

export default EntityTypes;
