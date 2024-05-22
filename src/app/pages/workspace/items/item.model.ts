import {CellComponent} from "../grid/cell/cell.component";
import {BaseEtape} from "./Etape.class";


export abstract class BaseItem{
  public _enableShowButtons: boolean;
  public _showButtons: boolean;
  public _etape: BaseEtape | null;
  public _cellRef: CellComponent | null;
  public _componentName: string;
  public _displayInfo: boolean;

  protected constructor() {
    this._etape=null;
    this._cellRef=null;
    this._enableShowButtons=false;
    this._showButtons = false;
    this._componentName='';
    this._displayInfo=false;
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
    /*if(this._enableShowButtons)
    {
      this._showButtons = !this._showButtons;
    }*/
  }



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
}
