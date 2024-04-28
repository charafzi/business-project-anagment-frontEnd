import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver, EventEmitter,
  Input,
  OnInit, Output, Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList} from "@angular/cdk/drag-drop";
import {BaseProcessItem} from "../../items/processItem.class";
import {NgClass, NgIf} from "@angular/common";
import {SquareComponent} from "../../items/square/square.component";
import {RhombusComponent} from "../../items/rhombus/rhombus.component";
import {CircleComponent} from "../../items/circle/circle.component";


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    CdkDragPlaceholder,
    SquareComponent,
    RhombusComponent,
    CircleComponent
  ],
  styleUrl: './cell.component.css'
})
export class CellComponent implements OnInit,AfterViewInit{
  itemsTypes : any = {
    square: 'square',
    rhombus: 'rhombus',
    circle : 'circle'
  }
  @Input('processItem') processItem: BaseProcessItem | null = null;
  @Output('processItemCreated') processItemCreated = new EventEmitter<{processItem:BaseProcessItem ,rowIndex:number,colIndex:number}>();
  @Output('processItemDeleted') processItemDeleted = new EventEmitter<{rowIndex:number,colIndex:number}>();
  @Input('rowIndex') rowIndex! : number;
  @Input('colIndex') colIndex! : number;
  @ViewChild('container',{read : ViewContainerRef})
  container! : ViewContainerRef;
  constructor(private CFR: ComponentFactoryResolver) {
    setTimeout(() => {
      if(this.processItem != null)
      {
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is type === "+this.processItem.type);
      }
      else
      {
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is null");
      }

    }, 6000);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }


  onClickCell()
  {
    console.log("on click cell ["+this.rowIndex+"]["+this.colIndex+"] CLICKED ::: "+this.processItem?.type);
  }
  drop(event :CdkDragDrop<BaseProcessItem>) {
    console.log("DROPPED ON CELL ["+this.rowIndex+"]["+this.colIndex+"] :!");
    console.log(event);
    if(this.processItem != null) {
      this.container.clear();
      this.processItem = null;
    }
    console.log(event.item.dropContainer.data[event.previousIndex].type);
    this.createItemProcess(event.item.dropContainer.data[event.previousIndex].type);
  }

  createItemProcess(type:string) {
    if (!this.container) {
      console.error('ViewContainerRef is not defined.');
      return;
    }
    try
    {
      if(this.processItem != null){}
      let newProcessItem : BaseProcessItem;
      console.log("----------------> "+this.getComponentByType(type));
      let componentFactory = this.CFR.resolveComponentFactory(this.getComponentByType(type));
      let childComponentRef = this.container.createComponent(componentFactory);
      newProcessItem = childComponentRef.instance;
      this.processItem = newProcessItem;
      this.processItem.cellRef = this;
      this.processItem.enableShowButtons = true;
      this.processItemCreated.emit({
        processItem : newProcessItem,
        rowIndex : this.rowIndex,
        colIndex : this.colIndex
      })
    }
    catch (error) {
      console.error("Error at creating itemProcessComponent:", error);
    }
  }

  deleteItemProcess(){
    if(this.processItem != null){
      this.container.clear();
      this.processItem = null;
      this.processItemDeleted.emit({
        rowIndex : this.rowIndex,
        colIndex : this.colIndex
      })
    }
  }

  getComponentByType(type :string) : Type<any>
  {
    switch (type){
      case this.itemsTypes.square:
        return SquareComponent;
      case this.itemsTypes.rhombus:
        return RhombusComponent;
      case this.itemsTypes.circle:
        return CircleComponent;
    }
    return SquareComponent;
    }
}
