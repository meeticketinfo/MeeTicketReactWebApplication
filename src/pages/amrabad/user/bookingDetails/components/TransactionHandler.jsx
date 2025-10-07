import { toast } from "react-toastify";
import { toLocalISOString, mapCartItemsToBookingItems, mapCartItemsForBookingDetails } from "./PaymentUtils";

export const useTransactionHandler = (usePaymentStore, useCartStore, userDetails) => {
    const { initiateTransaction, addNewBookingDetails, orderStatusCall } = usePaymentStore;
    const { cartItems } = useCartStore;

    const createTransactionData = (formValues) => ({
        amount: cartItems?.grandTotal,
        customerId: userDetails?.UserId,
        isIOS: false,
        paymentType: "UPI",
        parkId: "101",
        departmentId: 38,
        bookingDate: toLocalISOString(),
        bookingType: "Website",
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
    });

    const createBookingDetailsData = (formValues, orderId) => ({
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
    });

    const handleTransaction = async (formValues) => {
        try {
            // Step 1: Initiate Transaction
            const transactionData = createTransactionData(formValues);
            const transactionResponse = await initiateTransaction(transactionData);

            return transactionResponse;
        } catch (error) {
            console.error("Transaction error:", error);
            throw error;
        }
    };

    const handlePaymentSuccess = async (formValues, orderId) => {
        try {
            // Step 1: Call orderStatusCall first
            // console.log("Calling orderStatusCall for orderId:", orderId);
            const orderStatusResponse = await orderStatusCall(orderId);
            // console.log("orderStatusCall response:", orderStatusResponse);

            if (orderStatusResponse.statusCode === 200 || orderStatusResponse.status === 200) {
                // Step 2: If orderStatusCall is successful, call addNewBookingDetails
                // console.log("Order status confirmed, calling addNewBookingDetails");
                const bookingDetailsData = createBookingDetailsData(formValues, orderId);
                const bookingResponse = await addNewBookingDetails(bookingDetailsData);
                // console.log("addNewBookingDetails response:", bookingResponse);

                return bookingResponse;
            } else {
                throw new Error("Order status verification failed");
            }
        } catch (error) {
            console.error("Payment success flow error:", error);
            throw error;
        }
    };

    const handleBookingDetails = async (formValues, orderId) => {
        try {
            // Step 2: Add New Booking Details
            const bookingDetailsData = createBookingDetailsData(formValues, orderId);
            const bookingResponse = await addNewBookingDetails(bookingDetailsData);

            return bookingResponse;
        } catch (error) {
            console.error("Booking details error:", error);
            throw error;
        }
    };

    return {
        handleTransaction,
        handlePaymentSuccess,
        handleBookingDetails
    };
};
