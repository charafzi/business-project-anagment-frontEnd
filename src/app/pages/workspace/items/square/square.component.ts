import {Component} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    NgIf
  ],
  styleUrl: './square.component.css'
})
export class SquareComponent extends BaseItem {
  message:string='Test';

  constructor(protected userService : UserService) {
    super();
    this._componentName='square';
  }
}
