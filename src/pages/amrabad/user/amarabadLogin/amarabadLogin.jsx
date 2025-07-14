import React from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { Link } from "react-router-dom";
import AmarabadLoginForm from "./AmarabadLoginForm";
import Lock from "../../../../images/user/lock.png";
import Logo from "../../../../images/user/logo.png";

const AmarabadLogin = () => {
  return (
    <UserLayout>
      <div className="container mx-auto">
        <div className="text-sm text-[#888888] text-right py-3">
          <span className="text-red-500">*</span> Indicates mandatory fields
        </div>
        <div className="relative bg-white rounded-xl border border-[#CCCCCC] p-8 w-full mb-8 ">
          <div className="flex flex-col items-center justify-center absolute top-1/2 left-[5%] -translate-y-1/2">
            <img src={Lock} alt="Lock" className="" />
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-[350px] mx-auto">
            <h1 className="text-3xl font-extrabold text-center mb-7 text-black">LOGIN</h1>
            <AmarabadLoginForm />
            <div className="flex items-center my-6 opacity-50">
              <div className="flex-grow border-t border-black relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-0 w-0 h-0 border-solid border-l-black border-l-8 border-y-transparent border-y-4 border-r-0"/>
              </div>
              <span className="mx-2 text-black">or</span>
              <div className="flex-grow border-t border-black relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-0 w-0 h-0 border-solid border-r-black border-r-8 border-y-transparent border-y-4 border-l-0"/>
              </div>
            </div>
            <div className="text-center text-base text-black">
              Not Registered yet?{" "}
              <Link to="/amarabad/register" className="text-[#EB723C] font-bold hover:underline">
                Create an Account
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <img src={Logo} alt="MeeTicket Logo" className="w-56" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AmarabadLogin;
