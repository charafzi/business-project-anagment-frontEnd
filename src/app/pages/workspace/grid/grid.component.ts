import {Component, ElementRef, Inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {BaseEtape} from "../items/Etape.class";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {DOCUMENT, NgClass} from "@angular/common";
import {Connection} from "./connection.class";
import LinkerLine from "linkerline";

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
  nbRows:number = 3;
  nbCols:number = 3;
  indexRowDotCurr:number =-1;
  indexColDotCurr:number =-1;
  indexRowDotNext:number =-1;
  indexColDotNext:number =-1;
  arrayRows = new Array(this.nbRows);
  arrayCols = new Array(this.nbCols);
  gridComponentInstance! : GridComponent;
  processItems:(BaseEtape | null)[][] = [];
  connetions : Connection[] = [];

  constructor(@Inject(DOCUMENT) private document:Document) {
    this.gridComponentInstance = this;
    setTimeout(() => {
    this.printProcessItems()

    }, 5000);
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
          console.log("["+i+"]["+j+"]NULL");
        } else {
          console.log("["+i+"]["+j+"] TYPE is at grid: " + (this.processItems[i][j] as BaseEtape).description);
        }
      }
    }
  }

  updateRefProcessItems(eventData:{processItem:BaseEtape ,rowIndex:number,colIndex:number})
  {
    this.processItems[eventData.rowIndex][eventData.colIndex] = eventData.processItem;
    this.printProcessItems();
  }

  getConnectionIndexByProcessItemIndex(rowIndex:number,colIndex:number){
    let index=0;
    for(let conn of this.connetions){
      if(conn.getFrom() == this.processItems[rowIndex][colIndex]
        || conn.getTo() == this.processItems[rowIndex][colIndex]
      ){
        return index;
      }
      index++;
    }
    // no connections found for this processItem
    return -1;
  }

  deleteRefProcessItems(eventData:{rowIndex:number,colIndex:number})
  {
    let index:number = this.getConnectionIndexByProcessItemIndex(eventData.rowIndex,eventData.colIndex);
    //delete all connections found
    while(index != -1){
      this.connetions[index].getLineConnection().remove();
      this.connetions.splice(index,1);
      index = this.getConnectionIndexByProcessItemIndex(eventData.rowIndex,eventData.colIndex);
    }
    console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"] BEFORE DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);
    this.processItems[eventData.rowIndex][eventData.colIndex] = null;
    console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"]  AFTER DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);
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

  dotLeftClicked(indexRow:number,indexCol:number){
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
      const grid = this.grid.nativeElement;
      if (el1 && el2 && this.processItems[rowCurr][colCurr]) {
        const conn :Connection = new Connection(
          idFrom,
          idTo,
          this.processItems[rowCurr][colCurr],
          this.processItems[rowNext][colNext],
          new LinkerLine<any, any>(
            {
              parent: grid,
              start: el1,
              end: el2,
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
        conn.getLineConnection().element.addEventListener('click', (event) => {
          console.log('Line clicked!', event);
        });
        this.printProcessItems();
      } else {
        console.error('One or both elements not found OR There is no processItem at ['+rowCurr+']['+colCurr+']');
      }
    }
  }

  getOrderByCell(rowIndex:number,colIndex:number){
    let order:number=1;
    let col:number=0;
    while (col!=colIndex){
      for(let i=0;i<this.nbRows;i++){
        if(this.processItems[i][col]!= null)
          order++;
      }
      col++;
    }

    for(let i=0;i<this.nbRows;i++){
      if(this.processItems[i][colIndex]!=null)
        order++;
    }
    return order;
  }

  dotRightHovered(indexRow:number,indexCol:number){
    if(this.processItems[indexRow][indexCol] != null){
      this.indexRowDotCurr=indexRow;
      this.indexColDotCurr=indexCol;
    }
  }

  dotNotHovered(){
    this.indexRowDotCurr=-1;
    this.indexColDotCurr=-1;
  }

  isDotLeftVisible(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1 && this.indexColDotCurr !=-1 && this.processItems[indexRow][indexCol]){
      if(indexCol == this.indexColDotCurr+1)
        return true;
    }
    return false;
  }

  isDotRightVisible(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1 && this.indexColDotCurr !=-1 && this.processItems[indexRow][indexCol]){
      if(indexRow == this.indexRowDotCurr && indexCol == this.indexColDotCurr)
        return true;
    }
    return false;
  }

  /*updateConnections(){
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
          (toRect.top>= rectGrid.top
          && toRect.left >= rectGrid.left
          && toRect.right <= rectGrid.right
          && toRect.bottom <= rectGrid.bottom)
          ||
          (fromRect.top>= rectGrid.top
            && fromRect.left >= rectGrid.left
            && fromRect.right <= rectGrid.right
            && fromRect.bottom <= rectGrid.bottom
          )
        )
        {
          //check the "To" cell is inside the Grid
          connection.getLineConnection().show('draw',{
            duration : 1000,
            timing : "ease-out"
          });
          connection.getLineConnection().position();
         /!* else
            connection.getLineConnection().hide('none');*!/
        }
        else
          connection.getLineConnection().hide('none',);
      }

    });
  }*/
}
