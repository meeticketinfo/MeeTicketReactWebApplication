import { Link } from "react-router-dom";

const Breadcrumb = ({ house }) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2 text-sm text-gray-600 mb-6 flex-wrap">
      <Link
        className="text-[#362D86] hover:text-[#362D86]/80 font-semibold capitalize"
        to="/amarabad/packages"
      >
        Amrabad Resorts
      </Link>
      <span className="text-gray-400"> &gt; </span>
      <Link
        className="text-[#362D86] hover:text-[#362D86]/80 font-semibold capitalize"
        to={`/amarabad/packages/${house?.packageId}`}
      >
        {house?.packageName}
      </Link>
      <span className="text-gray-400"> &gt; </span>
      <Link
        className="text-[#362D86] hover:text-[#362D86]/80 font-semibold capitalize"
        to={`/amarabad/houses/${house?.packageId}`}
      >
        List of houses
      </Link>
      <span className="text-gray-400"> &gt; </span>
      <span className="text-gray-800 font-semibold capitalize">{house?.roomName}</span>
    </div>
  );
};

export default Breadcrumb; 