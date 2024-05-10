import {Injectable} from "@angular/core";
import {Type} from "../models/type.model";
import {HttpClient} from "@angular/common/http";
import {SquareComponent} from "../pages/workspace/items/square/square.component";
import {RhombusComponent} from "../pages/workspace/items/rhombus/rhombus.component";
import {CircleComponent} from "../pages/workspace/items/circle/circle.component";

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
        console.log("Error at fetching types from Database :" + error);
        }
      )
  }

  getAllTypes(){
    return this.http.get<Type[]>(this.url+"/alltypes");
  }

  getTypeByName(nom: string): Type | undefined {
    return this.types.find((type: Type) => type.nom === nom);
  }

  getTypeByComponentname(compName: string): string {
    const components: { [key: string]: string } = {
      'square': 'Type 1',
      'rhombus':  'Type 2',
      'circle': 'Type 3'
    };
    if (components[compName]) {
      return components[compName];
    }
    //default
    return 'Type 1';
  }

  getComponentByType(type: string): any {
    const components: { [key: string]: any } = {
      'Type 1': SquareComponent,
      'Type 2': RhombusComponent,
      'Type 3': CircleComponent
    };
    if (components[type]) {
      return components[type];
    }
    //default
    return SquareComponent;
  }

  getComponentNameByType(type: string): string {
    const components: { [key: string]: any } = {
      'Type 1': 'square',
      'Type 2': 'rhombus',
      'Type 3': 'circle'
    };
    if (components[type]) {
      return components[type];
    }
    //default
    return 'square';
  }

}
