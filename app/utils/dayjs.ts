import dayjs from "dayjs";

export const formattedTime = (
  timestamp: string,
  format = "YYYY-MM-DD HH:mm:ss"
) => dayjs(timestamp).format(format);
