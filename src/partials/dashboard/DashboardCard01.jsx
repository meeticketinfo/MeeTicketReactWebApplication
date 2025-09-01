import CountUp from "react-countup";
import PropTypes from "prop-types";
import { IoReloadCircle } from "react-icons/io5";

function DashboardCard01({
  lableName,
  count,
  icon: Icon,
  isLoading,
  setIsHovered,
  isPopup,
}) {
  return (
    <>
      <div
        className="flex flex-col justify-center col-span-full sm:col-span-3 xl:col-span-3 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
        onMouseEnter={() => {
          isPopup === true && setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-gray-400 rounded-lg shadow-md shadow-gray-300">
            <Icon className="text-3xl font-bold text-white dark:text-gray-100" />
          </div>
          <div className="flex-shrink-0 ml-3 min-w-0 flex-1">
            {isLoading ? (
              <div className="space-y-2">
                {/* Skeleton for count */}
                <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
                {/* Skeleton for label */}
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <span className="text-lg md:text-xl lg:text-2xl font-bold leading-none text-gray-600 break-words">
                  <CountUp end={count} duration={2} prefix="" separator="," />
                </span>
                <h3 className="text-sm md:text-base font-normal text-gray-500 break-words">
                  {lableName}
                </h3>
              </>
            )}
          </div>
          {/* <div className="flex flex-1 justify-end items-center ml-5 w-0 text-base font-bold text-green-500">
            +16%
          </div> */}
        </div>
      </div>
    </>
  );
}
DashboardCard01.propTypes = {
  lableName: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percentageChange: PropTypes.number,
  icon: PropTypes.elementType.isRequired,
  isLoading: PropTypes.bool,
};
export default DashboardCard01;
