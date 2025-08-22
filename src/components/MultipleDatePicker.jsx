import React, { useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';

const MultipleDatePicker = ({ 
  value = [],
  onChange, 
  placeholder = "Select dates...",
  className = "",
  disabled = false,
  minDate = "today" // Default to today to prevent past dates
}) => {
  const [selectedDates, setSelectedDates] = useState(value);
  const flatpickrRef = useRef(null);

  // Helper function to format date without timezone conversion
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const options = {
    mode: "multiple",
    static: true,
    monthSelectorType: "static",
    dateFormat: "Y-m-d",
    defaultDate: value,
    allowInput: false,
    clickOpens: true,
    minDate: minDate, // Add minDate restriction
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady: (selectedDates, dateStr, instance) => {
      const customClass = "flatpickr-multiple";
      instance.calendarContainer.classList.add(customClass);
    },
    onChange: (selectedDates, dateStr, instance) => {
      // Use timezone-safe date formatting
      const formattedDates = selectedDates.map(date => 
        formatDateToYYYYMMDD(date)
      );
      setSelectedDates(formattedDates);
      if (onChange) {
        onChange(formattedDates);
      }
    },
  };

  const handleRemoveDate = (dateToRemove) => {
    const updatedDates = selectedDates.filter(date => date !== dateToRemove);
    setSelectedDates(updatedDates);
    if (onChange) {
      onChange(updatedDates);
    }
    // Update the flatpickr instance
    if (flatpickrRef.current) {
      flatpickrRef.current.flatpickr.setDate(updatedDates, false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Flatpickr 
            ref={flatpickrRef}
            className={`form-input pl-9 pr-8 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium w-full ${className}`} 
            options={options}
            placeholder={placeholder}
            disabled={disabled}
          />
          <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
            <svg className="fill-current text-gray-400 dark:text-gray-500 ml-3" width="16" height="16" viewBox="0 0 16 16">
              <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
              <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
            </svg>
          </div>
        </div>

      </div>
      
      {/* Selected dates display */}
      {selectedDates.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-600 mb-1">Selected dates:</div>
          <div className="flex flex-wrap gap-1">
            {selectedDates.map((date, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
              >
                <span>{date}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDate(date)}
                  className="ml-1 text-red-500 hover:text-red-700 font-bold text-xs"
                  title="Remove this date"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleDatePicker; 