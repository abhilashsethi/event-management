import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const toUTC = (dateTimeString, tz) => {
  return dayjs.tz(dateTimeString, tz).utc().toDate();
};

export const toUserTZ = (date, tz) => {
  if (!date) return null;
  return dayjs(date).tz(tz).format();
};

export { dayjs };
