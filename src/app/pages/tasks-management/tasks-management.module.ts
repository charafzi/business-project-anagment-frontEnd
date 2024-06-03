import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {DemoNgZorroAntdModule} from "../../ng-zorro-antd.module";
import {TasksManagementComponent} from "./tasks-management.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        DemoNgZorroAntdModule,
        ReactiveFormsModule,
    ],
  declarations: [
    TasksManagementComponent,
  ],
  exports: [
    TasksManagementComponent
  ]
})
export class TasksManagementModule{

}
