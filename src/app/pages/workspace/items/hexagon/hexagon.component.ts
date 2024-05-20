import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {BaseItem} from "../item.model";

@Component({
  selector: 'app-hexagon',
  templateUrl: './hexagon.component.html',
  standalone: true,
  imports: [
    NgIf,
    NzCardComponent,
    NzIconDirective,
    NzTooltipDirective
  ],
  styleUrl: './hexagon.component.css'
})
export class HexagonComponent extends BaseItem{

  constructor() {
    super();
    this._componentName='hexagon';
  }

}
