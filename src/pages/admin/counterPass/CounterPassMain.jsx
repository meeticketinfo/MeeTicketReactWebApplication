import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import BackButton from "../../../components/BackButton";
import CounterPassList from "./CounterPassList";
import CreateCounterPassUser from "./CreateCounterPassUser";
import { CounterPassUserCreationStore } from "./counterpass_store/CounterPassUserCreationStore";

const CounterPassMain = () => {
  const [isCounterPassCreateVisible, setIsCounterPassCreateVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { setCurrentCounterPassUserEditDetails } = CounterPassUserCreationStore();
  const toggleCounterPassCreate = () => {
    setIsCounterPassCreateVisible((prev) => !prev);
  };
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Dashboard actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Counter Pass Admin
              </h1>
            </div>
            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {!isCounterPassCreateVisible ? (
                <button
                  onClick={toggleCounterPassCreate}
                  className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm"
                >
                  <span>Add Counter</span>
                </button>
              ) : (
                <BackButton
                  label="Back"
                  onClick={() => {
                    setIsCounterPassCreateVisible(false);
                    setIsEdit(false);
                    setCurrentCounterPassUserEditDetails({});
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                />
              )}
            </div>
          </div>
          {/* Cards */}

          {isCounterPassCreateVisible ? (
            <CreateCounterPassUser
              setIsCounterPassCreateVisible={setIsCounterPassCreateVisible}
              setIsEdit={setIsEdit}
              isEdit={isEdit}
            />
          ) : (
            <CounterPassList
              setIsEdit={setIsEdit}
              isEdit={isEdit}
              setIsCounterPassCreateVisible={setIsCounterPassCreateVisible}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default CounterPassMain;

