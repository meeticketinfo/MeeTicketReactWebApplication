import { Link } from "react-router-dom";

const ContinueButton = ({ finalAmount }) => {
  return (
    <Link 
      to={`/amrabad-resort/checkout-details/1`} 
      className="w-full bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] text-[#FDFAF7] py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-between px-4 sm:px-6"
    >
      <span className="text-lg sm:text-xl font-bold">₹{finalAmount.toLocaleString()}</span>
      <span className="text-sm sm:text-base">Continue</span>
    </Link>
  );
};

export default ContinueButton; 