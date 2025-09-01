import { FaSearch, FaFilter } from "react-icons/fa";

const SearchAndFilter = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder=" Booking ID, package,house...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-72"
        />
      </div>
      {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
        <FaFilter />
        Filters
      </button> */}
    </div>
  );
};

export default SearchAndFilter;