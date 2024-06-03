export enum Priorite{
  HAUTE = "HAUTE",
  MOYENNE = "MOYENNE",
  BASSE = "BASSE"
}

export function getPrioriteFromString(priorite :string){
  switch (priorite){
    case "HAUTE":
      return Priorite.HAUTE;
    case "MOYENNE":
      return Priorite.MOYENNE;
    case "BASSE":
      return Priorite.BASSE;
  }
  //default
  return Priorite.BASSE;
}

/*
export function getPrioriteToString(priorite:string) {
  switch (priorite){
    case "0":
      return "HAUTE";
    case "1":
      return "MOYENNE";
    case "2":
      return "BASSE";
  }
  return priorite;
}
*/
