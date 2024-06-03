import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {BaseEtape} from "../Etape.class";
import {Tache} from "../../../../models/tache.model";
import {getStatutTacheFromString} from "../../../../models/StatutTache";
import {getPrioriteFromString} from "../../../../models/Priorite";
import {NzModalService} from "ng-zorro-antd/modal";
import {TacheService} from "../../../../services/tache.service";

@Component({
  selector: 'app-sub-task-display-modal',
  templateUrl: './sub-task-display-modal.component.html',
  imports: [
    DemoNgZorroAntdModule,
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  standalone: true,
  styleUrl: './sub-task-display-modal.component.css'
})
export class SubTaskDisplayModalComponent implements OnChanges{
  @Input('etape') etape! : BaseEtape;
  @Input('subTask') subTask! : Tache;
  @Input('isVisible') isVisible!:boolean;
  percent : number = 0;
  taskForm!: FormGroup;
  constructor(private fb: FormBuilder,
              private modalService : NzModalService,
              private tacheService : TacheService) {
    this.taskForm = new FormGroup({
      categorie : new FormControl(''),
      description : new FormControl(''),
      statutTache : new FormControl(''),
      dateDebutPrevue : new FormControl({value : '', disabled : true}),
      dateExpiration : new FormControl({value : '', disabled : true}),
      dateDebutEffective : new FormControl(''),
      dateFinEffective : new FormControl(''),
      travailleurs : new FormControl([]),
      sousTraiatant : new FormControl(null),
      priorite : new FormControl('')
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.initializeForm();
    }
  }

  initializeForm(){
    this.taskForm.patchValue({
      description : this.etape.description,
      categorie : this.etape.categorie?.nom,
      dateDebutPrevue : this.subTask.dateDebutPrevue,
      dateExpiration : this.subTask.dateExpiration,
      dateDebutEffective : this.subTask.dateDebutEffective,
      dateFinEffective : this.subTask.dateFinEffective,
      statutTache : this.subTask.statutTache ? this.subTask.statutTache.toString() : '',
      priorite : this.subTask.priorite? this.subTask.priorite.toString() : ''
    });
    this.subTask.pourcentage ? this.percent = this.subTask.pourcentage : this.percent=0;
  }

  onClickHideModal(){
    this.etape.subTaskModalIsVisibe=false;
  }

  increase(): void {
    this.percent = this.percent + 10;
    if (this.percent > 100) {
      this.percent = 100;
    }
  }

  decline(): void {
    this.percent = this.percent - 10;
    if (this.percent < 0) {
      this.percent = 0;
    }
  }

  validateForm(){
    if(this.taskForm.valid){
      const modalRef = this.modalService.confirm({
        nzTitle : 'Are you sure about updating this task ?',
        nzOkText : 'Confirm',
        nzCancelText : 'Cancel',
        nzOnOk : ()=>{
          try{
            let status = this.taskForm.value.statutTache;
            let priorite = this.taskForm.value.priorite;



            this.subTask.statutTache = getStatutTacheFromString(status);
            this.subTask.priorite = getPrioriteFromString(priorite);
            this.subTask.pourcentage = this.percent;
            this.subTask.dateDebutEffective = this.taskForm.value.dateDebutEffective;
            this.subTask.dateFinEffective = this.taskForm.value.dateFinEffective;

            let subTask : Tache ={
              idTache : this.subTask.idTache,
              statutTache : this.subTask.statutTache,
              priorite : this.subTask.priorite,
              pourcentage : this.subTask.pourcentage,
              dateDebutEffective : this.subTask.dateDebutPrevue,
              dateFinEffective : this.subTask.dateFinEffective
            }

            this.tacheService.updateSousTache(subTask)
              .subscribe(response=>{
                this.modalService.success({
                  nzTitle : 'Task updated successfully !'
                })
              },
                error => {
                  this.modalService.error({
                    nzTitle : "Unable to update this task !",
                    nzContent : "Problem in server, please try again later"
                  })
                  console.error(error)
              })
          }
          catch (error) {
            this.modalService.error({
              nzTitle : "Unable to update this task !",
              nzContent : "Problem during update, please try again"
            })
            console.error(error);
          }
        },
        nzOnCancel : ()=>{
          modalRef.close();
        }
      })
    }
  }

}
