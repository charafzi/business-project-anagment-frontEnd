import { Component } from '@angular/core';
import {BaseEtape} from "../Etape.class";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  standalone: true,
    imports: [
        NzCardComponent,
        NzIconDirective,
        NgIf
    ],
  styleUrl: './circle.component.css'
})
export class CircleComponent extends BaseItem{

  constructor() {
    super();
    this._componentName= 'circle';
  }


}
