import {Type} from "./type.model"
import {Processus} from "./processus.model";
import {Categorie} from "./categorie.model";
import {StatutEtape} from "./StatutEtape";
import {DurationUnite} from "./DurationUnite";

export interface Etape{
  idEtape:number;
  description:string,
  indexLigne:number,
  indexColonne:number,
  ordre: number,
  dureeEstimee: number,
  dureeEstimeeUnite:DurationUnite,
  type : Type | null,
  first: boolean,
  validate: boolean,
  accepted : boolean,
  intermediate : boolean,
  end: boolean,
  paid: boolean,
  processus?:Processus;
  categorie : Categorie | null;
}

