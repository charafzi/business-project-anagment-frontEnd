import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DemoNgZorroAntdModule} from "../../../ng-zorro-antd.module";
import {NgForOf} from "@angular/common";
import {Processus} from "../../../models/processus.model";
import {ProcessusService} from "../../../services/processus.service";
import {TravailleurService} from "../../../services/travailleur.service";
import {Travailleur} from "../../../models/travailleur.model";

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  processus : Processus[] = [];
  travailleurs: Travailleur[] = [];
  taskForm: FormGroup<{
    processus : FormControl<string[]>;
    objectOfTask:FormControl<string>;
    targetStartingDate : FormControl<Date | null>;
    expirationDate : FormControl<Date | null>;
    agent : FormControl<string[]>;
    subContractor : FormControl<number>;
    radioChoice : FormControl<string>;
  }> = this.fb.group({
    processus : this.fb.control<string[]>([],Validators.required),
    objectOfTask: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
    targetStartingDate: this.fb.control<Date | null>(null, [Validators.required]),
    expirationDate: this.fb.control<Date | null>(null, [Validators.required]),
    agent: this.fb.control<string[]>([], Validators.required),
    subContractor: this.fb.control<number | null>(null, Validators.required),
    radioChoice: this.fb.control<string>('agent')
  }) as FormGroup<{
    processus : FormControl<string[]>
    objectOfTask: FormControl<string>;
    targetStartingDate: FormControl<Date | null>;
    expirationDate: FormControl<Date | null>;
    agent: FormControl<string[]>;
    subContractor: FormControl<number>;
    radioChoice: FormControl<string>;
  }>;


  constructor(private modalRef: NzModalRef,
              private processusService : ProcessusService,
              private travailleurService : TravailleurService,
              private fb: FormBuilder) {
    this.processusService.retrieveAllProcessus()
      .subscribe(processus=>{
        this.processus = processus;
      },
      error => {
        console.error('Error at retrieving processus from back-end : '+error)
      })

    this.travailleurService.retrieveAllTravailleurs()
      .subscribe(travailleurs=>{
        this.travailleurs = travailleurs
      },
        error => {
          console.error('Error at retrieving Travailleurs from back-end : '+error)
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
