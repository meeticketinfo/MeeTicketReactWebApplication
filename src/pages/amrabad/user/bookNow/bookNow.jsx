import Breadcrumb from "./components/Breadcrumb";
import PropertyDetails from "./components/PropertyDetails";
import UserLayout from "../../../../layouts/UserLayout";
import { BookingForm } from "./components/BookingForm";

const BookNow = () => {
  return (
    <UserLayout>
      <div className="bg-gray-50">
        <div className="container mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <Breadcrumb />
          
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Property Details */}
              <PropertyDetails />
              
              {/* Right Column - Booking Form */}
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BookNow;