import { Component } from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {SquareComponent} from "./items/square/square.component";
import {RhombusComponent} from "./items/rhombus/rhombus.component";
import {NzContentComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {GridComponent} from "./grid/grid.component";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  standalone: true,
  imports: [
    NzCardComponent,
    SquareComponent,
    RhombusComponent,
    NzLayoutComponent,
    NzContentComponent,
    NzSiderComponent,
    GridComponent
  ],
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {

}
