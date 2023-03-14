import React, { useState, useEffect } from 'react';

const OTPValidityTimer = ({ validityPeriodInSeconds, onTimerExpired }) => {
  const [remainingTime, setRemainingTime] = useState(validityPeriodInSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          onTimerExpired();
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [validityPeriodInSeconds, onTimerExpired]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return <div style={{color:'red'}}>{formatTime(remainingTime)}</div>;
};

export default OTPValidityTimer;
