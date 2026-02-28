import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const CancellationSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] max-w-[600px] w-full p-10 text-center relative">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <svg width="63" height="62" viewBox="0 0 63 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" width="62" height="62" rx="31" fill="#3CC31E" />
            <path d="M47.5801 19.4707L24.7176 42.3332L15.4176 33.0332L12.7051 35.8426L24.7176 47.7582L50.2926 22.1832L47.5801 19.4707Z" fill="white" />
          </svg>

        </div>

        {/* Success Message */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Your ticket cancellation was successful
        </h2>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Ticket cancellation was successful! Your cancellation request has been processed.
          If you have further questions or need additional assistance, feel free to contact our support team.
          Thank you for using our service.
        </p>

        {/* Action Button */}
        <Link
          onClick={() => onClose()}
          to="/amrabad-resort"
          className="w-full bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] hover:opacity-90 text-[#FDFAF7] py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Proceed to Homepage
        </Link>
      </div>
    </div>
  );
};

export default CancellationSuccessModal;