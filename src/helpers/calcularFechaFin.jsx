import moment from "moment";

export const addDays = (date, daysToAdd) => {
  const WEEKEND = [moment().day("Friday").weekday()];
  let daysAdded = 0,
   momentDate = moment(new Date(date));
  while (daysAdded < daysToAdd) {
    momentDate = momentDate.add(1, "days");
    if (!WEEKEND.includes(momentDate.weekday())) {
      daysAdded++;
    console.log(WEEKEND.includes(momentDate.weekday()));
    }
  }
  // dias para los trabajdores que son jefes + 7 dias
  // momentDate = momentDate.add(daysToAdd +1 , "days")

  let fecha = momentDate._d?.toISOString().split("T")[0];
  return fecha;
};
