import dayjs from "dayjs";
import "./clock.scss";
import { useTime } from "./hooks/useTime";
// import { useEffect } from "react";

export function AmbientClock() {
  const time = useTime();
  return <TimeSquare time={time} />;
}

export function daySeason(dayOfYear: number) {
  if (dayOfYear >= 79 && dayOfYear < 172) {
    return "Spring";
  } else if (dayOfYear >= 172 && dayOfYear < 266) {
    return "Summer";
  } else if (dayOfYear >= 266 && dayOfYear < 355) {
    return "Fall";
  } else {
    return "Winter";
  }
}
const start = dayjs();

function getCurrentMoonPhase(): { emoji: string; brightness: number } {
  const now = dayjs();
  const lunarMonth = 29.53058867; // average length of a lunar month in days
  const knownNewMoon = dayjs("2000-01-06"); // a known new moon date to base calculations on
  const daysSinceKnownNewMoon = now.diff(knownNewMoon, "day");
  const currentLunarAge = daysSinceKnownNewMoon % lunarMonth;
  const phase = currentLunarAge / lunarMonth;

  let emoji = "🌑"; // default to new moon
  let brightness = 0; // default to new moon brightness

  if (phase < 0.03 || phase > 0.97) {
    emoji = "🌑"; // new moon
    brightness = 0;
  } else if (phase < 0.22) {
    emoji = "🌒"; // waxing crescent
    brightness = 0.25;
  } else if (phase < 0.36) {
    emoji = "🌓"; // first quarter moon
    brightness = 0.5;
  } else if (phase < 0.5) {
    emoji = "🌔"; // waxing gibbous
    brightness = 0.75;
  } else if (phase < 0.64) {
    emoji = "🌕"; // full moon
    brightness = 1;
  } else if (phase < 0.78) {
    emoji = "🌖"; // waning gibbous
    brightness = 0.75;
  } else if (phase < 0.89) {
    emoji = "🌗"; // last quarter moon
    brightness = 0.5;
  } else {
    emoji = "🌘"; // waning crescent
    brightness = 0.25;
  }

  return { emoji, brightness };
}

function TimeSquare({ time }: { time: dayjs.Dayjs }) {
  // lightness scales from 5% at midnight to 100% at noon based on the hour of the day
  const hour = time.hour();
  const { emoji, brightness } = getCurrentMoonPhase();
  const lightness = Math.max(
    90 - Math.abs(hour - 12) * (90 / 12) + 5,
    5 + 10 * brightness
  );

  // useEffect(() => {
  //   document.getElementById("tick")?.play?.();
  // }, [time.second()]);

  // scale with second, 50% - 100%
  // accumulate number of seconds of the internet as pixels?
  // maybe allow them to choose a date?
  const saturation = Math.floor((time.second() / 60) * 50) + 50;
  const invertedLightness = Math.max(
    Math.min(Math.abs(100 - lightness), 80),
    30
  );

  return (
    <div
      className="clock"
      style={{
        // different color based on hour
        background: `hsl(${time.minute() * 15}, ${saturation}%, ${lightness}%)`,
        "--background": `hsl(${
          time.minute() * 15
        }, ${saturation}%, ${lightness}%)`,
        color: `hsl(${
          (time.minute() * 15 + 90) % 360
        }, ${saturation}%, ${invertedLightness}%)`,
        "--shadow-color": `hsl(${
          (time.minute() * 15 + 150) % 360
        }, ${saturation}%, ${invertedLightness}%)`,
      }}
    >
      <div className="visits">{BigInt(new Date().getTime()).toString()}</div>

      <div className="year">{time.format("YYYY")}</div>
      <div className="season">{daySeason(time.day())}</div>
      <div className="month">
        {time.format("MM")}-{time.format("MMM")}
      </div>
      <div className="day">
        {time.format("DD")}-{time.format("ddd")}
      </div>

      {/* <div
        className="seconds"
        style={{
          maxWidth: window.innerWidth,
        }}
      ></div> */}
      {/* {time.hour() < 6 || time.hour() > 18 ? (
        <span className="moon">{emoji}</span>
      ) : (
        <span className="moon">☀️</span>
      )} */}

      {/* longer you stay on the site the grainier it gets */}
      <div className="text">
        <span
          className="hour"
          style={{
            // transform: `rotate(${time.hour() * 30}deg)`,
            "--angle": `${(time.hour() % 12) * 30}deg`,
            "--shadow-x": `${
              Math.cos((((time.hour() % 12) * 30 - 90) * Math.PI) / 180) * 40
            }px`,
            "--shadow-y": `${
              Math.sin((((time.hour() % 12) * 30 - 90) * Math.PI) / 180) * 40
            }px`,
          }}
        >
          {time.format("h")}
        </span>
        <span
          className="minute"
          style={{
            // transform: `rotate(${time.minute() * 6}deg)`,
            "--angle": `${time.minute() * 6}deg`,
            "--shadow-x": `${
              Math.cos(((time.minute() * 6 - 90) * Math.PI) / 180) * 40
            }px`,
            "--shadow-y": `${
              Math.sin(((time.minute() * 6 - 90) * Math.PI) / 180) * 40
            }px`,
          }}
        >
          {time.format("mm")}
        </span>
        <span
          className="second"
          style={{
            // transform: `rotate(${time.second() * 6}deg)`,
            "--angle": `${time.second() * 6}deg`,
            "--shadow-x": `${
              Math.cos(((time.second() * 6 - 90) * Math.PI) / 180) * 40
            }px`,
            "--shadow-y": `${
              Math.sin(((time.second() * 6 - 90) * Math.PI) / 180) * 40
            }px`,
          }}
        >
          {time.format("ss")}
        </span>
      </div>
      {/* <div className="background"></div> */}
      {/* <audio id="tick"> */}
      {/* Derived from https://freesound.org/people/nightcustard/sounds/675680/ */}
      {/* <source src="clock-tick.mp3"></source> */}
      {/* </audio> */}
    </div>
  );
}

export function TestClock() {
  const time = useTime(33);
  const hour = Math.floor((time.second() / 60) * 24) % 24;

  return (
    <>
      <h1>{hour}:00:00</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {/* enumerate all the hours */}
        {/* {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
        // Start at 6am
        const adjustedHour = hour + 6;
        return (
          <>
            <span>{adjustedHour}:00:00</span>
            <TimeSquare time={dayjs().hour(adjustedHour).minute(0).second(0)} />
          </>
        );
      })} */}
        {/* enumerate all the minutes */}
        {/* {Array.from({ length: 60 }, (_, i) => i).map((minute) => {
        // Start at 6am
        return (
          <>
            <span>{minute}</span>
            <TimeSquare time={dayjs().hour(0).minute(minute).second(0)} />
          </>
        );
      })} */}
        {/* enumerate all the seconds */}
        {/* {Array.from({ length: 60 }, (_, i) => i).map((second) => {
          // Start at 6am
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{second}</span>
              <TimeSquare time={dayjs().hour(hour).minute(9).second(second)} />
            </div>
          );
        })} */}
      </div>
    </>
  );
}
