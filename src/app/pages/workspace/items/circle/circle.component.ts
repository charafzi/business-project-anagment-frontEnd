import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  standalone: true,
    imports: [
        DemoNgZorroAntdModule,
        NgIf,
    ],
  styleUrl: './circle.component.css'
})
export class CircleComponent extends BaseItem{

  constructor() {
    super();
    this._componentName= 'circle';
  }
}
