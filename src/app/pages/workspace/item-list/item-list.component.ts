import {Component, OnInit} from '@angular/core';
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {SquareComponent} from "../items/square/square.component";
import {RhombusComponent} from "../items/rhombus/rhombus.component";
import {CircleComponent} from "../items/circle/circle.component";
import {NzMenuDirective, NzSubMenuComponent} from "ng-zorro-antd/menu";
import {BaseEtape} from "../items/Etape.class";
import {TypeService} from "../../../services/type.service";
import {Type} from "../../../models/type.model"
import {ItemComponentService} from "../../../services/itemComponent.service";
import {NgForOf, NgIf} from "@angular/common";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {BaseItem} from "../items/item.model";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";

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
    NzSubMenuComponent,
    NgForOf,
    NgIf,
    NzSpinComponent,
    NzTooltipDirective
  ],
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit{
  types:Type[] = []
  items:BaseItem[] = [];
  isLoading:boolean=false;
  constructor(protected typeService:TypeService,
              protected itemComponentService: ItemComponentService) {

  }

  ngOnInit(): void {
    this.isLoading=true;
    this.typeService.getAllTypes()
      .subscribe(types=>{
        this.types = types;
        this.types.forEach(type=>{
          console.log("TYPE : "+type.nom)
          console.log('Component : '+this.typeService.getComponentNameByType(type.nom));
          //console.log('Component : '+this.itemComponentService.createComponentByName(this.typeService.getComponentNameByType(type.nom)));

          switch (this.typeService.getComponentNameByType(type.nom)){
            case 'square':
              this.items.push(new SquareComponent());
              break;
            case 'rhombus':
              this.items.push(new RhombusComponent());
              break;
            case 'circle':
              this.items.push(new CircleComponent());
              break;
            default:
              throw new Error('Error at item-list : Unknown component name for type :'+type.nom);
          }
        })
      },
        error => {
        console.error("Error at fetching types in item-list : "+error);
        },
        ()=>{
        this.isLoading=false;
        }
      )
  }
}
