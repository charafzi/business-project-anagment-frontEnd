import { Component } from '@angular/core';
import {BaseItem} from "../item.model";
import {NgIf} from "@angular/common";
import {UserService} from "../../../../services/user.service";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";

@Component({
  selector: 'app-plus',
  templateUrl: './plus.component.html',
  standalone: true,
  imports: [
    NgIf,
    DemoNgZorroAntdModule
  ],
  styleUrl: './plus.component.css'
})
export class PlusComponent extends BaseItem{
  constructor(protected userService : UserService) {
    super();
    this._componentName='plus';
  }
}
