import {Component, Input} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {BaseEtape} from "../Etape.class";
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  standalone: true,
  imports: [
    NzCardComponent,
    NzIconDirective,
    NgIf
  ],
  styleUrl: './square.component.css'
})
export class SquareComponent extends BaseItem {
  message:string='Test';

  constructor() {
    super();
    this._componentName='square';
  }



  onClick()
  {
    alert(this.message);
  }


}
