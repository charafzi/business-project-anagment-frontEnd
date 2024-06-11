import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Routes,RouterModule} from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import {DatePipe, registerLocaleData} from '@angular/common';
import fr from '@angular/common/locales/fr';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClientJsonpModule, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {WorkspaceComponent} from "./pages/workspace/workspace.component";
import {SquareComponent} from "./pages/workspace/items/square/square.component";
import {RhombusComponent} from "./pages/workspace/items/rhombus/rhombus.component";
import {GridComponent} from "./pages/workspace/grid/grid.component";
import {CellComponent} from "./pages/workspace/grid/cell/cell.component";
import {CircleComponent} from "./pages/workspace/items/circle/circle.component";
import {WelcomeComponent} from "./pages/welcome/welcome.component";
import {ProcessusComponent} from "./pages/processus/processus.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';

import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {ProcessusModalComponent} from "./pages/processus/processus-modal/processus-modal.component";
import {ProcessusModule} from "./pages/processus/processus.module";
import {PlusComponent} from "./pages/workspace/items/plus/plus.component";
import {ItemListComponent} from "./pages/workspace/item-list/item-list.component";
import {HexagonComponent} from "./pages/workspace/items/hexagon/hexagon.component";
import {StatutTache} from "./models/StatutTache";
import {TasksManagementModule} from "./pages/tasks-management/tasks-management.module";
import {TasksManagementComponent} from "./pages/tasks-management/tasks-management.component";
import {
  SubTaskDisplayModalComponent
} from "./pages/workspace/items/sub-task-display-modal/sub-task-display-modal.component";
import {UserComponent} from "./pages/user/user.component";

registerLocaleData(fr);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

const appRoutes : Routes =[
  {path : '', component : WelcomeComponent },
  {path : 'workspace', component : WorkspaceComponent},
  {path : 'processus', component : ProcessusComponent},
  {path : 'tasks-management', component : TasksManagementComponent}
]


@NgModule({
    declarations: [
        AppComponent,
        UserComponent
    ],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ScrollingModule,
    DragDropModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    WorkspaceComponent,
    SquareComponent,
    RhombusComponent,
    CircleComponent,
    GridComponent,
    CellComponent,
    ItemListComponent,
    DemoNgZorroAntdModule,
    ProcessusModalComponent,
    ProcessusModule,
    PlusComponent,
    HexagonComponent,
    TasksManagementModule,
    SubTaskDisplayModalComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: fr_FR },
    { provide: NZ_ICONS, useValue: icons },
    { provide: DatePipe, useClass: DatePipe, deps: [] },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
