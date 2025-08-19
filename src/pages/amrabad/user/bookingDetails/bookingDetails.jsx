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

function toLocalISOString(date = new Date()) {
    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = (num) => String(Math.floor(Math.abs(num))).padStart(2, '0');
  
    return (
      date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      '.' + String(date.getMilliseconds()).padStart(3, '0') +
      dif + pad(tzo / 60) + ':' + pad(tzo % 60)
    );
  }

const AmarabadBookingDetails = () => {
    const { cartItems, loadingCart, fetchCartItems } = useCartStore();
    const { initiateTransaction, loadingInitiateTransaction, addNewBookingDetails, loadingAddNewBookingDetails } = usePaymentStore();
    const navigate = useNavigate();
    const userLocalStorage = JSON.parse(localStorage.getItem("amrabadlogin-store"));
    const userDetails = userLocalStorage?.state?.decodedTokenData;

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Helper function to map cart items to booking items format for initiateTransaction
    const mapCartItemsToBookingItems = (cartItems) => {
        if (!cartItems || cartItems.length === 0) return [];

        return cartItems?.data?.map(item => ({
            packageId: item.packageId || 0,
            roomId: item.roomId || 0,
            checkIn: item.roomFromDate,
            checkOut: item.roomToDate,
            roomCount: item.roomCount,
            tariffPerDay: item.amount || 0,
            discountType: item.discountType || "",
            discountValue: item.discountAmount || 0,
            amountAfterDiscount: item.cartTotalAmount || 0
        }));
    };

    // Helper function to map cart items for addNewBookingDetails (includes cartItemId)
    const mapCartItemsForBookingDetails = (cartItems) => {
        if (!cartItems || cartItems.length === 0) return [];

        return cartItems?.data?.map(item => ({
            packageId: item.packageId || 0,
            roomId: item.roomId || 0,
            cartItemId: item.cartId || 0,
            checkIn: item.roomFromDate,
            checkOut: item.roomToDate,
            roomCount: item.roomCount || 1,
            tariffPerDay: item.amount || 0,
            discountType: item.discountType || "",
            discountValue: item.discountAmount || 0,
            amountAfterDiscount: item.cartTotalAmount || 0
        }));
    };

    const handleSubmit = async (formValues, { setSubmitting }) => {
        try {
            // Step 1: Initiate Transaction
            const transactionData = {
                amount: cartItems?.grandTotal,
                customerId: userDetails?.UserId,
                isIOS: false,
                paymentType: "ONLINE",
                parkId: "101",
                departmentId: 38,
                bookingDate: toLocalISOString(),
                bookingType: "",
                mobileNumber: userDetails?.PhoneNumber,
                bookingRequestjson: {
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    emailId: formValues.email,
                    mobileNumber: formValues.mobile,
                    aadharNumber: formValues.aadhar,
                    country: formValues.country,
                    address: formValues.address,
                    town: formValues.town,
                    state: formValues.state,
                    pincode: formValues.pincode,
                    remarks: formValues.message || "",
                    amount: cartItems?.grandTotal,
                    userId: userDetails?.UserId,
                    parkId: "101",
                    paymentTransactionId: "",
                    orderId: "",
                    bookingItems: mapCartItemsToBookingItems(cartItems)
                }
            };
            const transactionResponse = await initiateTransaction(transactionData);

            if (transactionResponse.status === 200 || transactionResponse.data?.status === 200) {
                toast.success("Booking initiated successfully!");
                const orderId = transactionResponse.data?.orderId ||
                    transactionResponse.orderId;

                // Step 2: Add New Booking Details
                const bookingDetailsData = {
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    emailId: formValues.email,
                    mobileNumber: formValues.mobile,
                    aadharNumber: formValues.aadhar,
                    country: formValues.country,
                    address: formValues.address,
                    town: formValues.town,
                    state: formValues.state,
                    pincode: formValues.pincode,
                    remarks: formValues.message || "",
                    amount: cartItems?.grandTotal,
                    userId: userDetails?.UserId,
                    parkId: "101",
                    packageId: null,
                    roomId: null,
                    paymentTransactionId: orderId,
                    orderId: orderId,
                    bookingItems: mapCartItemsForBookingDetails(cartItems)
                };

                const bookingResponse = await addNewBookingDetails(bookingDetailsData);
                console.log(bookingResponse, "bookingResponse");

                if (bookingResponse.statusCode === 200) {
                    toast.success("Booking completed successfully!");
                    navigate(`/amrabad-resort/confirmed-details/${orderId}`);
                } else {
                    toast.error(bookingResponse.data?.message || bookingResponse.message || "Failed to complete booking");
                }
            } else {
                toast.error(transactionResponse.data?.message || transactionResponse.message || "Transaction failed");
            }
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
                        <div className="flex-1 w-full lg:max-w-[450px] flex flex-col gap-4 sm:gap-6">
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