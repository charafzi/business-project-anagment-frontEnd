import { Component } from '@angular/core';
import {BaseItem} from "../item.model";
import {NgIf} from "@angular/common";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzBadgeComponent} from "ng-zorro-antd/badge";

@Component({
  selector: 'app-plus',
  templateUrl: './plus.component.html',
  standalone: true,
    imports: [
        NgIf,
        NzIconDirective,
        NzTooltipDirective,
        NzCardComponent,
        NzBadgeComponent
    ],
  styleUrl: './plus.component.css'
})
export class PlusComponent extends BaseItem{

  constructor() {
    super();
    this._componentName='plus';
  }
}
