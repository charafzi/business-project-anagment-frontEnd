import { Component } from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  standalone: true,
  imports: [
    NzCardComponent,
    NzIconDirective
  ],
  styleUrl: './square.component.css'
})
export class SquareComponent {



}
