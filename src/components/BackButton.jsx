import React from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";

const BackButton = ({
  label = "Button",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={`bg-gray-600 text-white rounded-2xl px-4 py-2 hover:bg-gray-700 transition ${className}`}
      onClick={onClick}
      //   disabled={disabled}
    >
      <div className="flex items-center justify-center gap-2 ">
        <span>
          <IoChevronBackCircleOutline className="text-lg" />
        </span>
        {label}
      </div>
    </button>
    // <button
    //   className="bg-white text-center w-48 rounded-2xl h-14 relative text-black  font-semibold group"
    //   type="button"
    // >
    //   <div className="bg-green-400 rounded-2xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
    //     <IoChevronBackCircleOutline className="text-2xl" />
    //   </div>
    //   <p className="translate-x-2">Go Back</p>
    // </button>
  );
};

export default BackButton;
