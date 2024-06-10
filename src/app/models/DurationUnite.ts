export enum DurationUnite {
  HOUR = 0,
  DAY = 1,
  MONTH = 2
}

export function getDurationUniteFromString(unite :string) {
  switch (unite){
    case "HOUR":
      return DurationUnite.HOUR;
    case "DAY":
      return DurationUnite.DAY;
    case "MONTH":
      return DurationUnite.MONTH;
    case "0":
      return DurationUnite.HOUR;
    case "1":
      return DurationUnite.DAY;
    case "2":
      return DurationUnite.MONTH;
  }
  //default
  return DurationUnite.HOUR;
}

/*

export function getDurationUniteFromInt(unite : number):DurationUnite{
  switch (unite){
    case 0:
      return DurationUnite.HOUR;
    case 1:
      return DurationUnite.DAY;
    case 2:
      return DurationUnite.MONTH;
  }
  return DurationUnite.HOUR;
}
*/
