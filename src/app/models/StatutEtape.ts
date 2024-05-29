export enum StatutEtape {
  COMMENCEE = 0,
  PAS_ENCORE_COMMENCEE = 1
}

export function getStatutEtapeFromString(statut :string){
  switch (statut){
    case "COMMENCEE":
      return StatutEtape.COMMENCEE;
    case "PAS_ENCORE_COMMENCEE":
      return StatutEtape.PAS_ENCORE_COMMENCEE;
  }
  //default
  return StatutEtape.PAS_ENCORE_COMMENCEE;
}

export function getstatutEtapeToString(statut:string) {
  switch (statut){
    case "COMMENCEE":
      return "Commencée";
    case "PAS_ENCORE_COMMENCEE":
      return "Pas encore commencée";
    case "0":
      return "Commencée";
    case "1":
      return "Pas encore commencée";
  }
  return "UNKNOWN";
}
