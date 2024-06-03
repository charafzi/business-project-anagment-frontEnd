import {Tache} from "./tache.model";

export interface SousTraitant{
  idSousTraitant : number;
  nom : string;
  adresse : string;
  tel : string;
  taches : Tache[];
}
