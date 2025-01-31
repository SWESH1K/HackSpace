import React, { useEffect, useState } from "react";
import { isBefore, isAfter, isWithinInterval, differenceInSeconds } from "date-fns";

interface EventStatusProps {
  startDate: Date;
  endDate: Date;
}

const EventStatus: React.FC<EventStatusProps> = ({ startDate, endDate }) => {
  const [status, setStatus] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(differenceInSeconds(startDate, new Date()));

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      if (isBefore(now, startDate)) {
        setStatus("Starts in");
        setTimeLeft(differenceInSeconds(startDate, now));
      } else if (isWithinInterval(now, { start: startDate, end: endDate })) {
        setStatus("Ongoing");
        setTimeLeft(0);
      } else if (isAfter(now, endDate)) {
        setStatus("Completed");
        setTimeLeft(0);
      }
    };

    updateStatus();
    const intervalId = setInterval(updateStatus, 1000);

    return () => clearInterval(intervalId);
  }, [startDate, endDate]);

  const formatDigitalClock = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(days).padStart(2, '0')} Days ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-4 justify-center items-center p-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{status}</div>
      {timeLeft > 0 && (
        <div className="text-6xl font-mono bg-gray-100 text-gray-600 dark:text-gray-400 dark:bg-black  p-4 rounded-lg">
          {formatDigitalClock(timeLeft)}
        </div>
      )}
    </div>
  );
};

export default EventStatus;