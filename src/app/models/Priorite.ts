import {StatutEtape} from "./StatutEtape";
import {StatutTache} from "./StatutTache";

export enum Priorite{
  HAUTE = 0,
  MOYENNE = 1,
  BASSE= 2
}

export function getPrioriteFromString(priorite :string){
  switch (priorite){
    case "HAUTE":
      return Priorite.HAUTE;
    case "MOYENNE":
      return Priorite.MOYENNE;
    case "BASSE":
      return Priorite.BASSE;
    case "0":
      return Priorite.HAUTE;
    case "1":
      return Priorite.MOYENNE;
    case "2":
      return Priorite.BASSE;
  }
  //default
  return Priorite.BASSE;
}

export function getPrioriteToString(priorite:string) {
  switch (priorite){
    case "0":
      return Priorite.HAUTE;
    case "1":
      return Priorite.MOYENNE;
    case "2":
      return Priorite.BASSE;
  }
  return priorite;
}
