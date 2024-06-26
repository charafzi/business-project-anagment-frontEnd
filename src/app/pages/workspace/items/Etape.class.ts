import {CellComponent} from "../grid/cell/cell.component";
import {Etape} from "../../../models/etape.model";
import {Type} from "../../../models/type.model";
import {Processus} from "../../../models/processus.model";
import {Categorie} from "../../../models/categorie.model";
import {DurationUnite} from "../../../models/DurationUnite";
import {Tache} from "../../../models/tache.model";

export class BaseEtape implements Etape{
  private _idEtape: number;
  private _indexColonne: number;
  private _indexLigne: number;
  private _description: string;
  private _ordre: number;
  //private _pourcentage: number;
  private _dureeEstimee: number;
  private _dureeEstimeeUnite:DurationUnite;
  private _first: boolean;
  private _intermediate:boolean;
  private _end: boolean;
  private _validate: boolean;
  private _accepted : boolean;
  private _paid: boolean;
  //private _statutEtape : StatutEtape;
  private _type : Type |null;
  private _categorie: Categorie | null;
  private _showButtons:boolean;
  private _enableShowButtons:boolean;
  private _componentName : string;
  private _processus? : Processus | undefined;
  private _editModalIsVisibe:boolean;
  private _connectionsModalIsVisibe:boolean;
  private _subTaskModalIsVisibe:boolean;
  private _paymentModalIsVisible:boolean;
  private _validationModalIsVisible:boolean;
  private _acceptanceModalIsVisible:boolean;
  _displayInfo:boolean;
  public _cellRef: CellComponent | null;
  //used to assign tasks when selecting view in tasks-management
  private _tache : Tache | null;

    constructor() {
    this._idEtape=-1;
    this._description='';
    this._ordre=0;
    this._indexLigne=0;
    this._indexColonne=0;
   // this._pourcentage=0;
    this._dureeEstimee=0;
    this._dureeEstimeeUnite = DurationUnite.HOUR,
    this._first = false;
    this._intermediate = false;
    this._end=false;
    this._validate=false;
    this._paid =false;
    //this._statutEtape = StatutEtape.PAS_ENCORE_COMMENCEE;
    //this._type = 'default';
    this._componentName='';
    this._showButtons = false;
    this._enableShowButtons=false;
    this._displayInfo=false;
    this._cellRef=null;
    this._editModalIsVisibe=false;
    this._connectionsModalIsVisibe=false;
    this._subTaskModalIsVisibe=false;
    this._type = null;
    this._categorie = null;
    this._accepted = false;
    this._tache = null;
    this._paymentModalIsVisible=false;
    this._acceptanceModalIsVisible=false;
    this._validationModalIsVisible=false;
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

  get dureeEstimee(): number {
    return this._dureeEstimee;
  }

  set dureeEstimee(value: number) {
    this._dureeEstimee = value;
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
   /* if(this._enableShowButtons)
    {
      this._showButtons = !this._showButtons;
    }*/
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


  get dureeEstimeeUnite(): DurationUnite {
    return this._dureeEstimeeUnite;
  }

  set dureeEstimeeUnite(value: DurationUnite) {
    this._dureeEstimeeUnite = value;
  }



  get accepted(): boolean {
    return this._accepted;
  }

  set accepted(value: boolean) {
    this._accepted = value;
  }


  get tache(): Tache | null {
    return this._tache;
  }

  set tache(value: Tache | null) {
    this._tache = value;
  }


  get subTaskModalIsVisibe(): boolean {
    return this._subTaskModalIsVisibe;
  }

  set subTaskModalIsVisibe(value: boolean) {
    this._subTaskModalIsVisibe = value;
  }


  get paymentModalIsVisible(): boolean {
    return this._paymentModalIsVisible;
  }

  set paymentModalIsVisible(value: boolean) {
    this._paymentModalIsVisible = value;
  }

  get validationModalIsVisible(): boolean {
    return this._validationModalIsVisible;
  }

  set validationModalIsVisible(value: boolean) {
    this._validationModalIsVisible = value;
  }

  get acceptanceModalIsVisible(): boolean {
    return this._acceptanceModalIsVisible;
  }

  set acceptanceModalIsVisible(value: boolean) {
    this._acceptanceModalIsVisible = value;
  }


}

