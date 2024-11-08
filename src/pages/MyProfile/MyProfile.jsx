import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useMyProfileStore } from "../../store/MyProfile/MyProfileStore";


function MyProfile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
const [profileData , setProfileData] = useState(null);
const { fetchMyProfileDetails } = useMyProfileStore();

useEffect(() => {
    fetchMyProfileDetails();
  }, []);
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                    { /*Profile Information*/}
                    {profileData ? (
                    <div className="flex items-center">
                        { /*Profile Image */}
                        <div className="relative">
                            {/* <img className="w-16 h-16 rounded-full" src="https://via.placeholder.com/64" alt="Profile Image"> */}
                            <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                        </div>

                        { /*Name and Contact Info */}
                        <div>
                            <h2 className="text-2xl font-semibold">  {profileData.firstName} {profileData.middleName} {profileData.lastName}</h2>
                            <p className="text-gray-600">
                                Mobile number:{" "}
                                <a href="tel:+1234567890" className="text-blue-500">
                                    {profileData.phoneNumber}
                                </a>
                            </p>
                            <p className="text-gray-600">
                                Email:{" "}
                                <a href="mailto:johndoe@testbg.com" className="text-blue-500">
                                    {profileData.email}
                                </a>
                            </p>
                            <p className="text-gray-600">
                                Role: {profileData.roleName}
                            </p>
                            <p className="text-gray-600">
                                Status: {profileData.status ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>
                      ):(
                        <p>Loading profile data....</p>
                    )} 
                </div>

            </div>
        </div>
    );
}
export default MyProfile;