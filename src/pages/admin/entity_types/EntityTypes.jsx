import { useState } from "react";
import DepartmentList from "../../../components/department_management/DepartmentList";
import AdminLayout from "../../../layouts/AdminLayout";
import EntityTypeList from "../../../components/entity_type_management/EntityTypeList";
import { useModalStore } from "../../../store/modalStore";

const EntityTypes = () => {
  const [isEntityTypeCreateVisible, setIsEntityTypeCreateVisible] =
    useState(false);
  const [isEntityTypeEditVisible, setIsEntityTypeEditVisible] = useState(false);
  const toggleEntityTypeCreate = () => {
    setIsEntityTypeCreateVisible((prev) => !prev);
    setIsEntityTypeEditVisible(false);
    false;
  };

    const { openModalId, setOpenModalId, closeModal } = useModalStore();

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
              <button
                onClick={() => {
                  setOpenModalId("entity-modal");
                }}
                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                <span className="max-xs:sr-only">Add Location Category</span>
              </button>
            </div>
          </div>

          {/* Cards */}
          {/* <div className="grid grid-cols-12 gap-6"> */}
          {/* {isEntityTypeCreateVisible ? (
            <></>
          ) : (
            <DepartmentList
              setIsEntityTypeCreateVisible={
                setIsEntityTypeCreateVisible
              }
              isEntityTypeEditVisible={isEntityTypeEditVisible}
              setIsEntityTypeEditVisible={setIsEntityTypeEditVisible}
            />
          )} */}
          <EntityTypeList
            setIsEntityTypeCreateVisible={setIsEntityTypeCreateVisible}
            isEntityTypeCreateVisible={isEntityTypeCreateVisible}
            isEntityTypeEditVisible={isEntityTypeEditVisible}
            setIsEntityTypeEditVisible={setIsEntityTypeEditVisible}
          />
          {/* </div> */}
        </div>
      </AdminLayout>
    </>
  );
};

export default EntityTypes;
