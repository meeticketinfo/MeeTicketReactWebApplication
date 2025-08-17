import DatePicker from "react-datepicker";

const DatePickerField = ({ 
  label, 
  selected, 
  onChange, 
  filterDate, 
  renderDayContents, 
  placeholderText, 
  isCalendarLoading,
  isDateAvailable,
  startDate,
  endDate,
  isCheckout = false
}) => {
  const getDayClassName = (date) => {
    if (isCheckout) {
      const isSelected = date.toDateString() === endDate.toDateString();
      const isAvailable = filterDate(date);
      const commonClass = "!text-gray-800 !hover:!bg-gray-100 !rounded-md !transition-colors !w-[50px] !h-[50px]";
      
      if (!isAvailable) {
        return "!text-gray-300 !cursor-not-allowed !bg-gray-50 " + commonClass;
      }
      
      if (isSelected) {
        return "!bg-[#362D86] !text-white !rounded-md" + commonClass;
      }
      
      return commonClass;
    } else {
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === startDate.toDateString();
      const isAvailable = isDateAvailable(date);
      const commonClass = "!text-gray-800 !hover:!bg-gray-100 !rounded-md !transition-colors !w-[50px] !h-[50px]";
      
      if (!isAvailable) {
        return "!text-gray-300 !cursor-not-allowed !bg-gray-50 " + commonClass;
      }
      
      if (isSelected) {
        return "!bg-[#362D86] !text-white !rounded-md" + commonClass;
      }
      
      if (isToday) {
        return "!text-[#362D86] !font-semibold !border-2 !border-[#362D86] !rounded-md " + commonClass;
      }
      
      return commonClass;
    }
  };

  return (
    <div className="mb-3 sm:mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {isCalendarLoading ? (
          <div className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-100">
            Loading calendar...
          </div>
        ) : (
          <DatePicker
            showIcon
            dateFormat="dd-MM-yyyy"
            selected={selected}
            onChange={onChange}
            wrapperClassName="w-full"
            calendarClassName="!bg-white !border-gray-200 !rounded-lg !shadow-lg"
            monthClassName="!bg-white"
            weekDayClassName={(date) => {
              return "!text-gray-500 !text-xs !font-medium !py-2 !text-center !w-[50px]";
            }}
            dayClassName={getDayClassName}
            calendarIconClassName="!h-5 !w-5 !cursor-pointer !right-0 !top-1/2 !transform !-translate-y-1/2 !pointer-events-auto text-[#362D86] fill-[#362D86]"
            className="w-full !pl-3 !pr-12 py-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#362D86] focus:border-transparent !text-[#362D86]"
            filterDate={filterDate}
            renderDayContents={renderDayContents}
            placeholderText={placeholderText}
            showDisabledMonthNavigation
            calendarStartDay={0}
            formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 3).toUpperCase()}
            toggleCalendarOnIconClick={true}
          />
        )}
      </div>
    </div>
  );
};

export default DatePickerField; 