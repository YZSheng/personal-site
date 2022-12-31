import dayjs from "dayjs";

export const displayTimestamp = (date: Date): string => {
  return dayjs(date).format("D MMM, YYYY");
};
