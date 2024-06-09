import {Tache} from "./tache.model";
import {Responsable} from "./responsable.model";

export interface Validation {
  idValidation : number,
  //tache: Tache;
  responsable: Responsable;
  etat: string;
  commentaire: string;
  dateValidation: Date;
}
