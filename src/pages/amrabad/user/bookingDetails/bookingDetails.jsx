import UserLayout from "../../../../layouts/UserLayout";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import BookingSummary from "./components/BookingSummary";
import PaymentSection from "./components/PaymentSection";
import { useCartStore } from "../../../../store/amrabad/user/userCartStore";
import { useEffect } from "react";
import { usePaymentStore } from "../../../../store/amrabad/user/userPaymentStore";
import { toast } from "react-toastify";
import { usePaytmPaymentHandler } from "./components/PaytmPaymentHandler";
import { useTransactionHandler } from "./components/TransactionHandler";

const AmarabadBookingDetails = () => {
    const { cartItems, loadingCart, fetchCartItems } = useCartStore();
    const { initiateTransaction, loadingInitiateTransaction, addNewBookingDetails, loadingAddNewBookingDetails } = usePaymentStore();
    const navigate = useNavigate();
    const userLocalStorage = JSON.parse(localStorage.getItem("amrabadlogin-store"));
    const userDetails = userLocalStorage?.state?.decodedTokenData;

    // Initialize handlers using custom hooks
    const { loadPaytmScript, makePayment } = usePaytmPaymentHandler();
    const { handleTransaction, handlePaymentSuccess } = useTransactionHandler(
        { initiateTransaction, addNewBookingDetails, orderStatusCall: usePaymentStore.getState().orderStatusCall },
        { cartItems },
        userDetails
    );

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleSubmit = async (formValues, { setSubmitting }) => {
        try {
            // Step 1: Initiate Transaction
            const transactionResponse = await handleTransaction(formValues);
            
            // Load Paytm script and initiate payment
            loadPaytmScript(transactionResponse?.data, (paymentData) => {
                makePayment(paymentData, cartItems?.grandTotal, async (paymentStatus, orderId) => {
                    try {
                        // Handle payment success flow
                        const bookingResponse = await handlePaymentSuccess(formValues, orderId);
                        
                        if (bookingResponse.statusCode === 200) {
                            toast.success("Booking completed successfully!");
                            navigate(`/amrabad-resort/confirmed-details/${orderId}`);
                        } else {
                            toast.error(bookingResponse.data?.message || bookingResponse.message || "Failed to complete booking");
                        }
                    } catch (error) {
                        console.error("Payment success flow error:", error);
                        toast.error(error.message || "Failed to complete booking after payment");
                    }
                });
            });

        } catch (error) {
            console.error("Booking error:", error);
            toast.error(error.message || "Failed to process booking");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <UserLayout>
            <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3">
                <div className="">
                    <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Left: Billing/Guest Details Form */}
                        <BookingForm onSubmit={handleSubmit} />

                        {/* Right: Booking Summary & Payment */}
                        <div className="flex-1 w-full lg:max-w-[450px]  flex flex-col gap-3">
                            <BookingSummary
                                bookingData={cartItems}
                                loadingCart={loadingCart}
                            />
                            <Formik
                                initialValues={{}}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <PaymentSection
                                        subTotal={cartItems?.grandTotal}
                                        isSubmitting={isSubmitting || loadingInitiateTransaction || loadingAddNewBookingDetails}
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