import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList} from "@angular/cdk/drag-drop";
import {BaseEtape} from "../../items/Etape.class";
import {NgClass, NgIf} from "@angular/common";
import {SquareComponent} from "../../items/square/square.component";
import {RhombusComponent} from "../../items/rhombus/rhombus.component";
import {CircleComponent} from "../../items/circle/circle.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {EtapeModalComponent} from "../../items/etape-modal/etape-modal.component";
import {TypeService} from "../../../../services/type.service";
import {BaseItem} from "../../items/item.model";
import {ProcessusService} from "../../../../services/processus.service";
import {ConnectionsModalComponent} from "../../items/connections-modal/connections-modal.component";
import {CategorieService} from "../../../../services/categorie.service";
import {DurationUnite} from "../../../../models/DurationUnite";
import {FirstExistException} from "../../../../exceptions/firstExist.exception";
import {EndExistException} from "../../../../exceptions/endExist.exception";
import {EtapeService} from "../../../../services/etape.service";
import {SubTaskDisplayModalComponent} from "../../items/sub-task-display-modal/sub-task-display-modal.component";
import {PaymentModalComponent} from "../../items/payment-modal/payment-modal.component";
import {ValidationModalComponent} from "../../items/validation-modal/validation-modal.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {EtapeDisplayModalComponent} from "../../items/etape-display-modal/etape-display-modal.component";
import {DemoNgZorroAntdModule} from "../../../../ng-zorro-antd.module";
import {UserService} from "../../../../services/user.service";
import {ConnexionService} from "../../../../services/connexion.service";
import {StatutTache} from "../../../../models/StatutTache";


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    CdkDragPlaceholder,
    SquareComponent,
    RhombusComponent,
    CircleComponent,
    DemoNgZorroAntdModule,
    ConnectionsModalComponent,
    SubTaskDisplayModalComponent,
    PaymentModalComponent,
    ValidationModalComponent,
    EtapeDisplayModalComponent
  ],
  styleUrl: './cell.component.css'
})
export class CellComponent implements AfterViewInit{

  @Input('processItem') processItem: BaseEtape | null = null;
  @Input('mode') mode : number = 1;
  @Output('processItemCreated') processItemCreated = new EventEmitter<{processItem:BaseEtape ,rowIndex:number,colIndex:number}>();
  @Output('processItemShowButtons') processItemShowButtons = new EventEmitter<{show:boolean ,rowIndex:number,colIndex:number}>();
  @Output('processItemDeleted') processItemDeleted = new EventEmitter<{rowIndex:number,colIndex:number}>();
  @Output('processItemDropped') processItemDropped = new EventEmitter<{}>;
  @Output('connectProcessItems') connectProcessItems = new EventEmitter<{indexRow:number,indexCol:number,stepsBefore : string[],stepsAfter : string[]}>
  @Input('rowIndex') rowIndex! : number;
  @Input('colIndex') colIndex! : number;
  @Input('order') order!:number;
  @Input('onDotClicked') onDotClicked:boolean = false;
  @ViewChild('container',{read : ViewContainerRef})
  container! : ViewContainerRef;
  constructor(private CFR: ComponentFactoryResolver,
              private modalService: NzModalService,
              private typeService : TypeService,
              private processusService : ProcessusService,
              private categorieService : CategorieService,
              private etapeService : EtapeService,
              private msg : NzMessageService,
              private connexionService : ConnexionService,
              protected userService : UserService
  ) {
  }

  ngAfterViewInit(): void {
    try {
      if(this.processItem) {
        //timeout to avoid Angular error for changing properties before view is initialized
        setTimeout(()=>{
          if(this.processItem){
            if(this.processItem.type){
              if(!this. createItemProcess(1)){
                throw new Error("Error at creating retrieved steps")
              }
            }
          }else{
            console.error("Error at creating component at Cell AfterViewInit ["+this.rowIndex+"]["+this.colIndex+"] : Cell is null or Type is undefined.")
          }
        },0)
      }
    }
    catch (error){
      this.msg.error('Error at creating retrieved steps')
    }
  }

  getCellClasses() {
    const classes = [];
    if (this.processItem?.first && !this.onDotClicked) {
      classes.push('cell-first');
    } else if (this.processItem?.end && !this.onDotClicked) {
      classes.push('cell-end');
    } else if (this.onDotClicked && this.mode === 1) {
      classes.push('cell-selected');
    }
    if (this.processItem?.tache?.statutTache === 'TERMINE') {
      classes.push('cell-done');
    }
    if(this.processItem){
      if(!this.processItem.first){
        let etapes : BaseEtape [] = this.connexionService.getEtapesTo(this.processItem.indexLigne,this.processItem.indexColonne);
        let allDones = true;
        etapes.forEach(etape=>{
          if(etape.tache && etape.tache.statutTache!=StatutTache.TERMINE){
            allDones = false;
          }
        })
        if(!allDones){
          classes.push('cell-not-available');
        }
      }
    }
    return classes;
  }

