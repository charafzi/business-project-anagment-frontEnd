import { Component } from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzBadgeComponent} from "ng-zorro-antd/badge";

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  standalone: true,
    imports: [
        NzCardComponent,
        NzIconDirective,
        NgIf,
        NzTooltipDirective,
        NzBadgeComponent
    ],
  styleUrl: './circle.component.css'
})
export class CircleComponent extends BaseItem{

  constructor() {
    super();
    this._componentName= 'circle';
  }
}
