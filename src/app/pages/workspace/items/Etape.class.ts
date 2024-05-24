import {CellComponent} from "../grid/cell/cell.component";
import {Etape} from "../../../models/etape.model";
import {Type} from "../../../models/type.model";
import {Processus} from "../../../models/processus.model";
import {Categorie} from "../../../models/categorie.model";

export enum EStatut{
  EN_COURS=0,
  EN_ATTENTE_DE_VALIDATION=1,
  EN_ATTENTE_DU_DELAI=2,
  TERMINE=3
}

export enum StatutEtape{
  COMMENCEE=0,
  PAS_ENCORE_COMMENCEE=1
}

/*export function statutEtapeToString(statut:StatutEtape) {
  switch (statut){
    case StatutEtape.COMMENCEE:
      return "Commencée";
    case StatutEtape.PAS_ENCORE_COMMENCEE:
      return "Pas encore commencée";
  }
}*/

export function statutEtapeToString(statut:string) {
  switch (statut){
    case "COMMENCEE":
      return "Commencée";
    case "PAS_ENCORE_COMMENCEE":
      return "Pas encore commencée";
    case "0":
      return "Commencée";
    case "1":
      return "Pas encore commencée";
  }
  return "UNKNOWN";
}
export function getStatutLabel(staut:EStatut) {
  switch (staut){
    case EStatut.EN_COURS:
      return "En cours";
    case EStatut.EN_ATTENTE_DU_DELAI:
      return "En attente du délai";
    case EStatut.EN_ATTENTE_DE_VALIDATION:
      return "En attente du validation";
    case EStatut.TERMINE:
      return "Terminée";
  }
}

export class BaseEtape implements Etape{
  private _idEtape: number;
  private _indexColonne: number;
  private _indexLigne: number;
  private _description: string;
  private _ordre: number;
  private _pourcentage: number;
  private _dureeEstimee: number;
  private _delaiAttente: number;
  private _first: boolean;
  private _intermediate:boolean;
  private _end: boolean;
  private _validate: boolean;
  private _paid: boolean;
  private _statutEtape : StatutEtape;
  private _type : Type |null;
  private _categorie: Categorie | null;
  private _showButtons:boolean;
  private _enableShowButtons:boolean;
  private _componentName : string;
  private _processus? : Processus | undefined;
  private _editModalIsVisibe:boolean;
  private _connectionsModalIsVisibe:boolean;
  _displayInfo:boolean;
  public _cellRef: CellComponent | null;

  constructor() {
    this._idEtape=-1;
    this._description='';
    this._ordre=0;
    this._indexLigne=0;
    this._indexColonne=0;
    this._pourcentage=0;
    this._dureeEstimee=0;
    this._delaiAttente=0;
    this._first = false;
    this._intermediate = false;
    this._end=false;
    this._validate=false;
    this._paid =false;
    this._statutEtape = StatutEtape.PAS_ENCORE_COMMENCEE;
    //this._type = 'default';
    this._componentName='';
    this._showButtons = false;
    this._enableShowButtons=false;
    this._displayInfo=false;
    this._cellRef=null;
    this._editModalIsVisibe=false;
    this._connectionsModalIsVisibe=false;
    this._type = null;
    this._categorie = null;
  }


  get idEtape(): number {
    if(this._idEtape)
      return this._idEtape
    return -1;
  }

  set idEtape(value: number) {
    this._idEtape = value;
  }

  get indexColonne(): number {
    return this._indexColonne;
  }

  set indexColonne(value: number) {
    this._indexColonne = value;
  }

  get indexLigne(): number {
    return this._indexLigne;
  }

  set indexLigne(value: number) {
    this._indexLigne = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get ordre(): number {
    return this._ordre;
  }

  set ordre(value: number) {
    this._ordre = value;
  }

  get pourcentage(): number {
    return this._pourcentage;
  }

  set pourcentage(value: number) {
    this._pourcentage = value;
  }

  get dureeEstimee(): number {
    return this._dureeEstimee;
  }

  set dureeEstimee(value: number) {
    this._dureeEstimee = value;
  }

  get delaiAttente(): number {
    return this._delaiAttente;
  }

  set delaiAttente(value: number) {
    this._delaiAttente = value;
  }

  get first(): boolean {
    return this._first;
  }

  set first(value: boolean) {
    this._first = value;
  }


  get intermediate(): boolean {
    return this._intermediate;
  }

  set intermediate(value: boolean) {
    this._intermediate = value;
  }

  get end(): boolean {
    return this._end;
  }

  set end(value: boolean) {
    this._end = value;
  }

  get validate(): boolean {
    return this._validate;
  }

  set validate(value: boolean) {
    this._validate = value;
  }

  get paid(): boolean {
    return this._paid;
  }

  set paid(value: boolean) {
    this._paid = value;
  }

  get statutEtape(): StatutEtape {
    return this._statutEtape;
  }

  set statutEtape(value: StatutEtape) {
    this._statutEtape = value;
  }

  get showButtons(): boolean {
    return this._showButtons;
  }

  set showButtons(value: boolean) {
    this._showButtons = value;
  }

  get enableShowButtons(): boolean {
    return this._enableShowButtons;
  }

  set enableShowButtons(value: boolean) {
    this._enableShowButtons = value;
  }

  displayButtons()
  {
    if(this._enableShowButtons)
    {
      this._showButtons = !this._showButtons;
    }
  }


  get type(): Type | null {
    return this._type;
  }

  set type(value: Type | null) {
    this._type = value;
  }

  get categorie(): Categorie | null {
    return this._categorie;
  }

  set categorie(value: Categorie | null) {
    this._categorie = value;
  }

  get processus(): Processus | undefined{
    if(this._processus)
      return this._processus;
    return undefined;
  }

  set processus(value: Processus | undefined) {
    this._processus = value;
  }

  get componentName(): string {
    return this._componentName;
  }

  set componentName(value: string) {
    this._componentName = value;
  }

  get editModalIsVisibe(): boolean {
    return this._editModalIsVisibe;
  }

  set editModalIsVisibe(value: boolean) {
    this._editModalIsVisibe = value;
  }


  get connectionsModalIsVisibe(): boolean {
    return this._connectionsModalIsVisibe;
  }

  set connectionsModalIsVisibe(value: boolean) {
    this._connectionsModalIsVisibe = value;
  }

  onClickHideModal(){
    this._editModalIsVisibe=false;
  }
}

