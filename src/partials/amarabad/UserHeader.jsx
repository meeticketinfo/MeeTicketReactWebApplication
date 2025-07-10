import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../images/user/logo.png';
import TelanganaRising from '../../images/user/telangana-rising-logo.png';
import { amrabadAuthStore } from '../../store/amarabad/user/amrabadAuthStore';

function UserHeader({ isScrolled = false }) {
  const { isLoggedIn, setIsLoggedIn } = amrabadAuthStore();
  const navigate = useNavigate();
  const links = [
    {
      label: 'Home',
      to: '/amarabad'
    },
    {
      label: 'How It Works',
      to: '/how-it-works'
    },
    {
      label: 'Download',
      to: '/download'
    },
    {
      label: 'Support',
      to: '/support'
    },
  ]
  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#362D86] text-white py-2 px-4 font-poppins">
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
              <span>080-25478698</span>
            </a>
            <a href="mailto:info@meeticket.telangana.in" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.196 19.021 2 18.55 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.97933 4.196 3.45 4 4 4H14.1C14.0333 4.33333 14 4.66667 14 5C14 5.33333 14.0333 5.66667 14.1 6H4L12 11L15.65 8.725C15.8833 8.94167 16.1377 9.129 16.413 9.287C16.6877 9.44567 16.975 9.58333 17.275 9.7L12 13L4 8V18H20V9.9C20.3833 9.81667 20.7417 9.7 21.075 9.55C21.4083 9.4 21.7167 9.21667 22 9V18C22 18.55 21.8043 19.021 21.413 19.413C21.021 19.8043 20.55 20 20 20H4ZM19 8C18.1667 8 17.4583 7.70833 16.875 7.125C16.2917 6.54167 16 5.83333 16 5C16 4.16667 16.2917 3.45833 16.875 2.875C17.4583 2.29167 18.1667 2 19 2C19.8333 2 20.5417 2.29167 21.125 2.875C21.7083 3.45833 22 4.16667 22 5C22 5.83333 21.7083 6.54167 21.125 7.125C20.5417 7.70833 19.8333 8 19 8Z" fill="white" />
              </svg>
              <span>
                info@meeticket.telangana.in
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-white">
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
            <a href="#" className="text-white">
              <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.12109 14.115C4.14958 14.297 5.94122 13.8096 7.57083 12.5908C5.87437 12.4381 4.74414 11.5845 4.10797 10.0041C4.67198 10.0669 5.19615 10.0833 5.76016 9.92835C4.87075 9.71009 4.16773 9.27712 3.62719 8.59712C3.08841 7.91934 2.82013 7.14548 2.82146 6.25077C3.33766 6.50975 3.85872 6.67931 4.43513 6.69303C2.80729 5.32285 2.42966 3.6928 3.33456 1.73426C5.36305 4.11691 7.90065 5.42069 10.9841 5.62788C10.9708 5.2591 10.9385 4.90848 10.9487 4.55874C10.9934 3.03272 12.1626 1.58374 13.6457 1.20788C15.0185 0.85991 16.2245 1.17246 17.2564 2.14111C17.3334 2.21327 17.3972 2.23319 17.5052 2.20928C18.2707 2.03973 18.9927 1.76038 19.7183 1.34246C19.4279 2.21991 18.9055 2.8552 18.1887 3.35324C18.8842 3.29259 19.539 3.08806 20.2181 2.81535C19.7431 3.51173 19.2145 4.09478 18.573 4.56759C18.4105 4.68712 18.3685 4.81285 18.3725 5.00853C18.4079 6.71119 18.0303 8.32619 17.2905 9.85619C16.4024 11.6925 15.1128 13.1792 13.3685 14.2567C12.1267 15.0239 10.7743 15.4804 9.32794 15.6716C8.05781 15.8394 6.79609 15.7991 5.54367 15.5317C4.35057 15.2767 3.2376 14.8207 2.20255 14.1761C2.1875 14.1668 2.17422 14.1553 2.12109 14.115Z" fill="white" />
              </svg>
            </a>
            <a href="#" className="text-white">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6238_3995)">
                  <path d="M6.40095 0C7.81686 0 9.23459 0 10.6505 0C10.8481 0.0108777 11.0457 0.0253813 11.2451 0.0290071C11.9486 0.0435107 12.6502 0.068892 13.3373 0.232057C14.6009 0.531193 15.6162 1.17842 16.2598 2.33689C16.684 3.10195 16.8834 3.93228 16.9233 4.79706C17.0284 7.08681 17.0176 9.37837 16.9469 11.6681C16.9305 12.2174 16.8743 12.7758 16.7529 13.3107C16.3558 15.0674 15.2953 16.2259 13.5421 16.7136C12.8387 16.9094 12.1135 16.9565 11.3884 16.9637C9.70595 16.9819 8.02354 16.9928 6.34294 16.9964C5.49629 16.9982 4.64965 16.9656 3.81569 16.797C2.46505 16.5232 1.40447 15.8325 0.71374 14.6214C0.282259 13.8654 0.129971 13.0296 0.0574536 12.1758C0.0338853 11.8911 0.0139429 11.6047 -0.0078125 11.32C-0.0078125 9.40557 -0.0078125 7.4911 -0.0078125 5.57481C0.00125223 5.49323 0.0121299 5.41165 0.0211946 5.33006C0.077396 4.82425 0.10459 4.31481 0.19705 3.81625C0.548762 1.91266 1.90666 0.565639 3.80844 0.193985C4.52999 0.0525755 5.2588 0.0416978 5.98941 0.0271942C6.1272 0.0235683 6.26317 0.00906473 6.40095 0ZM15.4331 8.26885H15.4548C15.4548 7.63795 15.4748 7.00704 15.4494 6.37613C15.4204 5.62557 15.404 4.86958 15.288 4.12808C15.0995 2.91884 14.3942 2.11027 13.1941 1.80026C12.7154 1.67698 12.2169 1.58814 11.7238 1.5682C10.5526 1.52106 9.37962 1.51744 8.20665 1.51018C7.36 1.50475 6.51336 1.51744 5.66671 1.53013C5.04124 1.541 4.41759 1.5682 3.80663 1.72955C2.82038 1.99062 2.1369 2.5762 1.81057 3.56063C1.56401 4.30575 1.50237 5.07806 1.49512 5.85219C1.48062 7.65607 1.47518 9.45996 1.49512 11.2638C1.50056 11.8023 1.55313 12.3498 1.66191 12.8774C1.93023 14.1954 2.7243 15.0311 4.0695 15.2705C4.62789 15.3702 5.20078 15.4246 5.76642 15.4336C7.37088 15.4608 8.97534 15.4717 10.5798 15.4536C11.3195 15.4463 12.0628 15.4028 12.7934 15.2976C14.0969 15.1091 14.9671 14.2915 15.2409 13.0333C15.3497 12.5329 15.4095 12.0162 15.4222 11.505C15.4494 10.4263 15.4312 9.34755 15.4312 8.26885H15.4331Z" fill="white" />
                  <path d="M8.4896 4.14064C10.8954 4.1352 12.8425 6.07324 12.8552 8.49171C12.8679 10.9011 10.9099 12.8609 8.49323 12.8609C6.08201 12.8609 4.13853 10.9156 4.13672 8.5044C4.13672 6.09318 6.07657 4.14789 8.4896 4.14245V4.14064ZM11.3232 8.50621C11.3232 6.93801 10.0723 5.67802 8.50411 5.67258C6.93772 5.66714 5.67228 6.92351 5.66685 8.48627C5.66141 10.0617 6.92322 11.329 8.49504 11.329C10.0632 11.329 11.3214 10.0708 11.3232 8.50621Z" fill="white" />
                  <path d="M14.045 3.95512C14.0468 4.51895 13.6028 4.974 13.0447 4.97944C12.4775 4.98488 12.0153 4.53164 12.0117 3.96781C12.0099 3.39855 12.4611 2.94531 13.032 2.94531C13.5956 2.94531 14.0432 3.3913 14.045 3.95512Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_6238_3995">
                    <rect width="17.0073" height="17" fill="white" transform="translate(-0.0078125)" />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header/Navigation */}
      <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 font-poppins ${isScrolled ? 'py-2 shadow-md' : 'py-4'
        } px-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Meeticket Logo"
              className={`transition-all duration-300 ${isScrolled ? 'w-[60px]' : 'w-[85px]'
                }`}
            />
            <div>
              <div className={`font-bold text-[#362D86] transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-3xl'
                }`}>MEETICKET</div>
              <div className={`text-[#515151] transition-all duration-300 ${isScrolled ? 'text-[10px]' : 'text-xs'
                }`}>GOVERNMENT OF TELANGANA</div>
            </div>
          </div>
          <div className="flex gap-8 items-center text-base">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className="text-black hover:text-[#362D86]">
                {link.label}
              </NavLink>
            ))}
            {isLoggedIn ? (
              // After login: show user profile section
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end mr-2">
                  <span className="font-bold text-black leading-tight">S.SANTHOSH KUMAR</span>
                  <span 
                    className="text-gray-500 text-lg hover:underline -mt-1 cursor-pointer" 
                    onClick={() => {
                      setIsLoggedIn(false);
                      navigate("/amarabad/login");
                    }}>Logout</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                  {/* User icon SVG */}
                  <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="16" fill="#E3E3E3"/>
                    <path d="M16 16c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.314 0-10 1.657-10 5v3h20v-3c0-3.343-6.686-5-10-5z" fill="#362D86"/>
                  </svg>
                </div>
              </div>
            ) : (
              <>
                <Link to="/amarabad/login" className="bg-[#E3E3E3] text-black px-6 py-2 rounded-md hover:bg-gray-300 transition duration-300">Login</Link>
                <Link to="/amarabad/register" className="bg-[#362D86] text-white px-6 py-2 rounded-md hover:bg-indigo-800 transition duration-300">Register</Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <img
              src={TelanganaRising}
              alt="Telangana Rising Logo"
              className={`transition-all duration-300 ${isScrolled ? 'w-[40px]' : 'w-[59px]'
                }`}
            />
          </div>
        </div>
      </nav>
    </>
  );
}

export default UserHeader; 