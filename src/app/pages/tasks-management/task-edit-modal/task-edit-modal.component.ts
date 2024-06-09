import { Component } from '@angular/core';
import {Travailleur} from "../../../models/travailleur.model";
import {SousTraitant} from "../../../models/sousTraitant.model";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TravailleurService} from "../../../services/travailleur.service";
import {SousTraitantService} from "../../../services/sousTraitant.service";
import {startDateLessThanEndDate} from "../../../validators/startDateLessThanEndDate";
import {TacheService} from "../../../services/tache.service";
import {DemoNgZorroAntdModule} from "../../../ng-zorro-antd.module";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrl: './task-edit-modal.component.css'
})
export class TaskEditModalComponent {
  agents : Travailleur[] = [];
  subContractors : SousTraitant[] = [];
  selectedAgents : number[] = [];
  selectedSubContractor : number = -1;
  radioSelected : string ='';

  taskEditForm!: FormGroup;

  constructor(private travailleurService : TravailleurService,
              private sousTraitantService : SousTraitantService,
              private tacheService : TacheService,
              private fb: FormBuilder) {
    this.travailleurService.retrieveAllTravailleurs()
      .subscribe(travailleurs=>{
          this.agents = travailleurs
        },
        error => {
          console.error('Error at retrieving Travailleurs from back-end : '+error)
        })

    this.sousTraitantService.retrieveAllSousTraitants()
      .subscribe(sousTraitants=>{
          this.subContractors = sousTraitants;
        },
        error => {
          console.error('Error at retrieving sousTraitants from back-end : '+error)
        })

    this.selectedSubContractor = -1;
    this.selectedAgents = [];
    // @ts-ignore
    let dateDebutPrevue = new Date(this.tacheService.tacheEdit.dateDebutPrevue);
    // @ts-ignore
    let dateExpiration = new Date(this.tacheService.tacheEdit.dateExpiration);
    if(this.tacheService.tacheEdit.sousTraitant){
      this.selectedSubContractor = this.tacheService.tacheEdit.sousTraitant.idUser;
      this.radioSelected = 'subContractor';
    }else{
      this.tacheService.tacheEdit.travailleurs?.forEach(agent=>{
        this.selectedAgents.push(agent.idUser);
        this.radioSelected = 'agent';
      })
    }

    this.taskEditForm = new FormGroup({
      objectOfTask: new FormControl(this.tacheService.tacheEdit.objetTache, [Validators.required, Validators.maxLength(255)]),
      targetStartingDate: new FormControl(dateDebutPrevue, [Validators.required]),
      expirationDate: new FormControl(dateExpiration, [Validators.required]),
      agent: new FormControl(this.selectedAgents, Validators.required),
      subContractor: new FormControl (this.selectedSubContractor, Validators.required),
      radioChoice: new FormControl(this.radioSelected, Validators.required)
    },{ validators: startDateLessThanEndDate });

    if(this.radioSelected === 'agent'){
      this.taskEditForm.get('agent')!.enable();
      this.taskEditForm.get('subContractor')!.disable();
      this.taskEditForm.get('subContractor')!.reset();
    }else{
      this.taskEditForm.get('agent')!.disable();
      this.taskEditForm.get('agent')!.reset();
      this.taskEditForm.get('subContractor')!.enable();
    }

    this.taskEditForm.get('radioChoice')!.valueChanges.subscribe((choice) => {
      if (choice === 'agent') {
        if(this.selectedAgents.length != 0){
          this.taskEditForm.patchValue({
            agent : this.selectedAgents
          });
        }
        this.taskEditForm.get('agent')!.enable();
        this.taskEditForm.get('subContractor')!.disable();
        this.taskEditForm.get('subContractor')!.reset();
      } else {
        if(this.selectedSubContractor != -1){
          this.taskEditForm.patchValue({
            subContractor: this.selectedSubContractor
          });
        }
        this.taskEditForm.get('agent')!.disable();
        this.taskEditForm.get('agent')!.reset();
        this.taskEditForm.get('subContractor')!.enable();
      }
    });

    if (this.taskEditForm.get('radioChoice')!.value === 'agent') {
      this.taskEditForm.get('subContractor')!.disable();
    }

    //disable the concerned fields when the first task is started
    if(this.tacheService.tacheEdit.sous_taches && this.tacheService.tacheEdit.sous_taches.length != 0){
      const dateDebutEffective = this.tacheService.tacheEdit.sous_taches.at(0)?.dateDebutEffective;
      if(dateDebutEffective){
        this.taskEditForm.get('objectOfTask')!.disable();
        this.taskEditForm.get('targetStartingDate')!.disable();
        this.taskEditForm.get('agent')!.disable();
        this.taskEditForm.get('subContractor')!.disable();
        this.taskEditForm.get('radioChoice')!.disable();
        this.taskEditForm.get('subContractor')!.disable();
        this.taskEditForm.get('agent')!.disable();
      }
    }
  }

}
