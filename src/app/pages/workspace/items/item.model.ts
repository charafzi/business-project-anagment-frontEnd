import {CellComponent} from "../grid/cell/cell.component";
import {BaseEtape} from "./Etape.class";
import {Tache} from "../../../models/tache.model";


export abstract class BaseItem{
  public _enableShowButtons: boolean;
  private _showButtons: boolean;
  public _etape: BaseEtape | null;
  public _cellRef: CellComponent | null;
  public _componentName: string;
  public _displayInfo: boolean;
  public _mode : number;
  private _tache : Tache | null;

  protected constructor() {
    this._etape=null;
    this._cellRef=null;
    this._enableShowButtons=false;
    this._showButtons = false;
    this._componentName='';
    this._displayInfo=false;
    this._tache = null;
    this._mode=-1;
  }


  get showButtons(): boolean {
    return this._showButtons;
  }

  set showButtons(value: boolean) {
    this._showButtons = value;
  }

  get tache(): Tache | null {
    return this._tache;
  }

  set tache(value: Tache | null) {
    this._tache = value;
  }

  /*displayButtons()
  {
    if(this._enableShowButtons)
    {
      this._showButtons = !this._showButtons;
    }
  }*/

  onClickDelete(){
    this._etape?._cellRef?.deleteItemProcess()
  }

  //change the boolean in etape to make it visible
  onClickDisplayEditModal(){
    if (this._etape){
      this._etape.editModalIsVisibe=true;
    }
  }

  onClickDisplayConnectionModal(){
    if (this._etape){
      this._etape.connectionsModalIsVisibe=true;
    }
  }

  onClickDisplaySubTaskModal(){
    if (this._etape){
      this._etape.subTaskModalIsVisibe=true;
    }
  }

  onClickDisplayPaymentModal(){
    if(this._etape && this._etape.tache){
      this._etape.paymentModalIsVisible=true;
    }
  }

  onClickDisplayValidationModal(){
    if(this._etape && this._etape.tache){
      this._etape.validationModalIsVisible=true;
    }
  }


}
