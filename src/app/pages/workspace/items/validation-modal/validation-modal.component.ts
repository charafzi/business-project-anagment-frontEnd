import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BaseEtape} from "../Etape.class";
import {Tache} from "../../../../models/tache.model";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {NgForOf} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {TacheService} from "../../../../services/tache.service";
import {Validation} from "../../../../models/validation.model";
import {NzTabChangeEvent} from "ng-zorro-antd/tabs";

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NgForOf,
  ],
  styleUrl: './validation-modal.component.css'
})
export class ValidationModalComponent implements OnChanges{
  @Input('etape') etape! : BaseEtape;
  @Input('subTask') subTask! : Tache;
  @Input('isVisible') isVisible!:boolean;
  isLoading : boolean = true;
  validationList : Validation[] = [];
  validationForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private nzMessage : NzMessageService,
              private modalService : NzModalService,
              private tacheService : TacheService) {
    // @ts-ignore
    let date = new Date();
    this.validationForm = new FormGroup({
      statut : new FormControl('',Validators.required),
      dateValidation : new FormControl(date,Validators.required),
      commentaire : new FormControl('',[Validators.required,Validators.maxLength(255)]),
    })
  }

  onClickHideModal(){
    this.etape.validationModalIsVisible=false;
  }

  validateForm(){
    if(this.validationForm.valid){
      // @ts-ignore
      let dateValidation : Date = new Date(this.validationForm.value.dateValidation);
      let commentaire: string = this.validationForm.value.commentaire;
      let etat : string =  this.validationForm.value.statut;

      let validation: Validation = {
        idValidation : -1,
        dateValidation: dateValidation,
        commentaire: commentaire,
        etat: etat,
        responsable: {
          idUser : 3,
          nom : '',
          role : '',
          prenom : '',
          numTel : '',
          email : '',
          taches : [],
          matricule : '',
        }
      };
      if(this.subTask.idTache){
        this.tacheService.saveValidation(this.subTask.idTache,validation)
          .subscribe(response=>{
              this.modalService.success({
                nzTitle : "Validation saved successfully !"
              })
              this.fetchValidations();
            },
            error => {
              this.modalService.error({
                nzTitle : "Error at saving validation !",
                nzContent : "Error during saving, please try again"
              })
            })
      }else{
        console.error("Error : subTask id not defined !")
      }
    }else{
      Object.values(this.validationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.fetchValidations();
    }
  }

  fetchValidations(){
    this.isLoading=true;
    this.validationList = [];
    if(this.subTask.idTache){
      this.tacheService.retrieveAllValidations(this.subTask.idTache)
        //convert string to Date for all dates in maintasks and subTasks
        .subscribe(validations=>{
            validations.forEach(validation=>{
              // @ts-ignore
              validation.dateValidation = new Date(validation.dateValidation);
              this.validationList.push(validation);
            })
            this.isLoading=false;
          },
          error => {
            console.error('Error at fetching Tasks from back-end '+error);
          })
    }
  }

  onTabChanged(event: NzTabChangeEvent): void {
    const selectedIndex = event.index;
    if(selectedIndex === 1){
      this.fetchValidations();
    }
  }

}
