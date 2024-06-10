import {User} from "./user.model";
import {Tache} from "./tache.model";

export interface Responsable extends User {
  matricule: string;
  taches: Tache[];
}
