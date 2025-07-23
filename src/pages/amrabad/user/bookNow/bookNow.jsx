import Breadcrumb from "./components/Breadcrumb";
import PropertyDetails from "./components/PropertyDetails";
import BookingForm from "./components/BookingForm";
import UserLayout from "../../../../layouts/UserLayout";

const BookNow = () => {
  return (
    <UserLayout>
      <div className="bg-gray-50">
        <div className="container mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <Breadcrumb />
          
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex gap-8">
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