// converted from https://gist.github.com/jamesfulford/7f3311bd918982e68d911a9c70b27415

//
// useTime hook
//
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

const ReferenceTime = dayjs("2024-05-06T00:00:00.000Z");
export const useTime = (refreshCycle = 100) => {
  // Returns the current time
  // and queues re-renders every `refreshCycle` milliseconds (default: 100ms)
  // const seconds = useRef(0);
  const [now, setNow] = useState(ReferenceTime);

  useEffect(() => {
    // Regularly set time in state
    // (this will cause your component to re-render frequently)
    const intervalId = setInterval(
      () => setNow((currNow) => currNow.add(1, "minute")),
      refreshCycle
    );

    // Cleanup interval
    return () => clearInterval(intervalId);

    // Specify dependencies for useEffect
  }, [refreshCycle, setInterval, clearInterval, setNow, getTime]);

  return now;
};

//
// getTime helper function
// (helpful for testing)
// (and for showing that this hook isn't specific to any datetime library)
//

export const getTime = () => {
  return dayjs();
};
