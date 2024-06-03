import {Tache} from "./tache.model";

export interface Travailleur{
  matricule : string;
  nom : string;
  prenom : string;
  numTel : string;
  email : string;
  taches : Tache[];
}
