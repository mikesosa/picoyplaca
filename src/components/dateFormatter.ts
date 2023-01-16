import moment from "moment";
import "moment/locale/es";

export const dateFormatter = (date: Date) => {
  return moment(date).format("dddd D MMMM YYYY");
};

export const dateToDayName = (date: Date) => {
  return moment(date).format("dddd");
};
