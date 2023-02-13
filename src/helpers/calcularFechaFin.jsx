import moment from "moment";

export const addDays = (date, daysToAdd) => {
  const WEEKEND = [moment().day("Sunday").weekday()];
  var daysAdded = 0,
    momentDate = moment(new Date(date));
  while (daysAdded < daysToAdd) {
    momentDate = momentDate.add(1, "days");
    if (!WEEKEND.includes(momentDate.weekday())) {
      daysAdded++;
    }
  }
  let fecha = momentDate._d?.toISOString().split("T")[0];

  return fecha;
};
