import {Component, Input, OnInit, setTestabilityGetter} from '@angular/core';
import {BaseEtape, EStatut, getStatutLabel} from "../Etape.class";
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective, NzModalRef} from "ng-zorro-antd/modal";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzTextareaCountComponent} from "ng-zorro-antd/input";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzProgressComponent} from "ng-zorro-antd/progress";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";

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
    NzOptionComponent
  ],
  styleUrl: './etape-display-modal.component.css'
})
export class EtapeDisplayModalComponent implements OnInit{
  @Input('etape') etape! : BaseEtape;
  @Input('isVisible') isVisible!:boolean;
  isModifiable:boolean = false;
  percent = 0;

  etapeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    etapeForm: FormGroup<{
      description:FormControl<string>;
      ordre: FormControl<number>;
      statut : FormControl<EStatut>;
      dureeEstimee: FormControl<number>;
      delaiAttente: FormControl<number>;
      isFirst:FormControl<boolean>;
      isEnd:FormControl<boolean>;
      isValidate:FormControl<boolean>;
      isPaid:FormControl<boolean>;
    }>
    this.etapeForm = this.fb.group({
      description : [this.etape.description,[Validators.required,Validators.maxLength(255)]],
      delaiAttente : [this.etape.délaiAttente,[Validators.required,Validators.min(0)]],
      dureeEstimee : [this.etape.duréeEstimée,[Validators.required,Validators.min(0)]],
      ordre : [this.etape.ordre,Validators.required],
      isStarted : [this.etape.isStarted ? 'Commencée' : 'Par encore commencée',Validators.required],
      isFirst : [this.etape.isFirst],
      isEnd : [this.etape.isEnd],
      isValidate : [this.etape.isValidate],
      isPaid : [this.etape.isPaid]
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
  onClickChangeModifiable(){
    this.isModifiable = !this.isModifiable;
  }

  validateForm(){
    if(this.etapeForm.valid){
      this.etape.description = this.etapeForm.value.description;
      this.etape.ordre=this.etapeForm.value.ordre;
      this.etape.pourcentage=this.percent;
      this.etape.duréeEstimée=this.etapeForm.value.dureeEstimee;
      this.etape.délaiAttente=this.etapeForm.value.delaiAttente;
      this.etape.isFirst=this.etapeForm.value.isFirst;
      this.etape.isEnd=this.etapeForm.value.isEnd;
      this.etape.isPaid=this.etapeForm.value.isPaid;
      this.etape.isValidate=this.etapeForm.value.isValidate;
      this.etape.isStarted = this.etapeForm.value.isStarted == 'Commencée';
      this.etape.onClickHideModal();
    }
  }



}
