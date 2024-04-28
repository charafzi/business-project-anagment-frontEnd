import {CellComponent} from "../grid/cell/cell.component";

export interface ProcessItem{
  type:string;
  showButtons : boolean;
  enableShowButtons : boolean;
  displayButtons() : void;
}

export abstract class BaseProcessItem implements ProcessItem{
  cellRef?: CellComponent;
  enableShowButtons: boolean;
  showButtons: boolean;
  type: string;

  protected constructor() {
    this.type = 'default';
    this.showButtons = false;
    this.enableShowButtons = false;
  }

  displayButtons()
  {
    if(this.enableShowButtons)
    {
      this.showButtons = !this.showButtons;
    }
  }

  onClickDelete(){
    this.cellRef?.deleteItemProcess();
  }

}
