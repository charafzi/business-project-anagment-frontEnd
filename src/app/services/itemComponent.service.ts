import {ComponentFactoryResolver, ComponentRef, Injectable} from "@angular/core";
import {TypeService} from "./type.service";
import {CircleComponent} from "../pages/workspace/items/circle/circle.component";
import {RhombusComponent} from "../pages/workspace/items/rhombus/rhombus.component";
import {SquareComponent} from "../pages/workspace/items/square/square.component";

@Injectable({
  providedIn : "root"
})
export class ItemComponentService{

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private typeService : TypeService) {}

  createComponentByName(componentName: string): ComponentRef<any> {
    let componentFactory: any;

    // Determine which component to create based on the componentName
    switch (componentName) {
      case 'square':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(SquareComponent);
        break;
      case 'rhombus':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RhombusComponent);
        break;
      case 'circle':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(CircleComponent);
        break;
      default:
        // return null
        throw new Error(`Error at itemComponentService : Unknown component name: ${componentName}`);
    }

    // Create and return the component dynamically
    return componentFactory.create();
  }


}
