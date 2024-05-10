import {StatutEtape} from "../pages/workspace/items/Etape.class";
import {Type} from "./type.model"
import {Processus} from "./processus.model";

export interface Etape{
  idEtape:number;
  description:string,
  indexLigne:number,
  indexColonne:number,
  ordre: number,
  pourcentage: number,
  dureeEstimee: number,
  delaiAttente: number,
  statutEtape: StatutEtape,
  type? :Type,
  first: boolean,
  validate: boolean,
  end: boolean,
  paid: boolean,
  processus?:Processus;
}
