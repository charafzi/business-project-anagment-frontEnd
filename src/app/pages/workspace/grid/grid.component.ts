import {Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {BaseProcessItem, ProcessItem} from "../items/processItem.class";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {DOCUMENT, NgClass} from "@angular/common";
import LeaderLine from "leader-line-new";
import {Connection} from "./connection.class";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  imports: [
    CellComponent,
    NzColDirective,
    NzRowDirective,
    CdkDropList,
    NzFlexDirective,
    NgClass
  ],
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit{
  @ViewChild('grid', { read: ElementRef }) grid!: ElementRef;
  hGutter:number = 64;
  vGutter: number = 64;
  nbRows:number = 5;
  nbCols:number = 5;
  indexRowDotCurr:number =-1;
  indexColDotCurr:number =-1;
  indexRowDotNext:number =-1;
  indexColDotNext:number =-1;
  arrayRows = new Array(this.nbRows);
  arrayCols = new Array(this.nbCols);
  gridComponentInstance! : GridComponent;
  processItems:(BaseProcessItem | null)[][] = [];
  connetions : Connection[] = [];

  constructor(@Inject(DOCUMENT) private document:Document) {
    this.gridComponentInstance = this;
    setTimeout(() => {
    this.printProcessItems()

    }, 2000);
  }
  ngOnInit(): void {
    this.processItems =
      new Array(this.nbRows)
        .fill(null)
        .map(()=> new Array(this.nbCols).fill(null));
  }

  printProcessItems()
  {
    for(let i=0; i<this.nbRows; i++)
    {
      for(let j=0;j<this.nbCols;j++)
      {
        if (this.processItems[i][j] == null) {
          console.log("NULL");
        } else {
          console.log("TYPE is at grid: " + (this.processItems[i][j] as BaseProcessItem).type );
        }
      }
    }
  }

  updateRefProcessItems(eventData:{processItem:BaseProcessItem ,rowIndex:number,colIndex:number})
  {
    this.processItems[eventData.rowIndex][eventData.colIndex] = eventData.processItem;
  }

  deleteRefProcessItems(eventData:{rowIndex:number,colIndex:number})
  {
    this.processItems[eventData.rowIndex][eventData.colIndex]=null;
  }

  addRow(){
    console.log('ROW ADDED')
    this.nbRows++;
    this.arrayRows = new Array(this.nbRows);
    this.processItems.push(new Array(this.nbCols).fill(null));
  }
  addCol(){
    this.nbCols++;
    this.arrayCols = new Array(this.nbCols);
    this.processItems.forEach(row => row.push(null));
  }

  dotClicked(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1
      && this.indexColDotCurr!=-1
    ){
      this.indexRowDotNext = indexRow;
      this.indexColDotNext = indexCol;

      let rowCurr = this.indexRowDotCurr;
      let colCurr =this.indexColDotCurr;
      let rowNext = this.indexRowDotNext;
      let colNext = this.indexColDotNext;
      let idFrom:string = 'cell-'+rowCurr+'-'+colCurr;
      let idTo:string = 'cell-'+rowNext+'-'+colNext;

      console.log("ROWCURR = "+this.indexRowDotCurr +"/ COLCURR = "+ this.indexColDotCurr + "///// ROWNEXT ="+ this.indexRowDotNext +" / COLNEXT ="+ this.indexColDotNext)
      this.indexRowDotCurr = this.indexRowDotNext = this.indexRowDotCurr= this.indexColDotNext = -1;

      console.log('cell-'+rowNext+'-'+colNext);
      const el1 = document.getElementById(idFrom);
      const el2 = document.getElementById(idTo);
      if (el1 && el2) {
        const conn :Connection = new Connection(
          idFrom,
          idTo,
          this.processItems[rowCurr][colCurr],
          this.processItems[rowNext][colNext],
          new LeaderLine(el1, el2,
            {
              color: '#000000',
              outline: true,
              outlineColor : '#000000',
              endPlugOutline: true,
              endPlugSize: 1.1,
              startPlug : "disc",
              endPlug : "arrow2",
              startSocket : "right",
              endSocket : "left",
              path : "straight"
            })
          );
        this.connetions.push(conn);
      } else {
        console.log("PROBLEM");
        console.error('One or both elements not found');
      }


      if(this.indexRowDotCurr != this.indexColDotNext && this.indexColDotCurr != this.indexColDotNext){

      }
    }
  }

  dotHovered(indexRow:number,indexCol:number){
    this.indexRowDotCurr=indexRow;
    this.indexColDotCurr=indexCol;
  }

  dotNotHovered(){
    this.indexRowDotCurr=-1;
    this.indexColDotCurr=-1;
  }

  isDotLeftVisible(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1 && this.indexColDotCurr !=-1){
      if(indexCol == this.indexColDotCurr+1)
        return true;
    }
    return false;
  }

  isDotRightVisible(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1 && this.indexColDotCurr !=-1){
      if(indexRow == this.indexRowDotCurr && indexCol == this.indexColDotCurr)
        return true;
    }
    return false;
  }

  updateConnections(){
    this.connetions.forEach(connection=>{
      const elemFrom = document.getElementById(connection.getIdFrom());
      const elemTo = document.getElementById(connection.getIdTo());
      let fromRect;
      let toRect;
      let rectGrid;

      if(elemFrom!= null && elemTo !=null && this.grid.nativeElement != null){
        fromRect = elemFrom.getBoundingClientRect();
        toRect = elemTo.getBoundingClientRect();
        rectGrid = this.grid.nativeElement.getBoundingClientRect();
        //check the "From" cell is inside the Grid
        if(
          toRect.top>= rectGrid.top
          && toRect.left >= rectGrid.left
          && toRect.right <= rectGrid.right
          && toRect.bottom <= rectGrid.bottom
        )
        {
          //check the "To" cell is inside the Grid
          if(
            fromRect.top>= rectGrid.top
            && fromRect.left >= rectGrid.left
            && fromRect.right <= rectGrid.right
            && fromRect.bottom <= rectGrid.bottom
          )
          {
            connection.getLineConnection().show('draw',{
              duration : 1000,
              timing : "ease-out"
            });
            connection.getLineConnection().position();
          }
          else
            connection.getLineConnection().hide('none');
        }
        else
          connection.getLineConnection().hide('none',);
      }

    });
  }
}
