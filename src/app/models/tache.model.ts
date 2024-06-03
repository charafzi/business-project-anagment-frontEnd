import {StatutTache} from "./StatutTache";
import {Priorite} from "./Priorite";
import {Etape} from "./etape.model";
import {Travailleur} from "./travailleur.model";
import {SousTraitant} from "./sousTraitant.model";
import {StatutEtape} from "./StatutEtape";

export interface Tache{
  idTache?:number;
  objetTache?:string;
  priorite?:Priorite;
  pourcentage?: number;
  statutTache? : StatutTache;
  statutEtape?: StatutEtape;
  dateDebutPrevue? : Date;
  dateDebutEffective? : Date | null;
  dateFinEffective? : Date | null;
  dateExpiration? : Date;
  travailleurs? : Travailleur[];
  sousTraitant? : (SousTraitant | null);
  etape? : Etape | null;
  tache_mere? : (Tache | null);
  sous_taches?: Tache[];
}

export function getStatutTacheFromString(statut:string){
  switch (statut){
    case "En cours":
      return StatutTache.EN_COURS;
    case "En attente de validation":
      return StatutTache.EN_ATTENTE_DE_VALIDATION;
    case "En attente du delai":
      return StatutTache.EN_ATTENTE_DU_DELAI;
    case "Terminée":
      return StatutTache.TERMINE;
  }
  //default
  return StatutTache.TERMINE;
}

export function statutTacheToString(statut:StatutTache){
  switch (statut){
    case StatutTache.EN_COURS:
      return "En cours";
    case StatutTache.EN_ATTENTE_DE_VALIDATION:
      return "En attente de validation";
    case StatutTache.EN_ATTENTE_DU_DELAI:
      return "En attente du delai";
    case StatutTache.TERMINE:
      return "Terminée";
  }
}

export function statutTacheFromDB(statut:string){
  switch (statut){
    case "EN_COURS":
      return StatutTache.EN_COURS;
    case "EN_ATTENTE_DE_VALIDATION":
      return StatutTache.EN_ATTENTE_DE_VALIDATION;
    case "EN_ATTENTE_DU_DELAI":
      return StatutTache.EN_ATTENTE_DU_DELAI;
    case "TERMINE":
      return StatutTache.TERMINE;
  }
  //default
  return StatutTache.TERMINE;
}
