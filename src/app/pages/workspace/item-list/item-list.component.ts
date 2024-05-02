import { Component } from '@angular/core';
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {SquareComponent} from "../items/square/square.component";
import {RhombusComponent} from "../items/rhombus/rhombus.component";
import {Etape} from "../items/Etape.class";
import {CircleComponent} from "../items/circle/circle.component";
import {NzMenuDirective, NzSubMenuComponent} from "ng-zorro-antd/menu";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    SquareComponent,
    RhombusComponent,
    CircleComponent,
    NzMenuDirective,
    NzSubMenuComponent
  ],
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {
  items:Etape[] = [];
  constructor() {
    const square = new SquareComponent();
    square.message="YEs";
    this.items = [square,new RhombusComponent(),new CircleComponent()];

  }

}
