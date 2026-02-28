import { FaCreditCard } from "react-icons/fa";

const PaymentSection = ({ subTotal, isSubmitting }) => {
    return (
        <>
            <div className="bg-white rounded-lg p-2 sm:p-4 sm:pb-2 sm:pt-0 border border-[#C0C0C5] shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <img 
                        src="https://1000logos.net/wp-content/uploads/2023/03/Paytm-logo.png" 
                        alt="Paytm" 
                        className="w-20 sm:w-28 h-auto object-contain" 
                    />
                    <span className="font-medium text-[#304A3A] text-sm sm:text-base">
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
                className="w-full flex items-center justify-center gap-2 bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] hover:opacity-90 font-semibold py-3 rounded-md transition-colors duration-200 disabled:opacity-60 text-sm sm:text-base"
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