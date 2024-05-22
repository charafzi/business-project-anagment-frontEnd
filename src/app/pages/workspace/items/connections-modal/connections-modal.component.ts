import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzModalComponent, NzModalService} from "ng-zorro-antd/modal";
import {BaseEtape} from "../Etape.class";
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ConnexionService} from "../../../../services/connexion.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {B} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-connections-modal',
  templateUrl: './connections-modal.component.html',
  standalone: true,
  imports: [
    NzModalComponent,
    FormsModule,
    NgForOf,
    NzColDirective,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzOptionComponent,
    NzRowDirective,
    NzSelectComponent,
    ReactiveFormsModule,
    NzFormDirective,
    NzButtonComponent
  ],
  styleUrl: './connections-modal.component.css'
})
export class ConnectionsModalComponent implements OnInit, OnChanges{
  @Input('etape') etape! : BaseEtape;
  @Input('isVisible') isVisible!:boolean;
  etapes : BaseEtape [] = [];


  connectionsForm: FormGroup<{
    stepsBefore : FormControl<string[]>;
    stepsAfter : FormControl<string[]>;
  }>

  constructor(private fb: NonNullableFormBuilder,
              private connexionService : ConnexionService,
              private nzModalService : NzModalService) {
    this.connectionsForm = this.fb.group({
      stepsAfter : [['']],
      stepsBefore : [['']]
    })
  }
  onClickHideModal(){
    this.etape.connectionsModalIsVisibe=false;
  }

  ngOnInit(): void {

  }

  //update lists when this modal is visible
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      let etapesBefore : BaseEtape [] = [];
      let etapesAfter : BaseEtape [] = [];

      //get the actual etapes before and after this step
      etapesBefore = this.connexionService.getEtapesTo(this.etape.indexLigne,this.etape.indexColonne);
      etapesAfter = this.connexionService.getEtapesFrom(this.etape.indexLigne,this.etape.indexColonne);
      //initialize the list and selected values in form
      this.etapes = this.connexionService.getEtapesFromGrid();
      //remove this actual etapes from the list before and after
      let index = this.etapes.findIndex(etape => etape === this.etape);
      if (index !== -1) {
        this.etapes.splice(index, 1);
      }
      this.connectionsForm.controls['stepsBefore'].setValue(etapesBefore.map(item => `${item.indexLigne}-${item.indexColonne}`));
      this.connectionsForm.controls['stepsAfter'].setValue(etapesAfter.map(item => `${item.indexLigne}-${item.indexColonne}`));
    }
  }

  validateForm(){
    if(this.connectionsForm.valid){
      try{
        let originalBefore : string[] = [];
        let originalAfter : string[] = [];
        let beforeAdded : string[] = [];
        let afterAdded : string[] = [];
        let beforeDeleted : string[] = [];
        let afterDeleted : string[] = [];
        let result;

        //initialize original arrays
        this.connexionService.getEtapesTo(this.etape.indexLigne,this.etape.indexColonne).forEach(etape=>{
          originalBefore.push(etape.indexLigne+"-"+etape.indexColonne);
        });
        this.connexionService.getEtapesFrom(this.etape.indexLigne,this.etape.indexColonne).forEach(etape=>{
          originalAfter.push(etape.indexLigne+"-"+etape.indexColonne);
        });

        //detected added and deleted after steps
        originalAfter.forEach(item=>{
          if(!this.connectionsForm.value.stepsAfter?.includes(item))
            afterDeleted.push(item);
        })
        this.connectionsForm.value.stepsAfter?.forEach(item=>{
          if(!originalAfter.includes(item))
            afterAdded.push(item);
        })
        //detected added and deleted before steps
        originalBefore.forEach(item=>{
          if(!this.connectionsForm.value.stepsBefore?.includes(item))
            beforeDeleted.push(item);
        })
        this.connectionsForm.value.stepsBefore?.forEach(item=>{
          if(!originalBefore.includes(item))
            beforeAdded.push(item);
        })

        afterDeleted.forEach(item=>{
          let index : string[] = item.split("-");
          result = this.connexionService.deleteConnection(this.etape.indexLigne,this.etape.indexColonne,parseInt(index[0]),parseInt(index[1]));
        })

        beforeDeleted.forEach(item=>{
          let index : string[] = item.split("-");
          result =this.connexionService.deleteConnection(parseInt(index[0]),parseInt(index[1]),this.etape.indexLigne,this.etape.indexColonne);
        })

        afterAdded.forEach(item=>{
          let index : string[] = item.split("-");
          result =this.connexionService.createConnexion(this.etape.indexLigne,this.etape.indexColonne,parseInt(index[0]),parseInt(index[1]));
        })

        beforeAdded.forEach(item=>{
          let index : string[] = item.split("-");
          result = this.connexionService.createConnexion(parseInt(index[0]),parseInt(index[1]),this.etape.indexLigne,this.etape.indexColonne);
        })


        console.log("After :: ");
        console.log("Added")
        console.log(afterAdded);
        console.log("deleted")
        console.log(afterDeleted);

        console.log("Before :: ");
        console.log("Added")
        console.log(beforeAdded);
        console.log("deleted")
        console.log(beforeDeleted);
        /*this.nzModalService.success({
          nzTitle : "Connections updated successfully !"
        })*/
        this.onClickHideModal();
        this.nzModalService.success({
          nzTitle : "Connections updated successfully !"
        })
      }
      catch(error){
        this.nzModalService.error({
          nzTitle : "Error at updating connections please try again !"
        })
        console.log(error);
      }
    }

  }

}
