import React, { useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import { ToastContainer } from "react-toastify";
import PackagesList from "./PackagesList";
import AddPackage from "./AddPackage";
import HouseCreate from "./HouseCreate";
import BackButton from "../../../../components/BackButton";
import { usePackagesCommonStore } from "../../../../store/amrabad/masters/packagesCommonStore";

const MainPackages = () => {
  const { currentTab, setCurrentTab ,setIsHouseEditVisible,isHouseEditVisible } = usePackagesCommonStore();
  const TabConfig = {
    0: <PackagesList />,
    1: <AddPackage />,
    2: <HouseCreate />,
  };
  const TitleConfig = {
    0: "Packages",
    1: "Add Package",
    2: isHouseEditVisible ? "Edit House" : "Add House",
  };
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold"> 
            {TitleConfig[currentTab]}
            </h1>
          </div>
          {/* buttons */}
          {currentTab == 0 ? (
            <div className="flex justify-between gap-2">
              <button
                className="btn bg-gray-900 text-white shadow-sm hover:bg-gray-800"
                onClick={() => {
                  setCurrentTab(1);
                  setIsHouseEditVisible(true)
                }}
              >
                <span className="max-xs:sr-only ">Add Package</span>
              </button>
              <button
                className="btn bg-gray-900 text-white shadow-sm hover:bg-gray-800 "
                onClick={() => {
                  setCurrentTab(2);
                  setIsHouseEditVisible(false)
                }}
              >
                <span className="max-xs:sr-only ">Add House</span>
              </button>
            </div>
          ) : currentTab == 1 ? (
            <div>
              <BackButton
                label="Back"
                onClick={() => {
                  setCurrentTab(0);
                  setIsHouseEditVisible(false)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          ) : currentTab == 2 ? (
            <div>
              <BackButton
                label="Back"
                onClick={() => {
                  setCurrentTab(0);
                  setIsHouseEditVisible(false)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          ) : null}
        </div>
        {/* <SummaryReportList /> */}
        <div>{TabConfig[currentTab]}</div>
      </div>
    </AdminLayout>
  );
};

export default MainPackages;
