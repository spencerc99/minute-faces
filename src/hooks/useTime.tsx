// converted from https://gist.github.com/jamesfulford/7f3311bd918982e68d911a9c70b27415

//
// useTime hook
//
import { useEffect, useState } from "react";

export const useTime = (refreshCycle = 100, timezone?: string) => {
  // Returns the current time
  // and queues re-renders every `refreshCycle` milliseconds (default: 100ms)

  const [now, setNow] = useState(getTime(timezone));

  useEffect(() => {
    // Regularly set time in state
    // (this will cause your component to re-render frequently)
    const intervalId = setInterval(() => setNow(getTime(timezone)), refreshCycle);

    // Cleanup interval
    return () => clearInterval(intervalId);

    // Specify dependencies for useEffect
  }, [refreshCycle, timezone, setInterval, clearInterval, setNow, getTime]);

  return now;
};

//
// getTime helper function
// (helpful for testing)
// (and for showing that this hook isn't specific to any datetime library)
//
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getTime = (tz?: string) => {
  if (tz) {
    return dayjs().tz(tz);
  }
  return dayjs();
};
