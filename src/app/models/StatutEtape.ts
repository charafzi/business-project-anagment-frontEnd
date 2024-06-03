export enum StatutEtape {
  COMMENCEE = 0,
  PAS_ENCORE_COMMENCEE = 1,
  TERMINE = 2
}

export function getStatutEtapeFromString(statut :string){
  switch (statut){
    case "COMMENCEE":
      return StatutEtape.COMMENCEE;
    case "PAS_ENCORE_COMMENCEE":
      return StatutEtape.PAS_ENCORE_COMMENCEE;
    case "TERMINE":
      return StatutEtape.TERMINE;
    case "0":
      return StatutEtape.PAS_ENCORE_COMMENCEE;
    case "1":
      return StatutEtape.COMMENCEE;
    case "2":
      return StatutEtape.TERMINE;
  }
  //default
  return StatutEtape.PAS_ENCORE_COMMENCEE;
}

export function getstatutEtapeToString(statut:string) {
  switch (statut){
    case "0":
      return "COMMENCEE";
    case "1":
      return "PAS_ENCORE_COMMENCEE";
    case "2":
      return "TERMINE";
  }
  return statut;
}

