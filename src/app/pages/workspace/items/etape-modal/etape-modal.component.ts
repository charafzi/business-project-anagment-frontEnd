import {Component, EventEmitter, Output} from '@angular/core';
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
    NzInputNumberComponent
  ],
  styleUrl: './etape-modal.component.css'
})
export class EtapeModalComponent {
  @Output() formDataConfirmed: EventEmitter<any> = new EventEmitter<any>();
  etapeForm: FormGroup<{
    description:FormControl<string>;
   // ordre: FormControl<number>;
    //pourcentage: FormControl<string>;
    dureeEstimee: FormControl<number>;
    delaiAttente: FormControl<number>;
    isFirst:FormControl<boolean>;
    isEnd:FormControl<boolean>;
    isValidate:FormControl<boolean>;
    isPaid:FormControl<boolean>;
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
              private fb: NonNullableFormBuilder) {
    this.etapeForm = this.fb.group({
      description : ['',[Validators.required,Validators.maxLength(255)]],
      dureeEstimee : [1,[Validators.required,Validators.min(0)]],
      delaiAttente : [0,[Validators.required,Validators.min(0)]],
      isFirst : [false],
      isEnd : [false],
      isValidate : [false],
      isPaid : [false]
    })
  }

  formIsValid():boolean{
    return this.etapeForm.valid;
}

  submitForm(): void {
    if (this.etapeForm.valid) {

    } else
    {
      Object.values(this.etapeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
