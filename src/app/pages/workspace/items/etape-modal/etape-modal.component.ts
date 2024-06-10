import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {ConnexionService} from "../../../../services/connexion.service";
import {BaseEtape} from "../Etape.class";
import {NgForOf} from "@angular/common";
import {Categorie} from "../../../../models/categorie.model";
import {CategorieService} from "../../../../services/categorie.service";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";

import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-etape-modal',
  templateUrl: './etape-modal.component.html',
  standalone: true,
  imports: [
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrl: './etape-modal.component.css'
})
export class EtapeModalComponent implements OnInit{
  @Output() formDataConfirmed: EventEmitter<any> = new EventEmitter<any>();
  etapes : BaseEtape [] = [];
  categories : Categorie [] = [];
  etapeForm: FormGroup<{
    description:FormControl<string>;
   // ordre: FormControl<number>;
    //pourcentage: FormControl<string>;
    dureeEstimee: FormControl<number>;
    radioDureeEstimee:FormControl<string>;
    radioValidated:FormControl<string>;
    radioPaid:FormControl<string>;
    radioAccepted:FormControl<string>
    radioFIE:FormControl<string>;
    stepsBefore : FormControl<string[]>;
    stepsAfter : FormControl<string[]>;
    categorie : FormControl<number>;
  }>

  constructor(private modalRef: NzModalRef,
              private fb: NonNullableFormBuilder,
              private connexionService : ConnexionService,
              private categorieService : CategorieService
  ) {
    this.etapeForm = this.fb.group({
      description : ['',[Validators.required,Validators.maxLength(255)]],
      dureeEstimee : [1,[Validators.required,Validators.min(0)]],
      radioDureeEstimee : ['',[Validators.required]],
      radioFIE : ['',[Validators.required]],
      stepsAfter : [['']],
      stepsBefore : [['']],
      categorie : [1,[Validators.required]],
      radioValidated : ['',[Validators.required]],
      radioAccepted :['',[Validators.required]],
      radioPaid : ['',[Validators.required]]
    })
  }

  ngOnInit(): void {
    this.etapes = this.connexionService.getEtapesFromGrid();
    this.categorieService.getAllCategories()
      .subscribe(categories=>{
          this.categories = categories;
        },
        error => {
          console.error("Error ate retrieving Categories from back-end : "+error)

        }
      )
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
