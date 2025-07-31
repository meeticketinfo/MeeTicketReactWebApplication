import { FaDownload } from "react-icons/fa";
import { MdBlock } from "react-icons/md";

const QRDownloadSection = ({ onCancelTicket }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 min-w-[200px] sm:min-w-[220px]">
      <div className="p-4 sm:p-6 flex flex-col items-center">
        <img 
          src="https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg" 
          alt="QR Code" 
          className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] object-cover" 
        />
        <div className="text-xs text-gray-500 mb-2 sm:mb-3">Scan to view booking</div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <button className="bg-[#362D86] hover:bg-indigo-800 text-white px-3 sm:px-4 py-2 rounded flex items-center justify-center gap-2 text-xs sm:text-sm">
            <FaDownload />
            Download Ticket
          </button>
          <button 
            onClick={onCancelTicket}
            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <MdBlock />
            Cancel Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRDownloadSection;