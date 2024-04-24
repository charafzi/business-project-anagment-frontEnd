import { Component } from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  imports: [
    CellComponent,
    NzColDirective,
    NzRowDirective
  ],
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent {
  hGutter:number = 16;
  vGutter: number =16;
  nbRows:number = 5;
  nbCols:number = 5;
  arrayRows = new Array(this.nbRows);
  arrayCols = new Array(this.nbCols);
}
