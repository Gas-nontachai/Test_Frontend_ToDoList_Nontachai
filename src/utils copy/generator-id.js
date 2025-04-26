import { formatDate } from "@/utils/date-helper";
import { v4 as uuidv4 } from "uuid";

export const generateID = () => {
  const timestamp = formatDate(new Date(), "ddMMyyyy");
  const uuid = uuidv4().replace(/-/g, "").substring(0, 5);

  return timestamp + "-" + uuid;
};
