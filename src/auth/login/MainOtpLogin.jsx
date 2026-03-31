import React, { useState, useEffect } from "react";

import Login from "./Login";
// import useAuthStore from '../../store/auth-store';
import OtPVerification from "./OTPVerification";
import OtpLogin from "../OtpLogin";
import useAuthStore from "../../store/authStore";

const MainOtpLogin = ({ closeModal }) => {
  const [userId, setUserId] = useState(false);

  const [timeLeft, setTimeLeft] = useState(60); // Initial time

  // Get token and setToken from Zustand store
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer); // Stop the timer when it reaches 0
    }
    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [timeLeft]);

  // const handleOtpSent = (id) => {
  //     setUserId(id);
  // };

  const startTimer = () => {
    setTimeLeft(60); // Restart the timer when OTP is sent
  };

  return (
    <div>
      { (
        userId ? (
          <OtPVerification
            startTimer={startTimer}
            timeLeft={timeLeft}
            onOtpSent={setUserId}
          />
        ) : (
          <OtpLogin onOtpSent={setUserId} startTimer={startTimer} />
        )
      ) }
    </div>
  );
};

export default MainOtpLogin;
