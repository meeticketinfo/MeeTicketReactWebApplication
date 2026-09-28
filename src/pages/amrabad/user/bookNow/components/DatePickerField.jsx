import { useState } from "react";
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
  selectsStart = false,
  selectsEnd = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDayClassName = (date) => {
    const isStartSelected = startDate && date.toDateString() === startDate.toDateString();
    const isEndSelected = endDate && date.toDateString() === endDate.toDateString();
    const isAvailable = isCheckout ? filterDate(date) : isDateAvailable(date);
    const commonClass =
      "!text-[#304A3A] hover:!bg-[#EDEBE1] !rounded-md !transition-colors !w-[42px] !h-[52px]";

    if (isStartSelected) {
      return "!bg-[linear-gradient(135deg,#3D4A3A,#394D4B,#7A8F7C)] !text-[#FDFAF7] !rounded-md " + commonClass;
    }

    if (isEndSelected) {
      return "!bg-[#216ba5] !text-white !rounded-md " + commonClass;
    }

    if (!isAvailable) {
      return "!text-[#D0D7CE] !cursor-not-allowed !bg-[#F2EDE7] " + commonClass;
    }

    if (!isCheckout) {
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      if (isToday) {
        return "!text-[#304A3A] !font-semibold !border-2 !border-[#304A3A] !rounded-md " + commonClass;
      }
    }

    return commonClass;
  };

  const handleChange = (date) => {
    onChange(date);
    if (!inline) {
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-3 sm:mb-4">
      {label ? (
        <label className="block text-sm font-medium text-[#304A3A] mb-2">
          {label}
        </label>
      ) : null}
      <div className="relative w-full">
        {isCalendarLoading ? (
          <div className="w-full px-3 py-2 text-sm border border-[#C8BFB2] rounded-lg bg-[#EDEBE1]">
            Loading calendar...
          </div>
        ) : (
          <DatePicker
            inline={inline}
            open={inline ? undefined : isOpen}
            onInputClick={() => {
              if (!inline) setIsOpen(true);
            }}
            onClickOutside={() => {
              if (!inline) setIsOpen(false);
            }}
            onCalendarClose={() => {
              if (!inline) setIsOpen(false);
            }}
            showIcon={false}
            dateFormat="dd-MM-yyyy"
            selected={selected}
            startDate={startDate}
            endDate={endDate}
            selectsRange={inline}
            selectsStart={selectsStart}
            selectsEnd={selectsEnd}
            onChange={handleChange}
            onChangeRaw={(e) => e.preventDefault()}
            shouldCloseOnSelect={!inline}
            wrapperClassName="w-full"
            calendarClassName="!bg-[#FDFAF7] !border-[#C8BFB2] !rounded-lg !shadow-lg"
            popperClassName="!z-[9999]"
            popperPlacement="bottom-start"
            monthClassName="!bg-[#FDFAF7]"
            weekDayClassName={() =>
              "!text-[#4A6360] !text-xs !font-medium !py-0.5 !text-center !w-[42px]"
            }
            dayClassName={getDayClassName}
            className={
              inline
                ? ""
                : "w-full px-3 py-4 border border-[#C8BFB2] rounded-lg bg-[#FDFAF7] text-[#304A3A] cursor-pointer"
            }
            filterDate={filterDate}
            renderDayContents={renderDayContents}
            placeholderText={placeholderText}
            showDisabledMonthNavigation
            calendarStartDay={0}
            formatWeekDay={(name) => name.slice(0, 3).toUpperCase()}
          />
        )}
      </div>
    </div>
  );
};

export default DatePickerField;