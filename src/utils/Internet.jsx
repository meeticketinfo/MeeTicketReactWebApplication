import React, { useEffect, useState } from "react";

const Internet = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div
          className={`fixed top-0 left-0 w-full bg-red-800 text-white text-center text-sm md:text-base py-2 shadow-md z-50 transform transition-transform duration-300 ease-out ${
            isOnline ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          🔌 You are offline. Please check your internet connection.
        </div>
      )}
      {children}
    </>
  );
};

export default Internet;
