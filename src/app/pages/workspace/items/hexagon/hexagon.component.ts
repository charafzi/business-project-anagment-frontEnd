import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-hexagon',
  templateUrl: './hexagon.component.html',
  standalone: true,
    imports: [
        NgIf,
       DemoNgZorroAntdModule
    ],
  styleUrl: './hexagon.component.css'
})
export class HexagonComponent extends BaseItem{

  constructor(protected userService : UserService) {
    super();
    this._componentName='hexagon';
  }
}
