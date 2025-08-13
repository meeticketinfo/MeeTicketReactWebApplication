import UserLayout from "../../../../layouts/UserLayout";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import BookingSummary from "./components/BookingSummary";
import PaymentSection from "./components/PaymentSection";

// Mock booking data (replace with real data as needed)
const bookingData = {
    houseName: "CHITAL AND OTTER",
    image: "https://amrabadtigerreserve.com/wp-content/uploads/2023/01/20230412_162323-1024x768.jpg",
    checkIn: "19 MAY 2025",
    checkOut: "21 MAY 2025",
    noOfHouses: 1,
    subTotal: 6175,
};

const AmarabadBookingDetails = () => {
    
    const navigate = useNavigate();
    
    const handleSubmit = (values, { setSubmitting }) => {
        // Payment logic here
        setSubmitting(false);
        navigate("/amarabad/confirmed-details/1234567890");
    };

    return (
        <UserLayout>
            <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3">
                <div className="">
                    <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Left: Billing/Guest Details Form */}
                        <BookingForm onSubmit={handleSubmit} />

                        {/* Right: Booking Summary & Payment */}
                        <div className="flex-1 w-full lg:max-w-[450px] flex flex-col gap-4 sm:gap-6">
                            <BookingSummary bookingData={bookingData} />
                            <Formik
                                initialValues={{}}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <PaymentSection 
                                        subTotal={bookingData.subTotal} 
                                        isSubmitting={isSubmitting} 
                                    />
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default AmarabadBookingDetails; 