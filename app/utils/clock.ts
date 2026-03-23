import dayjs from "dayjs";

export const displayTimestamp = (date: Date | string): string => {
  return dayjs(date).format("D MMM, YYYY");
};
