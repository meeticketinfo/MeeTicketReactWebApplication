import { FaCreditCard } from "react-icons/fa";

const PaymentSection = ({ subTotal, isSubmitting }) => {
    return (
        <>
            <div className="bg-white rounded-lg p-2 sm:p-4 sm:pb-2 sm:pt-0 border border-[#C0C0C5]">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <img 
                        src="https://1000logos.net/wp-content/uploads/2023/03/Paytm-logo.png" 
                        alt="Paytm" 
                        className="w-20 sm:w-28 h-auto object-contain" 
                    />
                    <span className="font-medium text-[#362D86] text-sm sm:text-base">
                        Payment Gateway
                    </span>
                </div>
                <p className="text-xs text-gray-600">
                    The best payment gateway provider in India for e-payment through{" "}
                    <span className="font-semibold text-gray-800">
                        Paytm Postpaid, Paytm Wallet, UPI, Credit Card, Debit Card and Netbanking
                    </span>
                </p>
            </div>
            
            <button
                type="submit"
                form="booking-form"
                className="w-full flex items-center justify-center gap-2 bg-[#C4A97A] text-white hover:bg-[#e7cb9a] hover:text-white  font-semibold py-3 rounded-md transition-colors duration-200 disabled:opacity-60 text-sm sm:text-base"
                disabled={isSubmitting || subTotal <= 0}
            >
                {subTotal > 0 ? (
                    <>
                        <FaCreditCard className="text-base sm:text-lg" />
                        PAY&nbsp; ₹{subTotal ? subTotal.toLocaleString() : 0}
                    </>
                ) : (
                    "No booking items found"
                )}
            </button>
        </>
    );
};

export default PaymentSection; 