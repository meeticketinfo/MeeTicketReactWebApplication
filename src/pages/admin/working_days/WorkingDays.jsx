import AdminLayout from "../../../layouts/AdminLayout";
import { useState } from "react";

export default function WorkingDays() {
  const [selectedDay, setSelectedDay] = useState("weekday");
  const [selectedDays, setSelectedDays] = useState(new Array(7).fill(false)); // State to track selected days
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [timeRange, setTimeRange] = useState({ start: 3, end: 17 }); // Initial time range in hours
  const [selectedOption, setSelectedOption] = useState(""); // State for dropdown

  const handleDayToggle = (dayType) => {
    setSelectedDay(dayType);
  };

  const toggleDaySelection = (index) => {
    const updatedDays = [...selectedDays];
    updatedDays[index] = !updatedDays[index]; // Toggle the selected state of the day
    setSelectedDays(updatedDays);
  };

  const addTimeRange = () => {
    const formattedStart = timeRange.start.toString().padStart(2, "0") + ":00";
    const formattedEnd = timeRange.end.toString().padStart(2, "0") + ":00";
    setSelectedTimes([...selectedTimes, { start: formattedStart, end: formattedEnd }]);
  };

  const handleRangeChange = (type, value) => {
    setTimeRange((prev) => {
      if (type === "start") {
        return { ...prev, start: Math.min(value, prev.end - 1) }; // Ensure start is always less than end
      } else if (type === "end") {
        return { ...prev, end: Math.max(value, prev.start + 1) }; // Ensure end is always greater than start
      }
    });
  };

  const removeTimeRange = (index) => {
    const updatedTimes = [...selectedTimes];
    updatedTimes.splice(index, 1);
    setSelectedTimes(updatedTimes);
  };

  const formatTime = (hour) => hour.toString().padStart(2, "0") + ":00";

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl  text-gray-800 font-bold">Days</h1>
        </div>

        {/* Container with rounded corners */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          {/* Dropdown Field */}
          <div className="mb-4">
            <label htmlFor="options" className="block text-sm font-bold text-gray-700">
              Select Park
            </label>
            <select
              id="options"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          <div className="mb-4 sm:mb-0">
          <h6 className=" text-gray-800 font-bold">Select Days</h6>
        </div>
          {/* Day Type Toggle */}
          <div className="flex space-x-2 mt-6">
            <button
              className={`px-4 py-2 font-semibold rounded-lg ${
                selectedDay === "weekday" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleDayToggle("weekday")}
            >
              Weekday
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-lg ${
                selectedDay === "weekend" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleDayToggle("weekend")}
            >
              Weekend
            </button>
          </div>

          {/* Day Buttons */}
          <div className="flex space-x-2 mt-4">
            {["S", "M", "T", "W", "TH", "F", "SA"].map((day, index) => (
              <button
                key={index}
                onClick={() => toggleDaySelection(index)} // Toggle selected state
                className={`w-10 h-10 flex items-center justify-center rounded-md ${
                  selectedDays[index]
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="relative w-full mt-6 mb-4">
            {/* Background track */}
            <div className="w-full bg-gray-300 h-1 rounded-full"></div>

            {/* Selected range */}
            <div
              className="absolute top-0 h-1 bg-blue-600 rounded-full"
              style={{
                left: `${(timeRange.start / 24) * 100}%`,
                width: `${((timeRange.end - timeRange.start) / 24) * 100}%`,
              }}
            ></div>

            {/* Start Handle */}
            <div
              className="absolute top-[-6px] w-5 h-5 bg-blue-600 rounded-full cursor-pointer"
              style={{ left: `${(timeRange.start / 24) * 100}%`, transform: "translateX(-50%)" }}
            >
              <input
                type="range"
                min="0"
                max="24"
                value={timeRange.start}
                onChange={(e) => handleRangeChange("start", parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* End Handle */}
            <div
              className="absolute top-[-6px] w-5 h-5 bg-blue-600 rounded-full cursor-pointer"
              style={{ left: `${(timeRange.end / 24) * 100}%`, transform: "translateX(-50%)" }}
            >
              <input
                type="range"
                min="0"
                max="24"
                value={timeRange.end}
                onChange={(e) => handleRangeChange("end", parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Time Labels */}
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>00:00</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Selected Start and End Time */}
          <div className="flex items-center space-x-4">
            <span className="text-blue-600 font-semibold">Start Time: {formatTime(timeRange.start)}</span>
            <span className="text-blue-600 font-semibold">End Time: {formatTime(timeRange.end)}</span>
            <button
              onClick={addTimeRange}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              Add Time
            </button>
          </div>

          {/* Display Added Time Ranges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedTimes.map((time, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-700 text-white px-3 py-1 rounded-lg"
              >
                {time.start} - {time.end}
                <button
                  onClick={() => removeTimeRange(index)}
                  className="ml-2 text-white hover:text-white font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
