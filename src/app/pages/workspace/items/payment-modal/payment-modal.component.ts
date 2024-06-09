import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BaseEtape} from "../Etape.class";
import {Tache} from "../../../../models/tache.model";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {TacheService} from "../../../../services/tache.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Paiement} from "../../../../models/paiement.model";
import {NgForOf} from "@angular/common";
import {NzTabChangeEvent} from "ng-zorro-antd/tabs";

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  imports: [
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NgForOf,
  ],
  standalone: true,
  styleUrl: './payment-modal.component.css'
})


export class PaymentModalComponent implements OnInit, OnChanges{
  @Input('etape') etape! : BaseEtape;
  @Input('subTask') subTask! : Tache;
  @Input('isVisible') isVisible!:boolean;
  isLoading : boolean = true;
  fileList: NzUploadFile[] = [];
  paiementList : Paiement[] = [];
  reste : number = 0;
  payementForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private nzMessage : NzMessageService,
              private modalService : NzModalService,
              private tacheService : TacheService) {
    // @ts-ignore
    let date = new Date();
    this.payementForm = new FormGroup({
      statut : new FormControl('',Validators.required),
      datePaiement : new FormControl(date,Validators.required),
      total_a_payer : new FormControl(0,Validators.required),
      montant_payee : new FormControl(0,Validators.required),
      reste : new FormControl(0,[Validators.required,Validators.min(0)])
    })
  }


  onClickHideModal(){
    this.etape.paymentModalIsVisible=false;
  }

  validateForm(){
    if(this.payementForm.valid){
      // @ts-ignore
      let datePaiement : Date = new Date(this.payementForm.value.datePaiement);
      let total : number = this.payementForm.value.total_a_payer;
      let montant : number = this.payementForm.value.montant_payee;
      let reste = this.payementForm.value.reste;
      let etat : string =  this.payementForm.value.statut;

      const paiement : Paiement = {
        datePaiement : datePaiement,
        total_a_payer : total,
        montantPaye : montant,
        reste : reste,
        idPaiement : -1,
        etat : etat,
        justification : null,
      }
      if(this.subTask.idTache){
        this.tacheService.savePaiement(this.subTask.idTache,paiement)
          .subscribe(response=>{
              this.modalService.success({
                nzTitle : "Payment saved successfully !"
              })
            },
            error => {
              this.modalService.error({
                nzTitle : "Error at saving payment !",
                nzContent : "Error during saving, please try again"
              })
            })
      }else{
        console.error("Error : subTask id not defined !")
      }
      /*if(this.fileList.length>0){


      }else{
        this.nzMessage.warning('Justification is required before submitting !')
      }*/
    }else{
      Object.values(this.payementForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateRest(): void {
    const total_a_payer = this.payementForm.get('total_a_payer')?.value;
    const montant_payee = this.payementForm.get('montant_payee')?.value;

    if(montant_payee && total_a_payer){
      this.reste = total_a_payer - montant_payee;
      this.payementForm.get('reste')?.setValue(this.reste);
    }
  }

  ngOnInit(): void {
    this.payementForm.get('total_a_payer')?.valueChanges.subscribe(() => this.updateRest());
    this.payementForm.get('montant_payee')?.valueChanges.subscribe(() => this.updateRest());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.fetchPayments();
    }
  }

  fetchPayments(){
    this.isLoading=true;
    this.paiementList = [];
    if(this.subTask.idTache){
      this.tacheService.retrieveAllPayments(this.subTask.idTache)
        //convert string to Date for all dates in maintasks and subTasks
        .subscribe(paiements=>{
            paiements.forEach(paiement=>{
              // @ts-ignore
              paiement.datePaiement = new Date(paiement.datePaiement);
              this.paiementList.push(paiement);
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
    if (selectedIndex === 1) {
      this.fetchPayments();
    }
  }
}
