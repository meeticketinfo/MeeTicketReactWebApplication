import React, { useState, useEffect, useRef } from "react";
import UserMenu from "../components/DropdownProfile";
import useSidebarStore from "../store/sidebarStore";
import headerLogo from "../images/Telangana-logo.png";
import useAuthStore from "../store/authStore";
import { toTitleCase } from "../utils/TypographyHelper";
import { RiMenuUnfold2Line } from "react-icons/ri";
import { RiMenuFold2Line } from "react-icons/ri";
import { fetchQRFile } from "../services/fetchFileService";
import { BsQrCode } from "react-icons/bs";
import { FaDownload } from "react-icons/fa6";

function Header({ variant = "default" }) {
  const { sidebarOpen, sidebarExpanded, setSidebarOpen, setSidebarExpanded } =
    useSidebarStore();
  const { logout, isAuthenticated, roleDetails, decodedTokenData } =
    useAuthStore();
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <header
      className={`sticky top-4 before:absolute shadow-lg backdrop-blur-sm bg-white/30 border border-bluev1 z-30 mx-4 rounded-2xl `}
    >
      <div className="px-4 sm:px-6 lg:px-8 shadow-lg rounded-2xl">
        <div
          className={`flex items-center justify-between h-16  ${
            variant === "v2" || variant === "v3"
              ? ""
              : " dark:border-gray-700/60"
          }`}
        >
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              // aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>

            {/* toggle sidebar icon */}
            <div className=" hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
              <div className="flex justify-center items-center px-3">
                <button
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                >
                  <span className="sr-only">Expand / collapse sidebar</span>
                  {sidebarExpanded ? (
                    <RiMenuUnfold2Line className="text-[28px] text-blue-v1" />
                  ) : (
                    <RiMenuFold2Line className="text-[28px] text-blue-v1" />
                  )}
                </button>
              </div>
              <div className="align-middle hidden lg:inline-flex 2xl:hidden justify-end ">
                <div className="flex justify-center items-center">
                  <img
                    alt="site-logo"
                    src={headerLogo}
                    width={30}
                    height={30}
                  />
                </div>
                <div className="pl-2 flex flex-col text-black">
                  <p>Government of Telangana</p>
                  <small className="text-[10px] pl-1">ITE&C Department</small>
                </div>
              </div>
            </div>
          </div>
          {roleDetails?.name == "ROLE_ADMIN" && (
            <div className="align-middle hidden lg:inline-flex 2xl:hidden justify-end ">
              <div className="pl-2 text-blue-v1 text-[20px] font-bold tracking-widest flex flex-col ">
                <p>
                  {(decodedTokenData?.data?.ParkName &&
                    toTitleCase(decodedTokenData?.data?.ParkName)) ||
                    "Park Name"}
                </p>
                {/* <small className="text-[10px] pl-1">ITE&C Department</small> */}
              </div>
            </div>
          )}

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            {roleDetails?.name == "ROLE_ADMIN" && (
              <button
                onClick={() => {
                  fetchQRFile(decodedTokenData?.data?.ParkId || "");
                }}
              >
                <div className="relative">
                  <BsQrCode className="text-2xl text-gray-600" />
                  <FaDownload className="absolute -bottom-1 -right-1 text-lg text-gray-700 bg-gray-200 rounded-full p-1 border border-gray-950" />
                </div>
              </button>
            )}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
