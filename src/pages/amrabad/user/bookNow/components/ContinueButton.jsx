import { Link } from "react-router-dom";

const ContinueButton = ({ finalAmount }) => {
  return (
    <Link 
      to={`/amrabad/checkout-details/1`} 
      className="w-full bg-[#362D86] text-white py-3 rounded-lg font-semibold hover:bg-[#362D86]/90 transition-colors flex items-center justify-between px-4 sm:px-6"
    >
      <span className="text-lg sm:text-xl font-bold">₹{finalAmount.toLocaleString()}</span>
      <span className="text-sm sm:text-base">Continue</span>
    </Link>
  );
};

export default ContinueButton; 