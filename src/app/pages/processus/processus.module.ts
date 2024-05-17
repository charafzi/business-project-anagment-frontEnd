import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ProcessusComponent} from "./processus.component";
import {DemoNgZorroAntdModule} from "../../ng-zorro-antd.module";

@NgModule({
  imports: [
    CommonModule,
    DemoNgZorroAntdModule,
  ],
  declarations: [
    ProcessusComponent,
  ],
  exports: [
    ProcessusComponent
  ]
})
export class ProcessusModule{}
