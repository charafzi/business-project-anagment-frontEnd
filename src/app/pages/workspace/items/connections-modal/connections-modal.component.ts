import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {BaseEtape} from "../Etape.class";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ConnexionService} from "../../../../services/connexion.service";
import {DurationUnite, getDurationUniteFromString} from "../../../../models/DurationUnite";
import {getstatutEtapeToString} from "../../../../models/StatutEtape";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {NzMessageService} from "ng-zorro-antd/message";


@Component({
  selector: 'app-connections-modal',
  templateUrl: './connections-modal.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
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
    stepsBeforeDetails: FormArray<FormGroup<{ step: FormControl<string>; delaiAttente: FormControl<number>; statut: FormControl<string>; radioDelaiAttente:FormControl<string>; }>>;
  }>

  constructor(private fb: NonNullableFormBuilder,
              private connexionService : ConnexionService,
              private nzModalService : NzModalService,
              private msg : NzMessageService) {
    this.connectionsForm = this.fb.group({
      stepsAfter: [['']],
      stepsBefore : [['']],
      stepsBeforeDetails: this.fb.array<FormGroup<{ step: FormControl<string>; delaiAttente: FormControl<number>; statut: FormControl<string>; radioDelaiAttente:FormControl<string>; }>>([])
    })

  }

  ngOnInit() {
    this.connectionsForm.get('stepsBefore')!.valueChanges.subscribe(values => {
      this.updateStepsBeforeDetails(values);
    });
  }

  updateStepsBeforeDetails(selectedSteps: string[]) {
    while (this.stepsBeforeDetails.length) {
      this.stepsBeforeDetails.removeAt(0);
    }
    selectedSteps.forEach(step => {
      let indexes : string[] = step.split("-");
      let delaiAttente : number = 0;
      let radioUnite = '';
      let statut:string = 'Terminée';
      let connetion = this.connexionService.getConnexion(parseInt(indexes[0]),parseInt(indexes[1]),this.etape.indexLigne,this.etape.indexColonne);
      if(connetion != undefined){
        delaiAttente = connetion.delaiAttente;
        statut = getstatutEtapeToString(connetion.statut.toString());
        switch (getDurationUniteFromString(connetion.delaiAttenteUnite.toString())){
          case DurationUnite.HOUR:
            radioUnite = 'H';
            break;
          case DurationUnite.MONTH:
            radioUnite ='M';
            break;
          case DurationUnite.DAY:
            radioUnite = 'D';
        }
        statut = getstatutEtapeToString(connetion.statut.toString());
      }
      this.stepsBeforeDetails.push(this.fb.group({
        step: this.fb.control(step),
        delaiAttente: this.fb.control(delaiAttente, Validators.required),
        statut: this.fb.control(statut, Validators.required),
        radioDelaiAttente : this.fb.control(radioUnite, Validators.required)
      }));
    });
  }

  get stepsBeforeDetails(): FormArray<FormGroup<{ step: FormControl<string>; delaiAttente: FormControl<number>; statut: FormControl<string>; radioDelaiAttente:FormControl<string>; }>> {
    return this.connectionsForm.get('stepsBeforeDetails') as FormArray<FormGroup<{ step: FormControl<string>; delaiAttente: FormControl<number>; statut: FormControl<string>; radioDelaiAttente:FormControl<string>; }>>;
  }

  getStepDescription(step: string): string {
    const [ligne, colonne] = step.split('-');
    const selectedStep = this.etapes.find(item => item.indexLigne === Number(ligne) && item.indexColonne === Number(colonne));
    return selectedStep ? selectedStep.description+' ('+selectedStep.categorie?.nom+')' : '';
  }

  onClickHideModal(){
    this.etape.connectionsModalIsVisibe=false;
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


        /*console.log("After :: ");
        console.log("Added")
        console.log(afterAdded);
        console.log("deleted")
        console.log(afterDeleted);

        console.log("Before :: ");
        console.log("Added")
        console.log(beforeAdded);
        console.log("deleted")
        console.log(beforeDeleted);*/
        //get values from the dynamic form
        const stepsBeforeDetailsValues = this.stepsBeforeDetails.value;
        this.stepsBeforeDetails.value.forEach(value => {
          let indexes = value.step?.split("-");
          let unite:DurationUnite = DurationUnite.DAY;
          switch (value.radioDelaiAttente){
            case 'H':
              unite = DurationUnite.HOUR;
              break;
            case 'M':
              unite = DurationUnite.MONTH;
              break;
            case 'D':
              unite = DurationUnite.DAY;
              break;
          }
          if(indexes)
            this.connexionService.updateConnexionValues(
              parseInt(indexes[0]),
              parseInt(indexes[1]),
              this.etape.indexLigne,
              this.etape.indexColonne,
              value.delaiAttente?? 0,
              unite,
              value.statut?? ''
              );
        })
        this.onClickHideModal();
        this.msg.success('Connections updated successfully');
      }
      catch(error){
        this.msg.error('Error at updating connections, please try again');
        console.error(error);
      }
    }
  }
}
