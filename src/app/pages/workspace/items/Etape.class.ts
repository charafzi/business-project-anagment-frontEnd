import {CellComponent} from "../grid/cell/cell.component";

export enum EStatut{
  EN_COURS=0,
  EN_ATTENTE_DE_VALIDATION=1,
  EN_ATTENTE_DU_DELAI=2,
  TERMINE=3
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

export interface Etape {
  get description():string;
  get ordre():number;
  get pourcentage():number;
  get duréeEstimée():number;
  get isFirst():boolean;
  get isEnd():boolean;
  get isValidate():boolean;
  get isPaid():boolean;
  get isStarted():boolean;
  get type():string;
  get showButtons() : boolean;
  get enableShowButtons() : boolean;
  displayInfo():void;
}

export abstract class BaseEtape implements Etape{
  private _description: string;
  private _ordre: number;
  private _pourcentage: number;
  private _duréeEstimée: number;
  private _délaiAttente: number;
  private _isFirst: boolean;
  private _isEnd: boolean;
  private _isValidate: boolean;
  private _isPaid: boolean;
  private _isStarted: boolean;
  private _type: string;
  private _showButtons:boolean;
  private _enableShowButtons:boolean;
  _displayInfo:boolean;
  cellRef?: CellComponent;

  protected constructor() {
    this._description='';
    this._ordre=0;
    this._pourcentage=0;
    this._duréeEstimée=0;
    this._délaiAttente=0;
    this._isFirst = false;
    this._isEnd=false;
    this._isValidate=false;
    this._isPaid=false;
    this._isStarted=false;
    this._type = 'default';
    this._showButtons = false;
    this._enableShowButtons=false;
    this._displayInfo=false;
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

  get duréeEstimée(): number {
    return this._duréeEstimée;
  }

  set duréeEstimée(value: number) {
    this._duréeEstimée = value;
  }

  get délaiAttente(): number {
    return this._délaiAttente;
  }

  set délaiAttente(value: number) {
    this._délaiAttente = value;
  }

  get isFirst(): boolean {
    return this._isFirst;
  }

  set isFirst(value: boolean) {
    this._isFirst = value;
  }

  get isEnd(): boolean {
    return this._isEnd;
  }

  set isEnd(value: boolean) {
    this._isEnd = value;
  }

  get isValidate(): boolean {
    return this._isValidate;
  }

  set isValidate(value: boolean) {
    this._isValidate = value;
  }

  get isPaid(): boolean {
    return this._isPaid;
  }

  set isPaid(value: boolean) {
    this._isPaid = value;
  }

  get isStarted(): boolean {
    return this._isStarted;
  }

  set isStarted(value: boolean) {
    this._isStarted = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
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

  onClickDelete(){
    this.cellRef?.deleteItemProcess();
  }

  onClickDisplayEditModal(){
    this.cellRef?.displayEditItemProcess();
  }

  onClickHideModal(){
    this.cellRef?.hideItemProcess();
  }

  displayInfo() {
    this._displayInfo = true;
  }

  hideInfo(){
    this._displayInfo = false;
  }



}
