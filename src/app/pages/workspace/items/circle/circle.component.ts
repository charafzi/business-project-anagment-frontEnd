import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {UserService} from "../../../../services/user.service";

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

  constructor(protected userService : UserService) {
    super();
    this._componentName= 'circle';
  }
}
