import {Tache} from "./tache.model";
import {User} from "./user.model";

export interface SousTraitant extends User{
  adresse : string;
  taches : Tache[];
}
