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
      const commonClass = "!text-[#304A3A] hover:!bg-[#EDEBE1] !rounded-md !transition-colors !w-[50px] !h-[60px]";
      
      if (!isAvailable) {
        return "!text-[#D0D7CE] !cursor-not-allowed !bg-[#F2EDE7] " + commonClass;
      }
      
      if (isSelected) {
        return "!bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] !text-[#FDFAF7] !rounded-md " + commonClass;
      }
      
      return commonClass;
    } else {
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === startDate.toDateString();
      const isAvailable = isDateAvailable(date);
      const commonClass = "!text-[#304A3A] hover:!bg-[#EDEBE1] !rounded-md !transition-colors !w-[50px] !h-[60px]";
      
      if (!isAvailable) {
        return "!text-[#D0D7CE] !cursor-not-allowed !bg-[#F2EDE7] " + commonClass;
      }
      
      if (isSelected) {
        return "!bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] !text-[#FDFAF7] !rounded-md " + commonClass;
      }
      
      if (isToday) {
        return "!text-[#304A3A] !font-semibold !border-2 !border-[#304A3A] !rounded-md " + commonClass;
      }
      
      return commonClass;
    }
  };

  return (
    <div className="mb-3 sm:mb-4">
      <label className="block text-sm font-medium text-[#304A3A] mb-2">
        {label}
      </label>
      <div className="relative">
        {isCalendarLoading ? (
          <div className="w-full px-3 py-2 text-sm sm:text-base border border-[#C8BFB2] rounded-lg bg-[#EDEBE1] text-[#394D48]">
            Loading calendar...
          </div>
        ) : (
          <DatePicker
            showIcon
            dateFormat="dd-MM-yyyy"
            selected={selected}
            onChange={onChange}
            wrapperClassName="w-full"
            calendarClassName="!bg-[#FDFAF7] !border-[#C8BFB2] !rounded-lg !shadow-lg"
            monthClassName="!bg-[#FDFAF7]"
            weekDayClassName={(date) => {
              return "!text-[#4A6360] !text-xs !font-medium !py-2 !text-center !w-[50px] !h-auto";
            }}
            dayClassName={getDayClassName}
            calendarIconClassName="!h-5 !w-5 !cursor-pointer !right-0 !top-1/2 !transform !-translate-y-1/2 !pointer-events-auto text-[#304A3A] fill-[#304A3A]"
            className="w-full !pl-3 !pr-12 py-4 text-sm sm:text-base border border-[#C8BFB2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#304A3A] focus:border-transparent !text-[#304A3A]"
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