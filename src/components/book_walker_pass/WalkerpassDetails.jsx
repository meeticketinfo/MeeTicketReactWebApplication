import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import upiIcon from "../../images/upi.svg";
import HandCash from "../../images/cash.svg";
import { useWalkerpassStore } from "./WalkerpassStore.jsx";
import PopupModal from "../utils/popup_modal/PopupModal";


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

    const [openModalId, setOpenModalId] = useState(null);

    const isValidMobile =
        /^[6-9]\d{9}$/.test(mobileNumber);



    const openModal = (id) => setOpenModalId(id);
    const closeModal = () => setOpenModalId(null);
    const [isLoading, setIsLoading] = useState(false);

    const isProceedEnabled =
        paymentMethod === "upi" &&
        mobileNumber.length === 10;

    const handleProceed = async () => {
        try {
            setIsLoading(true);

            const payload = {
                amount: amount,
                customerId: customerId.toString(),
                isIOS: false,
                paymentType: "UPI",
                parkId: parkId,
                departmentId: 1,
                bookingDate: new Date().toISOString(),
                mobileNumber: mobileNumber,
                passUserId: customerId.toString(),
            };

            console.log("Payment Payload:", payload);

            const response = await initiatePayment(payload);

            console.log("Payment Response:", response);

            if (response?.status === 200) {

                localStorage.setItem("passUserDetailsId", customerId);

                closeModal();

                console.log("Passing to QR Page", {
                    redirectUrl: response.data.redirectUrl,
                    orderId: response.data.orderId,
                    amount: amount,
                });

                navigate("/upi-payment-qr", {
                    state: {
                        redirectUrl: response.data.redirectUrl,
                        orderId: response.data.orderId,
                        amount: amount,
                        passUserDetailsId: customerId,
                    },
                });

            } else {
                toast.error("Payment initiation failed");
            }
        } catch (error) {
            console.log("FULL ERROR DATA");
            console.log(JSON.stringify(error.response?.data, null, 2));
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Book Walker Pass
                    </h2>

                    <button className="bg-gray-300 text-white text-xs px-3 py-2 rounded">
                        PRINT PASS
                    </button>
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
                                <p className="font-medium">{data?.dateOfBirth}</p>
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
                                    Walkers Type
                                </p>
                                <p className="font-semibold">
                                    {data?.walkerPassType}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Residential Address
                                </p>
                                <p className="font-medium">
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
                            <h1>
                                Payment Method
                            </h1>

                            <div className="flex items-end gap-4 flex-wrap mt-3">

                                {/* UPI */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("upi")}
                                    className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold border transition-all ${paymentMethod === "upi"
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



                                {/* Mobile Number */}
                                <div>
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
                                        }}
                                        className="w-40 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                                        placeholder="Enter mobile number"
                                    />
                                </div>

                            </div>
                        </div>



                        {/* Proceed Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={() => openModal("cash")}
                                disabled={!isProceedEnabled}
                                className={`px-8 py-2 rounded-md text-sm font-medium text-white
    ${isProceedEnabled
                                        ? "bg-[#09094D] cursor-pointer"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`}
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
                                onClick={async () => {
                                    await handleProceed();
                                }}
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