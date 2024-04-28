import { Component } from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {BaseProcessItem, ProcessItem} from "../processItem.class";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-rhombus',
  templateUrl: './rhombus.component.html',
  standalone: true,
  imports: [
    NzCardComponent,
    NzIconDirective,
    NzTooltipDirective,
    NgIf
  ],
  styleUrl: './rhombus.component.css'
})
export class RhombusComponent extends BaseProcessItem{

  constructor() {
    super();
    this.type = 'rhombus';
  }

  getType(): string {
    return this.type;
  }


}
