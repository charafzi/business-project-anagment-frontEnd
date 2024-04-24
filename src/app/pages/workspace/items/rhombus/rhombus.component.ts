import { Component } from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-rhombus',
  templateUrl: './rhombus.component.html',
  standalone: true,
  imports: [
    NzCardComponent,
    NzIconDirective
  ],
  styleUrl: './rhombus.component.css'
})
export class RhombusComponent {

}
