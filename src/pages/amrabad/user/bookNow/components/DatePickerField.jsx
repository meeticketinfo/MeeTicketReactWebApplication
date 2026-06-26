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
  isCheckout = false,
  inline = false,
}) => {
  const getDayClassName = (date) => {
    if (isCheckout) {
      const isSelected = date.toDateString() === endDate.toDateString();
      const isAvailable = filterDate(date);
      const commonClass =
        "!text-[#304A3A] hover:!bg-[#EDEBE1] !rounded-md !transition-colors !w-[42px] !h-[52px]";

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
      const commonClass = "!text-[#304A3A] hover:!bg-[#EDEBE1] !rounded-md !transition-colors !w-[42px] !h-[52px]";

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
      <div className="relative flex justify-center">
        {isCalendarLoading ? (
          <div className="w-full px-3 py-2 text-sm border border-[#C8BFB2] rounded-lg bg-[#EDEBE1]">
            Loading calendar...
          </div>
        ) : (
          <DatePicker
            inline={inline}
            showIcon={!inline}
            dateFormat="dd-MM-yyyy"
            selected={selected}
            startDate={startDate}
            endDate={endDate}
            selectsRange={inline}
            onChange={(dates) => {
              if (inline) {
                onChange(dates);
              } else {
                onChange(dates);
              }
            }}
            wrapperClassName={inline ? "" : "w-full"}
            calendarClassName="!bg-[#FDFAF7] !border-[#C8BFB2] !rounded-lg !shadow-lg !mx-auto"
            popperClassName="!z-[9999]"
            monthClassName="!bg-[#FDFAF7]"
            weekDayClassName={() =>
              "!text-[#4A6360] !text-xs !font-medium !py-0.5 !text-center !w-[42px]"
            }
            dayClassName={getDayClassName}
            calendarIconClassName="!h-5 !w-5 text-[#304A3A]"
            className={
              inline
                ? ""
                : "w-full !pl-3 !pr-12 py-4 text-sm border border-[#C8BFB2] rounded-lg"
            }
            filterDate={filterDate}
            renderDayContents={renderDayContents}
            placeholderText={placeholderText}
            showDisabledMonthNavigation
            calendarStartDay={0}
            formatWeekDay={(name) => name.slice(0, 3).toUpperCase()}
            toggleCalendarOnIconClick={!inline}
          />
        )}
      </div>
    </div>
  );
};

export default DatePickerField; 