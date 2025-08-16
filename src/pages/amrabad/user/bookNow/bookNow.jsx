import Breadcrumb from "./components/Breadcrumb";
import PropertyDetails from "./components/PropertyDetails";
import UserLayout from "../../../../layouts/UserLayout";
import { useUserBookingStore } from "../../../../store/amrabad/user/userBookingStore";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookingForm } from "./components/BookingForm";

const BookNow = () => {
  const { GetRoomsByPackageId, fetchRoomsByPackageId, isRoomsByPackageIdLoading, fetchUserPackages, GetUserPackages, isUserPackagesLoading } = useUserBookingStore();
  const [house, setHouse] = useState(null);
  const [userPackage, setUserPackage] = useState(null);
  const { packageId, houseId } = useParams();
  const { fromDate, toDate } = useLocation().state;
  useEffect(() => {
    fetchUserPackages();
  }, []);

  useEffect(() => {
    fetchRoomsByPackageId(packageId);
  }, [packageId]);

  useEffect(() => {
    if (GetRoomsByPackageId) {
      setHouse(GetRoomsByPackageId?.find(room => room.roomId == houseId));
    }
  }, [GetRoomsByPackageId, houseId]);

  useEffect(() => {
    if (GetUserPackages) {
      setUserPackage(GetUserPackages?.find(packageDetail => packageDetail.packageId == packageId));
    }
  }, [GetUserPackages, packageId]);

  return (
    <UserLayout>
      <div className="bg-gray-50">
        <div className="container mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <Breadcrumb house={house} />
          
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Property Details */}
              <PropertyDetails house={house} userPackage={userPackage} isUserPackagesLoading={isUserPackagesLoading} />
              
              {/* Right Column - Booking Form */}
              <BookingForm packageId={packageId} houseId={houseId} house={house} userPackage={userPackage} isUserPackagesLoading={isUserPackagesLoading} fromDate={fromDate} toDate={toDate} />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BookNow;