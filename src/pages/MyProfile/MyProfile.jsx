import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useMyProfileStore } from "../../store/MyProfile/MyProfileStore";
import useAuthStore from "../../store/authStore";



function MyProfile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
const {  ProfileDetails ,fetchMyProfileDetails } = useMyProfileStore();
const {decodedTokenData} = useAuthStore();
const userId = decodedTokenData?.data?.UserId;
useEffect(() => {
    fetchMyProfileDetails(userId);
  }, []);


  console.log(ProfileDetails , 'details')
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="max-w-full mx-3xl bg-gray shadow-lg rounded-lg p-6">
                    { /*Profile Information*/}
                    {ProfileDetails ? (
                    <div className="flex space-x-9">
                        { /*Profile Image */}
                        <div className="relative">
                        <img   className="w-24 h-24 rounded-full" src="\src\images\chief_minister.png" alt="Profile Image" /> 
                            <div className="absolute bottom-0  right-0 w-4 h-4 rounded-full border-2 border-white"></div>
                        </div>

                        { /*Name and Contact Info */}
                        <div className="flex flex-col space-y-4">
                           
                            <h2 className="text-2xl font-semibold mt-3">  {ProfileDetails.firstName} {ProfileDetails.middleName} {ProfileDetails.lastName}</h2>
                            <div className="flex justify-between items-center text-center pt-4">
                            <p className="text-gray-700 mt-6">
                                Mobile number:{" "}
                                <a href="tel:+1234567890" className="text-blue-500">
                                    {ProfileDetails.phoneNumber}
                                </a>
                            </p>
                            <p className=" text-gray-700 mx-9 mt-6">
                                Email:{" "}
                                <a href="mailto:johndoe@testbg.com" className="text-blue-500">
                                    {ProfileDetails.email}
                                </a>
                            </p>
                            <p className="text-gray-600 mt-6">
                                Status: {ProfileDetails.status ? "Active" : "Inactive"}
                            </p>
                            </div>

                        <div className="text-sm font-medium text-gray-600 space-y-4">
                                <p className="text-sm font-medium text-gray-600">Profile Completion: 75%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                                </div>
                            </div>



                            {/* Trip Stats */}
                            {/* <div className="flex justify-between items-center text-center border-t pt-4">
                                <div>
                                    <p className="text-2xl font-semibold text-gray-800">50</p>
                                    <p className="text-sm text-gray-500">Completed Trips</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-gray-800">08</p>
                                    <p className="text-sm text-gray-500">Upcoming Trips</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-gray-800">10</p>
                                    <p className="text-sm text-gray-500">Cancelled Trips</p>
                                </div>
                            </div>  */}``
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
export default MyProfile