  /** Create an item on drop on a cell
   scenarios : Cell is empty
              Cell already contains a processItem (Etape)
   **/
  drop(event :CdkDragDrop<BaseItem>) {
    this.processItemDropped.emit({});

    // show the modal warning before replacing a processItem
    this.warningModal().then(message => {
      const modalRef = this.modalService.create({
        nzTitle: 'Please fill in the informations about the step :',
        nzContent: EtapeModalComponent,
        nzWidth : 550,
        nzOkText : "Confirm",
        nzCancelText : "Cancel",
        nzKeyboard: true,
        nzOnOk :()=>{
          const modalComponentInst = modalRef.componentRef?.instance as EtapeModalComponent;
          let formIsValid = modalComponentInst.formIsValid()

          //if form is valid then create the itemprocess
          if(formIsValid){
            try
            {
              let periodDureeEstime = <string>modalComponentInst.etapeForm.value.radioDureeEstimee;
              let selectedFIE = <string>modalComponentInst.etapeForm.value.radioFIE;
              let dureeEstime = <number>modalComponentInst.etapeForm.value.dureeEstimee;
              let isFirst : boolean = false;
              let isInterm : boolean = false;
              let isEnd : boolean = false;

              switch (selectedFIE){
                case 'F':
                  isFirst = true;
                  break;
                case 'I':
                  isInterm = true;
                  break;
                case 'E':
                  isEnd = true;
                  break;
              }

              if(this.etapeService.checkFirstExists(this.rowIndex,this.colIndex) && isFirst){
                throw new FirstExistException("First already exists !");
              }

              if(this.etapeService.checkEndExists(this.rowIndex,this.colIndex) && isEnd){
                throw new EndExistException("End already exists !");
              }

              //creation of etape
              this.processItem = new BaseEtape();
              this.processItem.dureeEstimee = dureeEstime;
              this.processItem.componentName = event.item.dropContainer.data[event.previousIndex]._componentName;
              this.processItem.description = <string>modalComponentInst.etapeForm.value.description;
              this.processItem.validate = <string>modalComponentInst.etapeForm.value.radioValidated === 'Y';
              this.processItem.paid = <string>modalComponentInst.etapeForm.value.radioPaid=== 'Y';
              this.processItem.accepted = <string>modalComponentInst.etapeForm.value.radioAccepted=== 'Y';
              this.processItem.categorie = this.categorieService.getCategorieById(<number>modalComponentInst.etapeForm.value.categorie);
              this.processItem.first = isFirst;
              this.processItem.intermediate = isInterm;
              this.processItem.end = isEnd;


              switch (periodDureeEstime){
                case 'H':
                  this.processItem.dureeEstimeeUnite = DurationUnite.HOUR;
                  break;
                case 'D':
                  this.processItem.dureeEstimeeUnite = DurationUnite.DAY;
                  break;
                case 'M':
                  this.processItem.dureeEstimeeUnite = DurationUnite.MONTH;
                  break;
              }

              if(this.createItemProcess(0)){
                //send this emitter to grid to create connexions after the creation of this process
                this.connectProcessItems.emit({
                  indexRow : this.rowIndex,
                  indexCol : this.colIndex,
                  stepsBefore : <string[]>modalComponentInst.etapeForm.value.stepsBefore,
                  stepsAfter : <string[]>modalComponentInst.etapeForm.value.stepsAfter,
                })
                this.msg.success("Step created successfully")
              }else{
                this.msg.error("Error during creating of the step, please try again")
              }
            } catch (error) {
              if (error instanceof FirstExistException) {
                this.msg.error("Unable to create this step, the initial step already exists");
                console.error(error.message);
              } else if (error instanceof EndExistException) {
                this.msg.error('Unable to create this step, the final step already exists !');
                console.error(error.message);
              }
              console.error(error);
            }
          }
          //return false if the form is not valid
          return formIsValid;
        },
        nzOnCancel:()=>{
          modalRef.close();
        }
      });
    })
      .catch(error=>{
        console.error(error);
      })
  }

