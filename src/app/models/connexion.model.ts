import {Etape} from "./etape.model";
import {StatutTache} from "./StatutTache";
import {DurationUnite} from "./DurationUnite";
import {StatutEtape} from "./StatutEtape";

export interface Connexion{
  from:Etape;
  to:Etape;
  delaiAttente:number,
  delaiAttenteUnite:DurationUnite,
  statut:StatutEtape
}
