import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {SquareComponent} from "./items/square/square.component";
import {RhombusComponent} from "./items/rhombus/rhombus.component";
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {GridComponent} from "./grid/grid.component";
import {ItemListComponent} from "./item-list/item-list.component";
import {CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  standalone: true,
  imports: [
    NzCardComponent,
    RhombusComponent,
    NzLayoutComponent,
    NzContentComponent,
    NzSiderComponent,
    GridComponent,
    ItemListComponent,
    CdkDropList,
    CdkDropListGroup,
    NzHeaderComponent,
    NzButtonComponent
  ],
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  @ViewChild('grid') appGrid!: GridComponent;

  addRow(){
    this.appGrid.addRow();
  }

  addCol(){
    this.appGrid.addCol();
  }
}
