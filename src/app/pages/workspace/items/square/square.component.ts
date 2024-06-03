import {Component, Input} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {BaseEtape} from "../Etape.class";
import {NgIf} from "@angular/common";
import {BaseItem} from "../item.model";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {getstatutTacheToString} from "../../../../models/StatutTache";
import {NzBadgeComponent, NzRibbonComponent} from "ng-zorro-antd/badge";
import {NzTypographyComponent} from "ng-zorro-antd/typography";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  standalone: true,
  imports: [
    NzCardComponent,
    NzIconDirective,
    NgIf,
    NzTooltipDirective,
    NzBadgeComponent,
    NzRibbonComponent,
    NzTypographyComponent
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


  protected readonly getstatutTacheToString = getstatutTacheToString;
}
