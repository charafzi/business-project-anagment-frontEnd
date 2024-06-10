import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {RhombusComponent} from "./items/rhombus/rhombus.component";
import {GridComponent} from "./grid/grid.component";
import {ItemListComponent} from "./item-list/item-list.component";
import {CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {Processus} from "../../models/processus.model";
import {ProcessusService} from "../../services/processus.service";
import {RouterLink} from "@angular/router";
import {DemoNgZorroAntdModule} from "../../ng-zorro-antd.module";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    RhombusComponent,
    GridComponent,
    ItemListComponent,
    CdkDropList,
    CdkDropListGroup,
    RouterLink,
    NgIf
  ],
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent implements OnInit{
  @ViewChild('grid') appGrid!: GridComponent;
  isLoading:boolean = false;
  mode:number = 1;
  processName:string = '';
  processDesc:string = '';
  isCollapsed = false;


  constructor(private processusService:ProcessusService) {
    this.processName = this.processusService.processus.nom;
    this.processDesc = this.processusService.processus.description;
    this.mode = this.processusService.mode;
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
    if(this.appGrid)
      this.isLoading=this.appGrid.isLoading;
  }

  addRow(){
    this.appGrid.addRow();
  }

  addCol(){
    this.appGrid.addCol();
  }

  sauvegarder(){
    this.appGrid.sauvegarderEtapes();
  }

  setLoading(eventData:boolean){
    this.isLoading = eventData.valueOf();
  }

  updateProcessusValues(eventData:Processus){

  }
}
