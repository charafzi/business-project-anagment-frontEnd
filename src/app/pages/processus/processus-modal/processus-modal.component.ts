import { Component } from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzInputDirective, NzTextareaCountComponent} from "ng-zorro-antd/input";
import {ProcessusService} from "../../../services/processus.service";

@Component({
  selector: 'app-processus-modal',
  templateUrl: './processus-modal.component.html',
  standalone: true,
  imports: [
    NzFormDirective,
    ReactiveFormsModule,
    NzColDirective,
    NzTextareaCountComponent,
    NzFormItemComponent,
    NzRowDirective,
    NzFormLabelComponent,
    NzInputDirective,
    NzFormControlComponent
  ],
  styleUrl: './processus-modal.component.css'
})
export class ProcessusModalComponent {
  processForm: FormGroup;

  constructor(private modalRef: NzModalRef,
              private processusService :ProcessusService,
              private fb: NonNullableFormBuilder) {
    this.processForm = new FormGroup({
      nom : new FormControl (this.processusService.processusEdit.nom,[Validators.required,Validators.maxLength(255)]),
      description : new FormControl(this.processusService.processusEdit.description,[Validators.required,Validators.maxLength(255)]),
    })
  }

}
