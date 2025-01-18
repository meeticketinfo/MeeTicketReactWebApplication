import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import "tailwindcss/tailwind.css";
import UserList from "../../../components/user_management/UserList";
import GateKeeperCreate from "../../../components/user_management/GateKeeperCreate";
import GateKeeperList from "../../../components/user_management/GateKeeperList";
import BackButton from "../../../components/BackButton";
import { gateKeepersStore } from "../../../store/masters/gateKeepersStore";

// Validation schema using Yup

export default function GateKeepers() {
  // State to toggle the FacilityCreate component
  const [isGateKeeperCreateVisible, setIsGateKeeperCreateVisible] =
    useState(false);

     const {
        allGateKeepers,
        isFetchAllGateKeepersLoading,
        fetchAllGateKeepers,
        setIsEditGateKeeper,
        setCurrentGateKeeperEditDetails,
        IsEditGateKeeper,
      } = gateKeepersStore();

  // Function to toggle the visibility of GateKeeperCreate
  const toggleGateKeeperCreate = () => {
    setIsGateKeeperCreateVisible((prev) => !prev);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Gate Keeper
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            {!isGateKeeperCreateVisible ? (
            <button
              onClick={toggleGateKeeperCreate}
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              <span className="max-xs:sr-only">
               Create Gate Keeper
              </span>
            </button>
              ) : (
                <BackButton
                  label="Back"
                  onClick={() => {
                    setIsGateKeeperCreateVisible(false)
                    setIsEditGateKeeper(false)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                />
              )}
          </div>
        </div>

        {/* Cards */}
        {/* <div className="grid grid-cols-12 gap-6"> */}
        {isGateKeeperCreateVisible ? (
          <GateKeeperCreate
            setIsGateKeeperCreateVisible={setIsGateKeeperCreateVisible}
          />
        ) : (
          <GateKeeperList setIsGateKeeperCreateVisible={setIsGateKeeperCreateVisible} />
        )}
        {/* </div> */}
      </div>
    </AdminLayout>
  );
}
