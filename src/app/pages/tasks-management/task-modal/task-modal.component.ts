import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule, ValidatorFn,
  Validators
} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DemoNgZorroAntdModule} from "../../../ng-zorro-antd.module";
import {NgForOf, NgIf} from "@angular/common";
import {Processus} from "../../../models/processus.model";
import {ProcessusService} from "../../../services/processus.service";
import {TravailleurService} from "../../../services/travailleur.service";
import {Travailleur} from "../../../models/travailleur.model";
import {SousTraitant} from "../../../models/sousTraitant.model";
import {SousTraitantService} from "../../../services/sousTraitant.service";
import {startDateLessThanEndDate} from "../../../validators/startDateLessThanEndDate";

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  processus : Processus[] = [];
  agents : Travailleur[] = [];
  subContractors : SousTraitant[] = [];

  taskForm!: FormGroup;


  constructor(private modalRef: NzModalRef,
              private processusService : ProcessusService,
              private travailleurService : TravailleurService,
              private sousTraitantService : SousTraitantService,
              private fb: FormBuilder) {
    this.taskForm = new FormGroup({
      processus: new FormControl(null, Validators.required),
      objectOfTask: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      targetStartingDate: new FormControl(null, [Validators.required]),
      expirationDate: new FormControl(null, [Validators.required]),
      agent: new FormControl([], Validators.required),
      subContractor: new FormControl (null, Validators.required),
      radioChoice: new FormControl('agent', Validators.required)
    },{ validators: startDateLessThanEndDate });
    /*this.taskForm = this.fb.group({
      processus: [],
      objectOfTask: ['', [Validators.required, Validators.maxLength(255)]],
      targetStartingDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
      agent: [[], Validators.required],
      subContractor: [null, Validators.required],
      radioChoice: ['agent', Validators.required]
    });*/

    this.processusService.retrieveAllProcessus()
      .subscribe(processus=>{
        this.processus = processus;
      },
      error => {
        console.error('Error at retrieving processus from back-end : '+error)
      })

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

    this.taskForm.get('radioChoice')!.valueChanges.subscribe((choice) => {
      if (choice === 'agent') {
        this.taskForm.get('agent')!.enable();
        this.taskForm.get('subContractor')!.disable();
        this.taskForm.get('subContractor')!.reset();
      } else {
        this.taskForm.get('agent')!.disable();
        this.taskForm.get('agent')!.reset();
        this.taskForm.get('subContractor')!.enable();
      }
    });

    if (this.taskForm.get('radioChoice')!.value === 'agent') {
      this.taskForm.get('subContractor')!.disable();
    }
  }
}
