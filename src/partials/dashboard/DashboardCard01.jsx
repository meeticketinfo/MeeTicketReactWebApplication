import CountUp from "react-countup";
import PropTypes from "prop-types";

function DashboardCard01({ lableName, count, icon: Icon }) {
  return (
    <>
      <div className="flex flex-col col-span-full sm:col-span-3 xl:col-span-3 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-100">
        <div className="flex items-center">
          <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white  bg-gray-400 rounded-lg shadow-md shadow-gray-300">
            <Icon className="text-3xl font-bold text-white dark:text-gray-100" />
          </div>
          <div className="flex-shrink-0 ml-3">
            <span className="text-2xl font-bold leading-none text-gray-600">
              <CountUp end={count} duration={2} prefix="" separator="," />
            </span>
            <h3 className="text-base font-normal text-gray-500">{lableName}</h3>
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
};
export default DashboardCard01;
