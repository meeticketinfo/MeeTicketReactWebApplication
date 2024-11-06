import React from "react";

function Button({ text, onClickHandler,type,isLoading }) {
  return (
    <div>
      <button
        type={type}
        onClick={onClickHandler}
         className="bg-blue-v1 text-base text-white rounded-lg hover:py-[7px] px-3 py-2 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
      >
        {text}
      </button>
    </div>
  );
}

export default Button;
