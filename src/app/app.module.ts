import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NzCardModule } from 'ng-zorro-antd/card';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import {WorkspaceComponent} from "./pages/workspace/workspace.component";
import {SquareComponent} from "./pages/workspace/items/square/square.component";
import {RhombusComponent} from "./pages/workspace/items/rhombus/rhombus.component";
import {GridComponent} from "./pages/workspace/grid/grid.component";
import {CellComponent} from "./pages/workspace/grid/cell/cell.component";

registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    NzCardModule,
    WorkspaceComponent,
    SquareComponent,
    RhombusComponent,
    GridComponent,
    CellComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: fr_FR },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
