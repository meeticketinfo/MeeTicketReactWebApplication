import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import upiIcon from "../../images/upi.svg";
import { useWalkerpassStore } from "./WalkerpassStore.jsx";
import PopupModal from "../utils/popup_modal/PopupModal";
import { toast } from "react-toastify";
import {
    fileToCompressedDataUrl,
    storeWalkerPassImage,
} from "./walkerPassImageUtils";


const WalkerpassDetails = () => {

    const { passLocationData } = useWalkerpassStore();
    const { initiatePayment } = useWalkerpassStore();
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    console.log("Location State:", data);
    const selectedPass =
        passLocationData?.service
            ?.flatMap((service) => service.passes)
            ?.find(
                (pass) =>
                    pass.passLocationMasterId.toString() ===
                    data?.walkerPassType
            );

    const amount = selectedPass?.price || 0;
    const parkId = data?.parkId;
    const customerId = data?.passUserDetailsId;
    console.log("customerId:", customerId);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const [mobileError, setMobileError] = useState("");

    const [openModalId, setOpenModalId] = useState(null);

    const openModal = (id) => setOpenModalId(id);
    const closeModal = () => setOpenModalId(null);
    const [isLoading, setIsLoading] = useState(false);



    const handleProceed = () => {
        setPaymentError("");
        setMobileError("");

        if (!paymentMethod) {
            setPaymentError("Please select a payment method");
            return;
        }

        if (!mobileNumber) {
            setMobileError("Mobile Number is required");
            return;
        }

        if (!/^[6-9][0-9]{9}$/.test(mobileNumber)) {
            setMobileError(
                "Mobile Number must be 10 digits and start with 6, 7, 8, or 9"
            );
            return;
        }

        openModal("cash");
    };
    const processPayment = async () => {
        try {
            setIsLoading(true);

            const payload = {
                amount,
                customerId: customerId.toString(),
                isIOS: false,
                paymentType: "UPI",
                parkId,
                departmentId: 1,
                bookingDate: new Date().toISOString(),
                mobileNumber,
                passUserId: customerId.toString(),
            };

            const response = await initiatePayment(payload);

            console.log("PAYMENT RESPONSE:", response);

            closeModal();

            navigate("/upi-payment-qr", {
                state: {
                    redirectUrl:
                        response?.data?.redirectUrl ||
                        response?.data?.upiLink ||
                        response?.data?.qrString,

                    orderId:
                        response?.data?.orderId,

                    passUserDetailsId: customerId,

                    userImageBase64: data?.userImageBase64,
                },
            });

        } catch (error) {
            console.log("Payment Error:", error);

            toast.error("Unable to initiate payment");
        } finally {
            setIsLoading(false);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };


    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Book Walker Pass
                    </h2>

                </div>
                <div className="bg-white rounded-xl shadow-md border border-gray-200">



                    {/* Details Section */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">

                            <div>
                                <p className="text-gray-500 text-sm">Full Name</p>
                                <p className="font-medium">{data?.fullName}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Date of Birth</p>
                                <p className="font-medium">
                                    {formatDate(data?.dateOfBirth)}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Gender</p>
                                <p className="font-medium">{data?.gender}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Age</p>
                                <p className="font-medium">{data?.age}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Mobile Number</p>
                                <p className="font-medium">
                                    +91 {data?.mobileNumber}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">City</p>
                                <p className="font-medium">{data?.city}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">ID Proof</p>
                                <p className="font-medium">
                                    {data?.idProof?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Selfie</p>
                                <p className="font-medium">
                                    {data?.selfie?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Walkers Pass Type
                                </p>
                                <p className="font-semibold">
                                    {data?.walkerPassTypeName}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Residential Address
                                </p>
                                <p className="font-medium break-all">
                                    {data?.residentialAddress}
                                </p>
                            </div>
                        </div>

                        {/* Amount Section */}
                        <div className="mt-8">
                            <p className="text-sm text-gray-600">
                                Amount to Pay :
                                <span className="font-bold text-blue-700 ml-2">
                                    Rs.{amount}/-
                                </span>
                            </p>
                        </div>


                        {/* Payment Section */}
                        <div className="mt-4 bg-gray-100 p-6 rounded-md">
                            <h1>Payment Method</h1>

                            <div className="flex gap-4 mt-3 items-end">

                                {/* UPI Section */}
                                <div className="w-[180px]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPaymentMethod("upi");
                                            setPaymentError("");
                                        }}
                                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-semibold border transition-all ${paymentMethod === "upi"
                                            ? "bg-[#09094D] text-white"
                                            : "bg-white text-gray-700 border-gray-300"
                                            }`}
                                    >
                                        <img
                                            src={upiIcon}
                                            alt="UPI"
                                            className="w-4 h-4"
                                        />
                                        UPI Payment
                                    </button>

                                    {/* Fixed space for error */}
                                    <div className="h-10 mt-1">
                                        {paymentError && (
                                            <p className="text-red-500 text-xs">
                                                {paymentError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="mobileNumber"
                                        className="block text-xs text-gray-600 mb-1"
                                    >
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="mobileNumber"
                                        type="text"
                                        maxLength="10"
                                        value={mobileNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setMobileNumber(value);

                                            if (mobileError) {
                                                setMobileError("");
                                            }
                                        }}
                                        className="w-40 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                                        placeholder="Enter mobile number"
                                    />

                                    <div className="h-10 mt-1">
                                        {mobileError && (
                                            <p className="text-red-500 text-xs">
                                                {mobileError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Proceed Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={handleProceed}
                                className="px-8 py-2 rounded-md text-sm font-medium text-white bg-[#09094D]"
                            >
                                PROCEED
                            </button>
                        </div>
                    </div>
                </div>
                <PopupModal
                    popupModalId="first-modal"
                    isOpen={openModalId === "cash"}
                    onClose={closeModal}
                    size="small"
                    overlayClassName="bg-gray-800 bg-opacity-60"
                    contentClassName="bg-white min-w-[550px]"
                    defaultBodyPadding={true}
                >
                    <div className="px-10 py-14">
                        <h1 className="text-blue-v1 font-semibold text-center whitespace-nowrap">
                            Are you sure you want to proceed with payment?
                        </h1>

                        <div className="flex justify-center gap-6 mt-4">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={processPayment}
                                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md disabled:opacity-50"
                            >
                                {isLoading ? "Processing..." : "Proceed"}
                            </button>

                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={closeModal}
                                className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </PopupModal>
            </div>
        </AdminLayout>
    );
};

export default WalkerpassDetails;