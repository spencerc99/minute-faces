import dayjs from "dayjs";
import "./clock.scss";
import { useTime } from "./hooks/useTime";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
// import { useEffect } from "react";

dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

export function AmbientClock() {
  const urlParams = new URLSearchParams(window.location.search);
  // Get timezone from URL parameter, or detect from browser
  const timezone =
    urlParams.get("tz") || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = useTime(100, timezone);
  return <TimeSquare time={time} timezone={timezone} />;
}

/**
 * Determines the season based on the day of year and hemisphere.
 * Uses meteorological season dates for consistency:
 * - Spring: March 1 (day 60) - May 31 (day 151)
 * - Summer: June 1 (day 152) - August 31 (day 243)
 * - Fall: September 1 (day 244) - November 30 (day 334)
 * - Winter: December 1 (day 335) - February 28/29 (day 59)
 *
 * For Southern Hemisphere, seasons are inverted (6 months offset).
 *
 * @param time - dayjs object representing the current time
 * @param isNorthernHemisphere - true for Northern Hemisphere, false for Southern
 */
export function daySeason(
  time: dayjs.Dayjs,
  isNorthernHemisphere: boolean = true
): string {
  const dayNum = time.dayOfYear();

  let season: string;

  // Meteorological seasons (Northern Hemisphere)
  // Spring: March 1 (day 60 in non-leap, 61 in leap) - May 31 (day 151/152)
  // Summer: June 1 (day 152/153) - August 31 (day 243/244)
  // Fall: September 1 (day 244/245) - November 30 (day 334/335)
  // Winter: December 1 (day 335/336) - February 28/29 (day 59/60)

  const isLeapYear = time.isLeapYear();
  const springStart = isLeapYear ? 61 : 60; // March 1
  const summerStart = isLeapYear ? 153 : 152; // June 1
  const fallStart = isLeapYear ? 245 : 244; // September 1
  const winterStart = isLeapYear ? 336 : 335; // December 1

  if (dayNum >= springStart && dayNum < summerStart) {
    season = "Spring";
  } else if (dayNum >= summerStart && dayNum < fallStart) {
    season = "Summer";
  } else if (dayNum >= fallStart && dayNum < winterStart) {
    season = "Fall";
  } else {
    season = "Winter";
  }

  // Invert seasons for Southern Hemisphere
  if (!isNorthernHemisphere) {
    const seasonMap: { [key: string]: string } = {
      Spring: "Fall",
      Summer: "Winter",
      Fall: "Spring",
      Winter: "Summer",
    };
    season = seasonMap[season];
  }

  return season;
}
// const start = dayjs();

export function getCurrentMoonPhase(): { emoji: string; brightness: number } {
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

/**
 * Determines if a timezone is in the Northern Hemisphere.
 * Uses timezone string patterns to detect Southern Hemisphere locations.
 * Defaults to Northern Hemisphere for unknown/ambiguous timezones.
 */
function isNorthernHemisphere(timezone: string): boolean {
  // Southern Hemisphere timezones (comprehensive list of common ones)
  const southernTimezones = [
    // Australia & Oceania
    "Australia",
    "Pacific/Auckland", // New Zealand
    "Pacific/Fiji",
    "Pacific/Tahiti",
    "Pacific/Chatham",
    "Pacific/Tongatapu",
    "Pacific/Apia",
    "Pacific/Port_Moresby", // Papua New Guinea
    "Pacific/Noumea", // New Caledonia

    // Antarctica
    "Antarctica",

    // Indian Ocean
    "Indian/Mauritius",
    "Indian/Reunion",
    "Indian/Cocos",
    "Indian/Christmas",

    // Southern Africa
    "Africa/Johannesburg",
    "Africa/Maputo",
    "Africa/Harare",
    "Africa/Lusaka",
    "Africa/Windhoek",
    "Africa/Gaborone",
    "Africa/Maseru",
    "Africa/Mbabane",

    // South America
    "America/Argentina",
    "America/Santiago",
    "America/Montevideo",
    "America/Sao_Paulo",
    "America/Rio_Branco",
    "America/Asuncion", // Paraguay
    "America/La_Paz", // Bolivia (mostly southern hemisphere)
    "America/Lima", // Peru (mostly southern hemisphere)

    // Atlantic
    "Atlantic/South_Georgia",
    "Atlantic/Stanley", // Falkland Islands
  ];

  return !southernTimezones.some((tz) => timezone.includes(tz));
}

function TimeSquare({
  time,
  timezone,
}: {
  time: dayjs.Dayjs;
  timezone: string;
}) {
  // lightness scales from 5% at midnight to 100% at noon based on the hour of the day
  const hour = time.hour();
  // const { emoji, brightness } = getCurrentMoonPhase();
  const lightness = Math.max(
    90 - Math.abs(hour - 12) * (90 / 12) + 5,
    5 + 10 // * brightness
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
  const hourAngle = (time.hour() % 12) * 30;
  const minuteAngle = time.minute() * 6;
  const secondAngle = time.second() * 6;

  return (
    <div
      className="clock"
      style={{
        // different color based on hour
        background: `hsl(${time.minute() * 15}, ${saturation}%, ${lightness}%)`,
        // @ts-expect-error css var not recognized
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
      <div className="season">
        {daySeason(time, isNorthernHemisphere(timezone))}
      </div>
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
            // @ts-expect-error css var not recognized
            "--shadow-x": `${
              Math.cos(((hourAngle - 90) * Math.PI) / 180) * 40
            }px`,
            "--shadow-y": `${
              Math.sin(((hourAngle - 90) * Math.PI) / 180) * 40
            }px`,
          }}
        >
          {time.format("h")}
        </span>
        <span
          className="minute"
          style={{
            // @ts-expect-error css var not recognized
            "--shadow-x": `${
              Math.cos(((minuteAngle - 90) * Math.PI) / 180) * 40
            }px`,
            "--shadow-y": `${
              Math.sin(((minuteAngle - 90) * Math.PI) / 180) * 40
            }px`,
          }}
        >
          {time.format("mm")}
        </span>
        <span
          className="second"
          style={{
            // @ts-expect-error css var not recognized
            "--shadow-x": `${
              Math.cos(((secondAngle - 90) * Math.PI) / 180) * 40
            }px`,
            "--shadow-y": `${
              Math.sin(((secondAngle - 90) * Math.PI) / 180) * 40
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
