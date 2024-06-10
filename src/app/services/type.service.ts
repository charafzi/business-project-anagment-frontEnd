import {Injectable} from "@angular/core";
import {Type} from "../models/type.model";
import {HttpClient} from "@angular/common/http";
import {SquareComponent} from "../pages/workspace/items/square/square.component";
import {RhombusComponent} from "../pages/workspace/items/rhombus/rhombus.component";
import {CircleComponent} from "../pages/workspace/items/circle/circle.component";
import {PlusComponent} from "../pages/workspace/items/plus/plus.component";
import {HexagonComponent} from "../pages/workspace/items/hexagon/hexagon.component";

@Injectable({providedIn : "root"})
export class TypeService{
  url:string = "http://localhost:8100/types";
  types:Type[] = [];


  constructor(private http:HttpClient) {
    this.getAllTypes()
      .subscribe(types=>{
        this.types=types;
      },
        error => {
        console.error("Error at fetching types from back-end :" + error);
        }
      )
  }

  getAllTypes(){
    return this.http.get<Type[]>(this.url+"/alltypes");
  }

  getTypeByName(nom: string): Type | null{
    return this.types.find((type: Type) => type.nom === nom) || null;
  }

  getTypeByComponentname(compName: string): string {
    const components: { [key: string]: string } = {
      'square': 'Survey',
      'rhombus':  'Acceptance',
      'circle': 'Inspection',
      'plus' : 'Corrective',
      'hexagon' : 'Preventive'
    };
    if (components[compName]) {
      return components[compName];
    }
    //default
    return 'Survey';
  }

  getComponentByType(type: string): any {
    const components: { [key: string]: any } = {
      'Survey': SquareComponent,
      'Acceptance': RhombusComponent,
      'Inspection': CircleComponent,
      'Corrective' : PlusComponent,
      'Preventive' : HexagonComponent
    };
    if (components[type]) {
      return components[type];
    }
    //default
    return SquareComponent;
  }

  getComponentNameByType(type: string): string {
    const components: { [key: string]: any } = {
      'Survey': 'square',
      'Acceptance': 'rhombus',
      'Inspection': 'circle',
      'Corrective' : 'plus',
      'Preventive':'hexagon'
    };
    if (components[type]) {
      return components[type];
    }
    //default
    return 'square';
  }

}
