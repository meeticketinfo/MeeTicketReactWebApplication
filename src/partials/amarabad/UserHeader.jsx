import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../images/user/logo.png";
import TelanganaRising from "../../images/user/telangana-rising-logo.png";
import DeccanTrailsLogo from "../../images/user/DeccanTrailsLogo.png"
import { amrabadAuthStore } from "../../store/amarabad/user/amrabadAuthStore";
import { FaHistory, FaShoppingCart, FaUser } from "react-icons/fa";

export const UserHeader = ({ isScrolled = false }) => {
  const { isLoggedIn, setIsLoggedIn, clearAmrabadSession, decodedTokenData } = amrabadAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/amrabad-resort/login");
    localStorage.removeItem("amrabadlogin-store");
    clearAmrabadSession();
    setIsDropdownOpen(false);
  };

  const links = [
    {
      label: "Home",
      to: "/amrabad-resort",
    },
    // {
    //   label: 'Download',
    //   to: 'https://play.google.com/store/apps/details?id=com.me_ticket_app&pcampaignid=web_share',
    //   target: '_blank'
    // },
    {
      label: 'Support',
      // to: '/amrabad-resort/contact-us'
    },
  ]
  return (
    <>
      {/* Top Bar */}
      {/* <div className="bg-[#362D86] text-white py-2 px-4 font-poppins text-sm">
        <div className='flex justify-between items-center container mx-auto'>
          <div className="flex items-center space-x-6">
            <a href='tel:080-25478698' className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6238_3983)">
                  <path d="M6.54 5C6.6 5.89 6.75 6.76 6.99 7.59L5.79 8.79C5.38 7.59 5.12 6.32 5.03 5H6.54ZM16.4 17.02C17.25 17.26 18.12 17.41 19 17.47V18.96C17.68 18.87 16.41 18.61 15.2 18.21L16.4 17.02ZM7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.51C21 15.96 20.55 15.51 20 15.51C18.76 15.51 17.55 15.31 16.43 14.94C16.33 14.9 16.22 14.89 16.12 14.89C15.86 14.89 15.61 14.99 15.41 15.18L13.21 17.38C10.38 15.93 8.06 13.62 6.62 10.79L8.82 8.59C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_6238_3983">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="hidden md:inline">080-25478698</span>
            </a>
            <a href="mailto:info@meeticket.telangana.in" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.196 19.021 2 18.55 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.97933 4.196 3.45 4 4 4H14.1C14.0333 4.33333 14 4.66667 14 5C14 5.33333 14.0333 5.66667 14.1 6H4L12 11L15.65 8.725C15.8833 8.94167 16.1377 9.129 16.413 9.287C16.6877 9.44567 16.975 9.58333 17.275 9.7L12 13L4 8V18H20V9.9C20.3833 9.81667 20.7417 9.7 21.075 9.55C21.4083 9.4 21.7167 9.21667 22 9V18C22 18.55 21.8043 19.021 21.413 19.413C21.021 19.8043 20.55 20 20 20H4ZM19 8C18.1667 8 17.4583 7.70833 16.875 7.125C16.2917 6.54167 16 5.83333 16 5C16 4.16667 16.2917 3.45833 16.875 2.875C17.4583 2.29167 18.1667 2 19 2C19.8333 2 20.5417 2.29167 21.125 2.875C21.7083 3.45833 22 4.16667 22 5C22 5.83333 21.7083 6.54167 21.125 7.125C20.5417 7.70833 19.8333 8 19 8Z" fill="white" />
              </svg>
              <span className="hidden md:inline">
                info@meeticket.telangana.in
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://www.facebook.com/amrabadtigerreserve/" target='_blank' rel="noreferrer" className="text-white">
              <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6238_3999)">
                  <path d="M7.35319 0.757812C7.61621 0.778367 7.87923 0.798922 8.14225 0.820761C8.32434 0.836177 8.50517 0.852878 8.69231 0.870863C8.69231 1.71746 8.69231 2.54863 8.69231 3.40037C8.61771 3.40037 8.54816 3.39908 8.47861 3.40037C7.95384 3.40807 7.4278 3.39908 6.90428 3.42863C6.25306 3.4646 5.89141 3.81403 5.86232 4.47435C5.83197 5.16678 5.856 5.8605 5.856 6.57734C6.76266 6.57734 7.67185 6.57734 8.6 6.57734C8.47861 7.53441 8.35975 8.4658 8.23962 9.41259C7.43918 9.41259 6.65138 9.41259 5.84841 9.41259C5.84841 11.8368 5.84841 14.2429 5.84841 16.6607C4.88485 16.6607 3.9352 16.6607 2.97163 16.6607C2.97163 14.2506 2.97163 11.8445 2.97163 9.41902C2.16487 9.41902 1.37328 9.41902 0.570312 9.41902C0.570312 8.46965 0.570312 7.53955 0.570312 6.5889C1.36064 6.5889 2.15349 6.5889 2.9691 6.5889C2.9691 6.50925 2.9691 6.44887 2.9691 6.38978C2.97163 5.64853 2.95393 4.90728 2.98428 4.1686C3.01968 3.27704 3.27891 2.45871 3.89852 1.79325C4.36893 1.28581 4.95693 0.99676 5.6208 0.856732C5.7991 0.819476 5.97992 0.792498 6.15948 0.760382C6.55781 0.757812 6.95613 0.757812 7.35319 0.757812Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_6238_3999">
                    <rect width="9.21202" height="16.6968" fill="white" transform="translate(0 0.304688)" />
                  </clipPath>
                </defs>
              </svg>
            </a>
            <a href="https://x.com/AmrabadTiger" target='_blank' rel="noreferrer" className="text-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.51724 7.01469L15.4786 0H14.0844L8.57101 6.39155L4.09953 0H0L6.11262 8.89552L0 15.2447H1.39419L7.05532 8.6142L11.9005 15.2447H16L9.51724 7.01469ZM7.53978 8.05072L7.00658 7.36939L1.38203 1.21428H3.09953L7.53645 6.983L8.06965 7.66433L14.0844 14.0055H12.3669L7.53978 8.05072Z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
      </div> */}

      {/* Main Header/Navigation - Amrabad theme: header gradient #304A3A → #7A8F7C */}
      <nav className={`bg-gradient-to-r from-[#304A3A] to-[#7A8F7C] sticky top-0 z-50 transition-all duration-300 font-poppins text-base ${isScrolled ? 'py-2' : 'py-1'
        } px-2 md:px-4 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_8px_rgba(48,74,58,0.2)]`}>
        <div className="container mx-auto flex justify-between items-center relative">
          <div className="flex-shrink-0">
            <img
              src={DeccanTrailsLogo}
              alt=""
              aria-hidden="true"
              className={`transition-all duration-300 opacity-0 pointer-events-none ${isScrolled ? 'w-[50px] md:w-[60px]' : 'w-[60px] md:w-[85px]'}`}
            />
          </div>
          <Link to="/amrabad-resort" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center flex-shrink-0 pointer-events-auto z-10">
            <img
              src={DeccanTrailsLogo}
              alt="Deccan Trails Logo"
              className={`transition-all duration-300 ${isScrolled ? 'w-[50px] md:w-[60px]' : 'w-[60px] md:w-[85px]'} brightness-0 invert`}
            />
          </Link>
          <div className="flex justify-between gap-12 items-center">
            <div className="flex gap-2 md:gap-8 items-center text-xs md:text-base">
              {links.map((link) => (
                <NavLink key={link.to} target={link.target} to={link.to} className="text-[#FDFAF7] font-medium hover:text-[#D0D7CE]">
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              {isLoggedIn ? (
                // After login: show user profile section
                <div className="flex items-center gap-3" ref={dropdownRef}>
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full bg-[#7A8F7C] flex items-center justify-center cursor-pointer hover:bg-[#4A6360] transition-colors"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {/* User icon SVG */}
                      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="16" fill="#D0D7CE" />
                        <path d="M16 16c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.314 0-10 1.657-10 5v3h20v-3c0-3.343-6.686-5-10-5z" fill="#304A3A" />
                      </svg>
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-[150px] bg-[#FDFAF7] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-[#C8BFB2] py-0 z-50">
                        <div className="px-4 py-3 border-b border-[#D0D7CE]">
                          {decodedTokenData ? (
                            <div className="font-bold text-[#304A3A] capitalize text-sm">
                              {`${decodedTokenData?.FirstName || decodedTokenData?.LastName ? decodedTokenData?.FirstName + " " + decodedTokenData?.LastName : decodedTokenData.PhoneNumber}`}
                            </div>
                          ) : (
                            <div className="h-4 bg-[#EDEBE1] rounded-lg animate-pulse w-32"></div>
                          )}
                        </div>
                        <Link to="/amrabad-resort/booking-history" className="px-4 py-2 text-xs text-[#394D48] hover:bg-[#EDEBE1] flex items-center gap-2">
                          <FaHistory />
                          Booking History
                        </Link>
                        <Link to="/amrabad-resort/checkout-details" className="px-4 py-2 text-xs text-[#394D48] hover:bg-[#EDEBE1] flex items-center gap-2">
                          <FaShoppingCart />
                          Go to Cart
                        </Link>
                        <div className="py-0">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-100 flex items-center gap-2"
                          >
                            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                              <path d="M6 2H4C3.45 2 3 2.45 3 3V13C3 13.55 3.45 14 4 14H6C6.55 14 7 13.55 7 13V3C7 2.45 6.55 2 6 2ZM12.5 7L9.5 4.5C9.22 4.22 8.78 4.22 8.5 4.5C8.22 4.78 8.22 5.22 8.5 5.5L10.29 7.25H3.75C3.34 7.25 3 7.59 3 8C3 8.41 3.34 8.75 3.75 8.75H10.29L8.5 10.5C8.22 10.78 8.22 11.22 8.5 11.5C8.78 11.78 9.22 11.78 9.5 11.5L12.5 9C12.78 8.72 12.78 8.28 12.5 8L12.5 7Z" fill="currentColor" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/amrabad-resort/login" className="bg-[#F2EDE7] text-[#304A3A] px-2 md:px-6 py-2 rounded-md hover:bg-[#EDEBE1] transition duration-300 flex items-center gap-2">
                    <span className="hidden md:block">Login</span>
                    <FaUser className="md:hidden" />
                  </Link>
                  <Link to="/amrabad-resort/register" className="hidden lg:block bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] px-6 py-2 rounded-md hover:opacity-90 transition duration-300">Register</Link>
                </>
              )}
              {/* <img
              src={TelanganaRising}
              alt="Telangana Rising Logo"
              className={`transition-all duration-300 ${isScrolled ? 'w-[30px] md:w-[40px]' : 'w-[40px] md:w-[59px]'
                }`}
            /> */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}