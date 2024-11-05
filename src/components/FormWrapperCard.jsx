import React from "react";
const FormWrapperCard = ({ children }) => {
  return (
    <>
      <div className="container mx-auto mt-10">
        <div className=" p-2 shadow-lg rounded-lg border border-gray-200">
          {children}
        </div>
      </div>
    </>
  );
};
export default FormWrapperCard;
