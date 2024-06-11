import {Component, Input, OnInit} from '@angular/core';
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {SquareComponent} from "../items/square/square.component";
import {RhombusComponent} from "../items/rhombus/rhombus.component";
import {CircleComponent} from "../items/circle/circle.component";
import {TypeService} from "../../../services/type.service";
import {Type} from "../../../models/type.model"
import {NgForOf, NgIf} from "@angular/common";
import {BaseItem} from "../items/item.model";
import {PlusComponent} from "../items/plus/plus.component";
import {HexagonComponent} from "../items/hexagon/hexagon.component";
import {DemoNgZorroAntdModule} from "../../../ng-zorro-antd.module";
import {UserService} from "../../../services/user.service";

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
    DemoNgZorroAntdModule,
    NgForOf,
    NgIf,
    PlusComponent,
    HexagonComponent
  ],
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit{
  types:Type[] = []
  items:BaseItem[] = [];
  @Input('isCollapsed') isCollapsed:boolean = false;
  isLoading:boolean=false;
  constructor(protected typeService:TypeService,
              protected userService : UserService) {

  }

  ngOnInit(): void {
    this.isLoading=true;
    this.typeService.getAllTypes()
      .subscribe(types=>{
        this.types = types;
        this.types.forEach(type=>{

          switch (this.typeService.getComponentNameByType(type.nom)){
            case 'square':
              this.items.push(new SquareComponent(this.userService));
              break;
            case 'rhombus':
              this.items.push(new RhombusComponent(this.userService));
              break;
            case 'circle':
              this.items.push(new CircleComponent(this.userService));
              break;
            case 'plus':
              this.items.push(new PlusComponent(this.userService));
              break;
            case 'hexagon':
              this.items.push(new HexagonComponent(this.userService));
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

  getToolTipInfo(componentName:string){
    return this.typeService.getTypeByComponentname(componentName);
  }
}
