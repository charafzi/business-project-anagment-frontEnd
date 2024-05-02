import { Component } from '@angular/core';
import {BaseEtape, Etape} from "../Etape.class";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NgIf} from "@angular/common";

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
export class CircleComponent extends BaseEtape{

  constructor() {
    super();
    this.type = 'circle';
  }
  getType(): string {
    return this.type;
  }

}
