import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import BackButton from "../../../components/BackButton";
import PosList from "./PosList";
import CreatePosUser from "./CreatePosUser";

const PosMain = () => {
  const [isPosCreateVisible, setIsPosCreateVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const togglePosCreate = () => {
    setIsPosCreateVisible((prev) => !prev);
  };
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              POS Admin
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {!isPosCreateVisible ? (
              <button
                onClick={togglePosCreate}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm"
              >
                <span>Add POS Admin</span>
              </button>
            ) : (
              <BackButton
                label="Back"
                onClick={() => {
                  setIsPosCreateVisible(false);
                  setIsEdit(false);
                  setCurrentPosUserEditDetails({});
                }}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>
        {/* Cards */}

        {isPosCreateVisible ? (
          <CreatePosUser
            setIsPosCreateVisible={setIsPosCreateVisible}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
          />
        ) : (
          <PosList
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            setIsPosCreateVisible={setIsPosCreateVisible}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PosMain;
