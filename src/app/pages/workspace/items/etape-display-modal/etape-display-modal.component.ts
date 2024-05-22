import {Component, Input, OnInit} from '@angular/core';
import {BaseEtape, StatutEtape, statutEtapeToString} from "../Etape.class";
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective, NzModalService} from "ng-zorro-antd/modal";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzTextareaCountComponent} from "ng-zorro-antd/input";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzProgressComponent} from "ng-zorro-antd/progress";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";

@Component({
  selector: 'app-etape-display-modal',
  templateUrl: './etape-display-modal.component.html',
  standalone: true,
    imports: [
        NzModalContentDirective,
        NzModalComponent,
        NzModalFooterDirective,
        NzButtonComponent,
        NzCheckboxComponent,
        NzColDirective,
        NzFormControlComponent,
        NzFormDirective,
        NzFormLabelComponent,
        NzInputDirective,
        NzInputNumberComponent,
        NzRowDirective,
        NzTextareaCountComponent,
        ReactiveFormsModule,
        NzProgressComponent,
        NzButtonGroupComponent,
        NzIconDirective,
        NzSelectComponent,
        NzOptionComponent,
        NzRadioComponent,
        NzRadioGroupComponent
    ],
  styleUrl: './etape-display-modal.component.css'
})
export class EtapeDisplayModalComponent implements OnInit{
  @Input('etape') etape! : BaseEtape;
  @Input('isVisible') isVisible!:boolean;
  isModifiable:boolean = false;
  percent = 0;
  etapeForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private modalService : NzModalService) {}

  ngOnInit(): void {
    etapeForm: FormGroup<{
      description:FormControl<string>;
      ordre: FormControl<number>;
      statutEtape : FormControl<string>;
      dureeEstimee: FormControl<number>;
      delaiAttente: FormControl<number>;
      isFirst:FormControl<boolean>;
      isEnd:FormControl<boolean>;
      isValidate:FormControl<boolean>;
      isPaid:FormControl<boolean>;
      radioDureeEstimee:FormControl<string>
      radioDelaiAttente:FormControl<string>;
      radioFIE:FormControl<string>;
    }>
    let perdiodDureeEstime = '';
    let perdiodDelaiAttente ='';
    let selectedFIE=';'
    //744 == 31 * 24 (Months to hours)

    if(this.etape.dureeEstimee%744 == 0)
    {
      this.etape.dureeEstimee/=744;
      perdiodDureeEstime = 'M';
    }
    else if(this.etape.dureeEstimee%24 ==0)
    {
      this.etape.dureeEstimee/=24;
      perdiodDureeEstime = 'D';
    }
    else
      perdiodDureeEstime = 'H'

    if(this.etape.delaiAttente%744 == 0)
    {
      this.etape.delaiAttente/=744;
      perdiodDelaiAttente = 'M';
    }
    else if(this.etape.delaiAttente%24 ==0)
    {
      this.etape.delaiAttente/=24;
      perdiodDelaiAttente = 'D';
    }
    else
      perdiodDelaiAttente = 'H'

    if(this.etape.first)
      selectedFIE = 'F';
    else if(this.etape.end)
      selectedFIE = 'E';
    else
      selectedFIE = 'I';

    this.etapeForm = this.fb.group({
      description : [this.etape.description,[Validators.required,Validators.maxLength(255)]],
      delaiAttente : [this.etape.delaiAttente,[Validators.min(0)]],
      dureeEstimee : [this.etape.dureeEstimee,[Validators.required,Validators.min(0)]],
      ordre : [this.etape.ordre,Validators.required],
      statutEtape : [statutEtapeToString(this.etape.statutEtape.toString()),Validators.required],
      isFirst : [this.etape.first],
      isEnd : [this.etape.end],
      isValidate : [this.etape.validate],
      isPaid : [this.etape.paid],
      radioDureeEstimee : [perdiodDureeEstime,[Validators.required]],
      radioDelaiAttente : [perdiodDelaiAttente,[Validators.required]],
      radioFIE : [selectedFIE,[Validators.required]]
    })
    this.percent=this.etape.pourcentage;
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
    if(this.etapeForm.valid){
      let periodDureeEstime = this.etapeForm.value.radioDureeEstimee;
      let periodDelaiAttente = this.etapeForm.value.radioDelaiAttente;
      let selectedFIE = this.etapeForm.value.radioFIE;
      let dureeEstime = 0;
      let delaiAttente = 0;
      this.etape.description = this.etapeForm.value.description;
      this.etape.ordre=this.etapeForm.value.ordre;
      this.etape.pourcentage=this.percent;
      this.etape.dureeEstimee=this.etapeForm.value.dureeEstimee;
      this.etape.delaiAttente=this.etapeForm.value.delaiAttente;
      this.etape.first=this.etapeForm.value.isFirst;
      this.etape.end=this.etapeForm.value.isEnd;
      this.etape.paid=this.etapeForm.value.isPaid;
      this.etape.validate=this.etapeForm.value.isValidate;
      this.etape.statutEtape = this.etapeForm.value.statutEtape == 'Commencée' ? StatutEtape.COMMENCEE: StatutEtape.PAS_ENCORE_COMMENCEE;
      switch (periodDureeEstime){
        case 'H':
          dureeEstime = this.etapeForm.value.dureeEstimee;
          break;
        case 'D':
          dureeEstime = this.etapeForm.value.dureeEstimee * 24;
          break;
        case 'M':
          dureeEstime = this.etapeForm.value.dureeEstimee * 24 * 31;
          break;
      }

      switch (periodDelaiAttente){
        case 'H':
          delaiAttente = this.etapeForm.value.delaiAttente;
          break;
        case 'D':
          delaiAttente = this.etapeForm.value.delaiAttente * 24;
          break;
        case 'M':
          delaiAttente = this.etapeForm.value.delaiAttente * 24 * 31;
          break;
      }

      this.etape.first = this.etape.intermediate = this.etape.end = false;
      switch (selectedFIE){
        case 'F':
          this.etape.first = true;
          break;
        case 'I':
          this.etape.intermediate = true;
          break;
        case 'E':
          this.etape.end = true;
          break;
      }
      this.etape.dureeEstimee = dureeEstime;
      this.etape.delaiAttente = delaiAttente;
      this.onClickHideModal();
      this.modalService.success({
        nzTitle : "Step modified successfully !"
      })
    }
  }

  onClickHideModal(){
    this.etape.editModalIsVisibe=false;
  }

}
