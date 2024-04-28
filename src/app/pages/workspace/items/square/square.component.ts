import {Component, Input} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {BaseProcessItem, ProcessItem} from "../processItem.class";
import {NgIf} from "@angular/common";

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
export class SquareComponent extends BaseProcessItem{
  message:string='Test';

  constructor() {
    super();
    this.type = 'square';
  }


  getType(): string {
    return this.type;
  }

  onClick()
  {
    alert(this.message);
  }


}
