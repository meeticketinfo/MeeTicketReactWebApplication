import React, { useState, useEffect, useRef } from "react";
import UserMenu from "../components/DropdownProfile";
import useSidebarStore from "../store/sidebarStore";
import headerLogo from "../images/Telangana-logo.png";
import useAuthStore from "../store/authStore";
import { toTitleCase } from "../utils/TypographyHelper";
import { RiMenuUnfold2Line } from "react-icons/ri";
import { RiMenuFold2Line } from "react-icons/ri";

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
      className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white dark:max-lg:before:bg-white before:-z-10 z-30  ${
        variant === "v2" || variant === "v3"
          ? "before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-white dark:after:bg-gray-700/60 after:-z-10"
          : "max-lg:shadow-sm lg:before:bg-white dark:lg:before:bg-gray-900/90"
      } ${variant === "v2" ? "dark:before:bg-gray-800" : ""} ${
        variant === "v3" ? "dark:before:bg-gray-900" : ""
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between h-16  ${
            variant === "v2" || variant === "v3"
              ? ""
              : "lg:border-b border-gray-200 dark:border-gray-700/60"
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
            <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
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
          <div className="align-middle hidden lg:inline-flex 2xl:hidden justify-end ">
            <div className="pl-2 flex flex-col text-black">
              <p>
                {(decodedTokenData?.data?.ParkName &&
                  toTitleCase(decodedTokenData?.data?.ParkName)) ||
                  "Park Name"}
              </p>
              {/* <small className="text-[10px] pl-1">ITE&C Department</small> */}
            </div>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
