import {Tache} from "./tache.model";
import {User} from "./user.model";

export interface Travailleur extends User{
  matricule : string;
  taches? : Tache[];
}