  /*
  0: from front
  1: from back
   */
  createItemProcess(source:number) : boolean {
    let newProcessItem : BaseEtape;
    if (!this.container)
      throw new Error('ViewContainerRef is not defined at CellComponent.');
    if(this.processItem){
      //create new processItem based on his type
      let typeName : string = this.typeService.getTypeByComponentname(this.processItem.componentName);
      if(source==1 && this.processItem.type)
        typeName=this.processItem.type.nom;
      let componentFactory = this.CFR.resolveComponentFactory(this.typeService.getComponentByType(typeName));
      let childComponentRef = this.container.createComponent(componentFactory);

      //component
      newProcessItem = childComponentRef.instance as BaseEtape;

      //assign values from formulaire
      if(source == 0){
        if(this.processItem == null)
          this.processItem = new BaseEtape();
        newProcessItem.idEtape=-1;
        newProcessItem.ordre=this.order;
        newProcessItem.indexLigne=this.rowIndex;
        newProcessItem.indexColonne=this.colIndex;
       // newProcessItem.pourcentage=0;
        //newProcessItem.statutEtape = StatutEtape.PAS_ENCORE_COMMENCEE;
        newProcessItem.processus = this.processusService.processus;
        newProcessItem._cellRef=this;
      }else{
        if(this.processItem != null){
          newProcessItem.idEtape=this.processItem.idEtape;
          newProcessItem.ordre=this.processItem.ordre;
          newProcessItem.indexLigne=this.processItem.indexLigne;
          newProcessItem.indexColonne=this.processItem.indexColonne;
         // newProcessItem.pourcentage=this.processItem.pourcentage;
          //newProcessItem.statutEtape = this.processItem.statutEtape;
          newProcessItem.processus = this.processItem.processus;
          newProcessItem._cellRef=this;
        }
      }

      newProcessItem.componentName=this.typeService.getComponentNameByType(typeName)
      newProcessItem.description=this.processItem.description;
      newProcessItem.dureeEstimee=this.processItem.dureeEstimee;
      newProcessItem.first=this.processItem.first
      newProcessItem.intermediate = this.processItem.intermediate;
      newProcessItem.end=this.processItem.end;
      newProcessItem.validate=this.processItem.validate;
      newProcessItem.paid=this.processItem.paid;
      newProcessItem.accepted = this.processItem.accepted;
      newProcessItem.dureeEstimeeUnite = this.processItem.dureeEstimeeUnite;
      newProcessItem.tache = this.processItem.tache;

      newProcessItem.enableShowButtons=true;
      newProcessItem.showButtons = true;

      //newProcessItem.showButtons=true;
      let T = this.typeService.getTypeByName(typeName)
      if(T == null)
        throw Error('Error when creating itemProcess at Cell : Type is null.');
      newProcessItem.type = T;
      newProcessItem.categorie = this.processItem.categorie;

      //assign Etape to component
      (childComponentRef.instance as BaseItem)._etape = newProcessItem;
      (childComponentRef.instance as BaseItem)._mode=this.mode;

      //assing Etape to this Cell
      //this.processItem = newProcessItem;
      //this.processItem.enableShowButtons = true;
      this.processItemCreated.emit({
        processItem : newProcessItem,
        rowIndex : this.rowIndex,
        colIndex : this.colIndex
      })
      return true;
    }else
    {
      throw new Error('Error at cell : cannot create Etape because processItem is null.')
      return false;
    }
  }

  deleteItemProcess(){
    if(this.processItem != null){

      const deleteModal = this.modalService.warning({
        nzTitle: "Attention : All informations and connections  associated with this step will be lost !",
        nzContent: "Do you still want to delete?",
        nzWidth : 600,
        nzOkDanger : true,
        nzOkText : "Yes",
        nzCancelText : "No",
        nzOnOk: () => {
          this.container.clear();
          //console.log("PROCESS ITEM AT CELL BEFORE DELETE : "+this.processItem);
          this.processItem = null;
          //console.log("PROCESS ITEM A CELL AFTER DELETE : "+this.processItem);
          this.processItemDeleted.emit({
            rowIndex : this.rowIndex,
            colIndex : this.colIndex
          });
          this.msg.success('Step deleted successfully');
        },
        nzOnCancel: () => {
          deleteModal.close();
        }
      });
    }
  }

  async warningModal(): Promise<void> {
    if (this.processItem != null) {
      return new Promise<void>((resolve, reject) => {
        const warningModal = this.modalService.warning({
          nzTitle: "Attention: All informations about this current step will be lost !",
          nzContent: "Do you still want to replace?",
          nzOkDanger : true,
          nzOkText : "Yes",
          nzCancelText : "No",
          nzWidth : 600,
          nzOnOk: () => {
            this.container.clear();
            this.processItem = null;
            this.processItemDeleted.emit({
              rowIndex: this.rowIndex,
              colIndex: this.colIndex
            });
            resolve();
          },
          nzOnCancel: () => {
            reject(new Error('User reject to replace process Item'));
          }
        });
      });
    } else {
      return Promise.resolve();
    }
  }

}
