import React, { useEffect } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import PackagesImage1 from "../../../../images/user/package-1.png";
import PackagesImage2 from "../../../../images/user/package-2.png";
import { Link } from "react-router-dom";
import { useUserBookingStore } from "../../../../store/amrabad/user/userBookingStore";
const Packages = () => {
  const { fetchUserPackages, isUserPackagesLoading,GetUserPackages } = useUserBookingStore();
  

  useEffect(() => { 
    fetchUserPackages();
  }, []);
  console.log(GetUserPackages.filter(item=>item.isActive));

  
  return (
    <UserLayout>
      <div className="grid grid-cols-12 text-center gap-1">
        {GetUserPackages.filter(item=>item.isActive).map((item, index) => (
          <div className="col-span-6" key={index}>
            <div className="flex flex-col content-center items-center justify-center h-[70vh] min-h-full relative p-10">
              <img src={item.packageImages[0].imageUrl} alt="Packages" className="w-full h-full object-cover absolute top-0 left-0" />
              <div className="absolute top-0 left-0 w-full h-full bg-[#0A0818B2]"></div>
              <div className="relative z-10 max-w-[350px] flex flex-col gap-6 justify-center items-center">
                <h4 className="text-white text-3xl font-bold capitalize">{item.packageName}</h4>
                <Link to={`/amarabad/packages/${item.packageName}`} className="bg-white text-[#362D86] px-6 py-2 rounded-md hover:bg-indigo-800 hover:text-white transition duration-300 text-xl font-bold">BOOK NOW</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </UserLayout>
  );
};

export default Packages;
