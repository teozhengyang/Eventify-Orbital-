import { startOfMonth, startOfWeek, addDays, subDays } from "date-fns";

/**
 * Function for 2D array of days in a month
 */

/**
 * Returns 2D array of dates from input month in 5 x 7 grid, 
 * @param month Month of current year, if argument unspecified defaults to current month when function is called
 * @returns 2D array of days in Sunday-Saturday format of input month, fills excess days with that of previous and next months
 */
export function getMonthMatrix(curr = new Date()) {
  const month = curr.getMonth();
  const year = curr.getFullYear();
  const firstDayOfMonth = startOfMonth(curr).getDay()

  let dayInMonth = 0 - firstDayOfMonth;

  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      dayInMonth++
      return new Date(year, month, dayInMonth);
    });
  });
  return daysMatrix;
}


export function getWeekArray(curr = new Date()) {
  const weekStart = startOfWeek(curr);
  let weekDate = subDays(weekStart, 1);

  const weekArray = new Array(7).fill(null).map(() => {
    weekDate = addDays(weekDate, 1);
    return weekDate;
  })
  return weekArray
}