import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzModalComponent, NzModalContentDirective, NzModalRef} from "ng-zorro-antd/modal";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {
  NzInputDirective,
  NzInputGroupComponent,
  NzInputGroupWhitSuffixOrPrefixDirective,
  NzTextareaCountComponent
} from "ng-zorro-antd/input";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzFormControlComponent, NzFormDirective, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ConnexionService} from "../../../../services/connexion.service";
import {BaseEtape} from "../Etape.class";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-etape-modal',
  templateUrl: './etape-modal.component.html',
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NzButtonComponent,
    NzRowDirective,
    NzColDirective,
    FormsModule,
    NzInputDirective,
    NzIconDirective,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzInputGroupComponent,
    NzTooltipDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzTextareaCountComponent,
    NzFormLabelComponent,
    ReactiveFormsModule,
    NzCheckboxComponent,
    NzInputNumberComponent,
    NzRadioGroupComponent,
    NzRadioComponent,
    NzSelectComponent,
    NzOptionComponent,
    NgForOf
  ],
  styleUrl: './etape-modal.component.css'
})
export class EtapeModalComponent implements OnInit{
  @Output() formDataConfirmed: EventEmitter<any> = new EventEmitter<any>();
  etapes : BaseEtape [] = [];
  etapeForm: FormGroup<{
    description:FormControl<string>;
   // ordre: FormControl<number>;
    //pourcentage: FormControl<string>;
    dureeEstimee: FormControl<number>;
    delaiAttente: FormControl<number>;
    isValidate:FormControl<boolean>;
    isPaid:FormControl<boolean>;
    radioDureeEstimee:FormControl<string>
    radioDelaiAttente:FormControl<string>;
    radioFIE:FormControl<string>;
    stepsBefore : FormControl<string[]>;
    stepsAfter : FormControl<string[]>;
  }>
  /*description: (string | null)=null;
  ordre: number=0;
  pourcentage: number=0;
  duréeEstimée: number=0;
  délaiAttente: number=0;
  isFirst: boolean=false;
  isEnd: boolean=false;
  isValidate: boolean=false;
  isPaid: boolean=false;*/

  isVisible:boolean = false;



  constructor(private modalRef: NzModalRef,
              private fb: NonNullableFormBuilder,
              private connexionService : ConnexionService) {
    this.etapeForm = this.fb.group({
      description : ['',[Validators.required,Validators.maxLength(255)]],
      dureeEstimee : [1,[Validators.required,Validators.min(0)]],
      delaiAttente : [0,[Validators.min(0)]],
      isValidate : [false],
      isPaid : [false],
      radioDureeEstimee : ['',[Validators.required]],
      radioDelaiAttente : ['',[Validators.required]],
      radioFIE : ['',[Validators.required]],
      stepsAfter : [['']],
      stepsBefore : [['']]
    })
  }

  ngOnInit(): void {
    this.etapes = this.connexionService.getEtapesFromGrid();
  }

  formIsValid(): boolean {
    if (this.etapeForm.valid) {
      return true;
    } else
    {
      Object.values(this.etapeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
  }


}
