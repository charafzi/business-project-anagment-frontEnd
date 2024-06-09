import {Tache} from "./tache.model";
import {User} from "./user.model";

export interface TeamLeader extends User{
  matricule: string;
  taches: Tache[];
}
