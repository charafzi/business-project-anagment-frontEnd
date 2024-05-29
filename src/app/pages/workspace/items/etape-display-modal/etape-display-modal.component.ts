import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BaseEtape} from "../Etape.class";
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
import {CategorieService} from "../../../../services/categorie.service";
import {Categorie} from "../../../../models/categorie.model";
import {NgForOf} from "@angular/common";
import {getstatutEtapeToString, StatutEtape} from "../../../../models/StatutEtape";
import {DurationUnite, getDurationUniteFromString} from "../../../../models/DurationUnite";
import {ConnexionService} from "../../../../services/connexion.service";
import {FirstExistException} from "../../../../exceptions/firstExist.exception";
import {EndExistException} from "../../../../exceptions/endExist.exception";
import {EtapeService} from "../../../../services/etape.service";

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
    NzRadioGroupComponent,
    NgForOf
  ],
  styleUrl: './etape-display-modal.component.css'
})
export class EtapeDisplayModalComponent implements OnInit,OnChanges{
  @Input('etape') etape! : BaseEtape;
  @Input('isVisible') isVisible!:boolean;
  categories : Categorie [] = [];
  percent = 0;
  etapeForm!: FormGroup;
  categoriesIsLoading:boolean = true;
  constructor(private fb: FormBuilder,
              private modalService : NzModalService,
              private categorieService : CategorieService,
              private connexionSerivce : ConnexionService,
              private etapeService : EtapeService) {}

  ngOnInit(): void {
    this.categorieService.getAllCategories()
      .subscribe(categories => {
          this.categories = categories;
        },
        error => {
          console.error("Error ate retrieving Categories from back-end : " + error)

        }
      )
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
       try{
         this.etapeService.printProcessItems();
         let isFirst : boolean = false;
         let isInterm : boolean = false;
         let isEnd : boolean = false;
         let periodDureeEstime = this.etapeForm.value.radioDureeEstimee;
         let periodDelaiAttente = this.etapeForm.value.radioDelaiAttente;
         let selectedFIE = this.etapeForm.value.radioFIE;
         this.etape.description = this.etapeForm.value.description;
         this.etape.ordre=this.etapeForm.value.ordre;
         this.etape.pourcentage=this.percent;
         this.etape.first=this.etapeForm.value.isFirst;
         this.etape.end=this.etapeForm.value.isEnd;
         this.etape.accepted = this.etapeForm.value.radioAccepted === 'Y';
         this.etape.validate = this.etapeForm.value.radioValidated === 'Y';
         this.etape.paid = this.etapeForm.value.radioPaid=== 'Y';
         this.etape.dureeEstimee = this.etapeForm.value.dureeEstimee;
         this.etape.statutEtape = this.etapeForm.value.statutEtape == 'Commencée' ? StatutEtape.COMMENCEE: StatutEtape.PAS_ENCORE_COMMENCEE;

         switch (periodDureeEstime){
           case 'H':
             this.etape.dureeEstimeeUnite = DurationUnite.HOUR;
             break;
           case 'D':
             this.etape.dureeEstimeeUnite = DurationUnite.DAY;
             break;
           case 'M':
             this.etape.dureeEstimeeUnite = DurationUnite.MONTH;
             break;
         }

         this.etape.first = this.etape.intermediate = this.etape.end = false;
         switch (selectedFIE){
           case 'F':
             isFirst= true;
             break;
           case 'I':
             isInterm= true;
             break;
           case 'E':
             isEnd= true;
             break;
         }

         if(isFirst){
           if(this.etapeService.checkFirstExists(this.etape.indexLigne,this.etape.indexColonne)){
             throw new FirstExistException("First already exists !");
           }
           else{
             this.etape.first=isFirst;
           }
         }

         if(isEnd){
           if(this.etapeService.checkEndExists(this.etape.indexLigne,this.etape.indexColonne)){
             throw new EndExistException("First already exists !");
           }
           else{
             this.etape.end=isEnd;
           }
         }

         this.etape.categorie = this.categorieService.getCategorieById(this.etapeForm.value.categorie);

         this.onClickHideModal();
         this.modalService.success({
           nzTitle : "Step modified successfully !"
         })
       }
       catch (error) {
         if (error instanceof FirstExistException) {
           this.modalService.error({
             nzTitle : "Unable to create this step, the first step already exists !"
           })
           console.error(error.message);
         } else if (error instanceof EndExistException) {
           this.modalService.error({
             nzTitle : "Unable to create this step, the end step already exists !"
           })
           console.error(error.message);
         }
         console.error(error);
       }
    }
  }

  initializeForm(){
    etapeForm: FormGroup<{
      description:FormControl<string>;
      ordre: FormControl<number>;
      statutEtape : FormControl<string>;
      dureeEstimee: FormControl<number>;
      delaiAttente: FormControl<number>;
      isFirst:FormControl<boolean>;
      isEnd:FormControl<boolean>;
      radioValidated:FormControl<string>;
      radioPaid:FormControl<string>;
      radioAccepted:FormControl<string>;
      radioDureeEstimee:FormControl<string>
      radioFIE:FormControl<string>;
      categorie:FormControl<number>;
    }>
    let perdiodDureeEstime = '';
    let perdiodDelaiAttente ='';
    let selectedFIE=';'
    //744 == 31 * 24 (Months to hours)

    //Used this function to not have problems because DurationUnite retrived ans assigned as string from database
    switch (getDurationUniteFromString(this.etape.dureeEstimeeUnite.toString())){
      case DurationUnite.HOUR:
        perdiodDureeEstime = 'H';
        break;
      case DurationUnite.MONTH:
        perdiodDureeEstime = 'M';
        break;
      case DurationUnite.DAY:
        perdiodDureeEstime = 'D';
        break;
    }


    if(this.etape.first)
      selectedFIE = 'F';
    else if(this.etape.end)
      selectedFIE = 'E';
    else
      selectedFIE = 'I';

    this.etapeForm = this.fb.group({
      description : [this.etape.description,[Validators.required,Validators.maxLength(255)]],
      dureeEstimee : [this.etape.dureeEstimee,[Validators.required,Validators.min(0)]],
      ordre : [this.etape.ordre,Validators.required],
      statutEtape : [getstatutEtapeToString(this.etape.statutEtape.toString()),Validators.required],
      isFirst : [this.etape.first],
      isEnd : [this.etape.end],
      radioValidated: [this.etape.validate ? 'Y' : 'N',[Validators.required]],
      radioPaid:[this.etape.paid ? 'Y' : 'N',[Validators.required]],
      radioAccepted:[this.etape.accepted ? 'Y' : 'N',[Validators.required]],
      radioDureeEstimee : [perdiodDureeEstime,[Validators.required]],
      radioFIE : [selectedFIE,[Validators.required]],
      categorie : [this.etape.categorie?.idCategorie,[Validators.required]]
    })
    this.percent=this.etape.pourcentage;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.initializeForm();
    }
  }

  onClickHideModal(){
    this.etape.editModalIsVisibe=false;
  }

}
