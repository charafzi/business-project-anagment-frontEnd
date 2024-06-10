import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BaseEtape} from "../Etape.class";
import {Tache} from "../../../../models/tache.model";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TacheService} from "../../../../services/tache.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Paiement} from "../../../../models/paiement.model";
import {NgForOf} from "@angular/common";
import {NzTabsCanDeactivateFn} from "ng-zorro-antd/tabs";
import {HttpClient} from "@angular/common/http";
import {NzImageService} from "ng-zorro-antd/image";

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
  uploadUrl : string = "http://localhost:8100/files/upload";
  getImageUrl : string = "http://localhost:8100/files/images/"
  isLoading : boolean = true;
  fileList: NzUploadFile[] = [];
  paiementList : Paiement[] = [];
  reste : number = 0;
  payementForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private http : HttpClient,
              private nzMessage : NzMessageService,
              private imageService : NzImageService,
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
    this.payementForm.reset();
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

      const fileCasted: File = this.fileList.at(0) as unknown as File;
      console.log(fileCasted.name)
      const paiement : Paiement = {
        datePaiement : datePaiement,
        total_a_payer : total,
        montantPaye : montant,
        reste : reste,
        idPaiement : -1,
        etat : etat,
        justification_url : fileCasted.name,
      }

      if(this.subTask.idTache){
        this.tacheService.savePaiement(this.subTask.idTache,paiement)
          .subscribe(response=>{
            this.nzMessage.success('Payment saved successfully')
            this.fileList = [];
            },
            error => {
            this.nzMessage.error('Error during saving, please try again')
            })
      }else{
        this.nzMessage.error('Error during saving, no subTask is selected')
        console.error("Error : subTask id not defined !")
      }
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

  beforeUpload = (file: NzUploadFile): boolean => {
    console.log(file)
    this.fileList = this.fileList.concat(file);

    const fileCasted: File = file as unknown as File;
    const formData = new FormData();
    formData.append('file',fileCasted,fileCasted.name);

    console.log('file name :'+fileCasted.name)
    this.http.post(this.uploadUrl, formData, { observe: 'response' }).subscribe(
      (response) => {
        if (response.status === 200) {
          this.nzMessage.success('File uploaded successfully');
        } else if (response.status === 400) {
          console.error('Response : '+response.statusText);
          this.nzMessage.error('No file is provided');
        } else {
          console.error('Response : '+response.statusText);
          this.nzMessage.error('Error at server, please try again ');
        }
      },
      (error) => {
        console.error('Upload error:', error);
        this.nzMessage.error('Error during upload : ' + (error.message || error.statusText));
      }
    );
    return false;
  };

  getJustificationImage(url:string){
    console.log("Image URL: " + this.getImageUrl + url);

    const images = [
      {
        src: this.getImageUrl+url,
        width: '200px',
        height: '200px',
        alt: 'justification'
      }
    ];
    this.imageService.preview(images, { nzZoom: 1.5, nzRotate: 0 });
  }

  canDeactivate: NzTabsCanDeactivateFn = (fromIndex: number, toIndex: number) => {
    switch (fromIndex) {
      case 0:
        console.log("at 0 :",fromIndex,'::',toIndex);
        return true;
      case 1:
        console.log("at 1 :",fromIndex,'::',toIndex);
        return true;
      case 2:
        console.log("at 2 :",fromIndex,'::',toIndex);
        return true;
      default:
        return true;
    }
  };
}
