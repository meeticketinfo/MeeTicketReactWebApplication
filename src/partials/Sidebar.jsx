/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoIcon from "../images/Meesava-icon1.png";

import SidebarLinkGroup from "./SidebarLinkGroup";

import { TbLogout2 } from "react-icons/tb";

import useSidebarStore from "../store/sidebarStore";
import sidebarItems from "./sidebarItems";
import useAuthStore from "../store/authStore";
import {
  parkAdminPermissions,
  superAdminPermissions,
  nodalOfficerPermissions,
  MetroReports,
} from "../constants/permissions";
import useCaptchaStore from "../store/useCaptchaStore";
import { useAggridStore } from "../store/agGridStore";
import usePaginationStore from "../store/paginationStore";

function Sidebar({ variant = "default" }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);
  const sidebarExpanded = useSidebarStore((state) => state.sidebarExpanded);
  const { quickFilterText, setQuickFilterText } = useAggridStore();
  const { activePage, setActivePage } = usePaginationStore();
  const setSidebarExpanded = useSidebarStore(
    (state) => state.setSidebarExpanded
  );
  const { sidebarMenuItems, roleDetails, logout,terminateSession } = useAuthStore();
  const { updateCaptchaInput } = useCaptchaStore();
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const role = roleDetails?.name;
  const rolePermissions = useMemo(() => {
    if (role === "ROLE_SUPERADMIN") {
      return superAdminPermissions;
    } else if (role === "ROLE_ADMIN") {
      return parkAdminPermissions;
    } else if (role === "ROLE_NODALOFFICER") {
      return nodalOfficerPermissions;
    }else if (role === "ROLE_METROADMIN") {
      return MetroReports;
    }
    return [];
  }, [role]);

  const filteredSidebarItems = useMemo(() => {
    return sidebarItems
      .map((item) => {
        if (item.subItems.length > 0) {
          const filteredSubItems = item.subItems.filter((subItem) =>
            rolePermissions.includes(subItem.path.substring(1))
          );
          return filteredSubItems.length > 0
            ? { ...item, subItems: filteredSubItems }
            : null;
        }
        return rolePermissions.includes(item.path.substring(1)) ? item : null;
      })
      .filter(Boolean); // Remove null entries
  }, [rolePermissions]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed  ${
          ""
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] w-64 overflow-y-scroll lg:overflow-y-auto no-scrollbar  sidebar-expanded  shrink-0 bg-blue-v1 dark:bg-gray-800 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } ${
          variant === "v2"
            ? "border-r border-gray-200 dark:border-gray-700/60"
            : "rounded-r-2xl shadow-sm"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-center my-3 pr-3 sm:px-2">
          {/* Close button */}
          <button
            type="button"
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400 outline-none "
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/dashboard" className="block">
            <img alt="site-logo" src={logoIcon} width={60} height={60} />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-200 dark:text-gray-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                {/* ••• */}
              </span>
            </h3>
            <ul className="mt-3">
              {filteredSidebarItems.map((item, index) => (
                <li
                  key={index}
                  className={`rounded-2xl mb-0.5 pb-2 last:mb-0 ${
                    item.subItems.some((subItem) =>
                      pathname.startsWith(subItem.path)
                    )
                      ? "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                      : ""
                  }`}
                >
                  {item.subItems.length > 0 ? (
                    <SidebarLinkGroup
                      activecondition={item.subItems.some((subItem) =>
                        pathname.startsWith(subItem.path)
                      )}
                    >
                      {(handleClick, open) => (
                        <>
                          <a
                            href="#0"
                            className="px-3 py-2 block text-gray-300 truncate transition duration-150  dark:hover:text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              handleClick();
                              setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <item.icon className="shrink-0 text-[22px]" />
                                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  {item.title}
                                </span>
                              </div>
                              <div className="flex shrink-0 ml-2">
                                <svg
                                  className={`w-3 h-3 ml-1 fill-current text-gray-400 dark:text-gray-500 ${
                                    open && "rotate-180"
                                  }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            {/*  Divider */}
                            <ul className={`mt-1 ${!open && "hidden"}`}>
                              {/* <hr className="w-full h-[1px] my-1 bg-gray-400 dark:bg-gray-700/60 border-none" /> */}
                              {item.subItems.map((subItem, subIndex) => (
                                <li
                                  key={subIndex}
                                  className="mb-1 px-2 last:mb-0"
                                >
                                  <NavLink
                                    end
                                    to={subItem.path}
                                    className={({ isActive }) =>
                                      `block truncate transition duration-150 ease-in-out rounded-2xl ml-8 px-3 py-2 font-medium text-sm ${
                                        isActive
                                          ? "bg-blue-v1 text-gray-100  border border-blue-v2 shadow-lg" // Active state styling
                                          : "text-gray-300 hover:bg-blue-v2 hover:text-white hover:border-blue-v1" // Hover styling
                                      }`
                                    }
                                    onClick={()=>{
                                      setQuickFilterText("")
                                      localStorage.removeItem("quickFilterText");
                                      setActivePage(0)
                                    }}
                                    // style={{
                                    //   clipPath:
                                    //     "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
                                    // }}
                                  >
                                    <div className="flex items-center">
                                      {subItem.icon && (
                                        <subItem.icon
                                          className={`shrink-0 text-[14px] ${
                                            pathname.includes(subItem.path)
                                              ? "text-violet-500"
                                              : "text-gray-400 dark:text-gray-500"
                                          }`}
                                        />
                                      )}
                                      <span className="text-sm font-medium ml-1 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                        {subItem.title}
                                      </span>
                                    </div>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </SidebarLinkGroup>
                  ) : (
                    <NavLink
                      end
                      to={item.path}
                      className={`px-3 py-2 block dark:text-gray-200 truncate transition duration-150 ${
                        pathname.includes(item.path)
                          ? "text-gray-200 bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04] "
                          : " text-gray-300 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`shrink-0 text-[22px] ${
                            pathname.includes(item.path)
                              ? "text-violet-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          {item.title}
                        </span>
                      </div>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-3 hidden lg:inline-flex justify-center mt-auto">
          <div className="pl-4 pr-3 py-2 bg-blue-v2 w-full flex justify-center">
            <button
              onClick={() => {
                updateCaptchaInput("");
                terminateSession();
                // logout();
                localStorage.clear();
              }}
              className="flex items-center gap-3 text-gray-200 hover:text-white dark:text-gray-500 dark:hover:text-gray-100"
            >
              <TbLogout2 className="shrink-0 text-[22px]" />
               <span className="">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
