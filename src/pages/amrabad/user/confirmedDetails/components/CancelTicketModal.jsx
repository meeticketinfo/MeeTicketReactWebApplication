import { FaTicketAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const CancelTicketModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-[600px] w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Header with Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="62" height="62" rx="31" fill="#407BFF" />
              <g clip-path="url(#clip0_9735_10473)">
                <path d="M48.464 27.5224C49.5454 27.3788 50.375 26.4056 50.375 25.287V22.5296C50.375 20.7994 48.9506 19.375 47.2204 19.375H26.9449V22.5296C26.9449 23.2679 26.3315 23.8813 25.5932 23.8813C24.8548 23.8813 24.2415 23.2679 24.2415 22.5296V19.375L14.7796 19.3767C13.0494 19.3767 11.625 20.8011 11.625 22.5312V25.2887C11.625 26.4242 12.436 27.3788 13.536 27.5241C15.5365 27.7945 17.0318 29.5246 17.0318 31.5438C17.0318 33.5629 15.5179 35.2931 13.536 35.5634C12.4546 35.707 11.625 36.6802 11.625 37.7988V40.5563C11.625 42.2864 13.0494 43.7108 14.7796 43.7108H24.2415V40.5563C24.2415 39.8179 24.8548 39.2046 25.5932 39.2046C26.3315 39.2046 26.9449 39.8179 26.9449 40.5563V43.7108H47.2204C48.9506 43.7108 50.375 42.2864 50.375 40.5563V37.7988C50.375 36.6634 49.564 35.7087 48.464 35.5634C46.4635 35.2931 44.9682 33.5629 44.9682 31.5438C44.9682 29.5246 46.4821 27.7945 48.464 27.5241V27.5224ZM26.9449 35.7408C26.9449 36.4791 26.3315 37.0925 25.5932 37.0925C24.8548 37.0925 24.2415 36.4791 24.2415 35.7408V33.9379C24.2415 33.1996 24.8548 32.5862 25.5932 32.5862C26.3315 32.5862 26.9449 33.1996 26.9449 33.9379V35.7408ZM26.9449 29.1445C26.9449 29.8828 26.3315 30.4962 25.5932 30.4962C24.8548 30.4962 24.2415 29.8828 24.2415 29.1445V27.3416C24.2415 26.6033 24.8548 25.9899 25.5932 25.9899C26.3315 25.9899 26.9449 26.6033 26.9449 27.3416V29.1445Z" fill="black" />
                <path d="M38.75 27.125C32.3298 27.125 27.125 32.3298 27.125 38.75C27.125 45.1702 32.3298 50.375 38.75 50.375C45.1702 50.375 50.375 45.1702 50.375 38.75C50.375 32.3298 45.1702 27.125 38.75 27.125ZM38.75 30.1843C40.5319 30.1843 42.1858 30.7294 43.5569 31.66L31.6607 43.5563C30.7294 42.1858 30.185 40.5312 30.185 38.7494C30.1843 34.0193 34.0193 30.1843 38.75 30.1843ZM38.75 47.3157C36.9681 47.3157 35.3142 46.7706 33.9431 45.84L45.8393 33.9437C46.7706 35.3142 47.315 36.9688 47.315 38.7506C47.3157 43.4807 43.4807 47.3157 38.75 47.3157Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_9735_10473">
                  <rect width="41.3333" height="41.3333" fill="white" transform="translate(10.333 10.334)" />
                </clipPath>
              </defs>
            </svg>

          </div>
          <h2 className="text-xl font-bold text-[#E51409]">Cancel Ticket</h2>
        </div>

        {/* Cancellation Policy */}
        <div className="mb-6">
          <div className="text-sm text-[#263238] space-y-1 text-center">
            <p>Cancellation before 48 hours before check in time.</p>
            <p> 50% amount will be deducted.</p>
          </div>
        </div>

        {/* Confirmation Question */}
        <div className="mb-6">
          <p className="text-xl font-bold text-black text-center">
            Are you sure want to cancel this ticket?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 max-w-[300px] mx-auto">
          <button
            onClick={onClose}
            className="flex-1 bg-[#A4A4A4] hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#FE3838] hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelTicketModal;