import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../utils/Transition";

import UserAvatar from "../images/userimg.svg";

import useAuthStore from "../store/authStore";
import useCaptchaStore from "../store/useCaptchaStore";

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const navigate = useNavigate();

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const { logout, isAuthenticated, roleDetails, decodedTokenData,terminateSession,Details } =
    useAuthStore();
  const { updateCaptchaInput } = useCaptchaStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Handle mobile tooltip
  const handleMobileTooltip = () => {
    setShowMobileTooltip(true);
    setTimeout(() => setShowMobileTooltip(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-8 h-8 rounded-full  "
          src={UserAvatar}
          width="42"
          height="42"
          alt="User"
        />
        <div className="flex items-center truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px]">
          <span 
            className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white break-words"
            title={decodedTokenData?.data?.name || decodedTokenData?.data?.firstName || Details?.EmailId || "Name"}
          >
            {Details?.EmailId || "Name"}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div 
              className="font-normal text-sm text-black dark:text-gray-100 break-words relative"
              title={decodedTokenData?.data?.name || decodedTokenData?.data?.firstName || "User Name"}
              onClick={handleMobileTooltip}
            >
              {Details?.EmailId || "Name"}
              {/* Mobile tooltip */}
              {showMobileTooltip && (
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap">
                  {decodedTokenData?.data?.name || decodedTokenData?.data?.firstName || "User Name"}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
            {Details?.PhoneNumber&&
            <div className="font-normal text-xs text-black dark:text-gray-100 break-words">
              Mobile Number : <span>{Details?.PhoneNumber || "mobile"}</span>
              {/* {decodedTokenData?.data?.email || "Name"} */}
            </div>
            }
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              {roleDetails?.displayName || "User Designation"}
            </div>
          </div>
          <ul>
            {/* <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/settings"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Settings
              </Link>
            </li> */}
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                // to="/signin"
                 onClick={async () => {
                try {
                  // Call backend to terminate session
                  await terminateSession();
                } catch (error) {
                  console.error("Terminate session failed:", error);
                } finally {
                  // Clear frontend state
                  updateCaptchaInput("");
                  logout();
                  localStorage.clear();
                }
              }}
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
