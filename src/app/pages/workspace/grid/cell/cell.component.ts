import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
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
import {EtapeDisplayModalComponent} from "../../items/etape-display-modal/etape-display-modal.component";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {TypeService} from "../../../../services/type.service";
import {BaseItem} from "../../items/item.model";
import {ProcessusService} from "../../../../services/processus.service";
import {ConnectionsModalComponent} from "../../items/connections-modal/connections-modal.component";
import {CategorieService} from "../../../../services/categorie.service";
import {StatutEtape} from "../../../../models/StatutEtape";
import {DurationUnite} from "../../../../models/DurationUnite";
import {ConnexionService} from "../../../../services/connexion.service";
import {FirstExistException} from "../../../../exceptions/firstExist.exception";
import {EndExistException} from "../../../../exceptions/endExist.exception";
import {EtapeService} from "../../../../services/etape.service";
import {SubTaskDisplayModalComponent} from "../../items/sub-task-display-modal/sub-task-display-modal.component";


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
    EtapeDisplayModalComponent,
    NzBadgeComponent,
    ConnectionsModalComponent,
    SubTaskDisplayModalComponent
  ],
  styleUrl: './cell.component.css'
})
export class CellComponent implements OnInit,AfterViewInit,AfterContentInit{

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
              private connexionService : ConnexionService,
              private etapeService : EtapeService
  ) {
    /*setTimeout(() => {
      if(this.processItem != null)
      {
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is type === "+this.processItem.type);
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is desc === "+this.processItem.description);
      }
      else
      {
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is null");
      }

    }, 8000);*/
  }

  ngAfterViewInit(): void {
    if(this.processItem) {
      //timeout to avoid Angular error for changing properties before view is initialized
      setTimeout(()=>{
        if(this.processItem){
          if(this.processItem.type){
            console.log("YES BRO I GOT IT")
            this.createItemProcess(1);
          }
        }else{
          console.error("Error at creating component at Cell AfterViewInit ["+this.rowIndex+"]["+this.colIndex+"] : Cell is null or Type is undefined.")
        }
      },0)
    }
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {

  }

  onClickCell() {
    console.log("Cell["+this.rowIndex+"]["+this.colIndex+"]  clicked !")
  }

  /**Create an item on drop on a cell
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
        nzOkText : "Ok",
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

              this.createItemProcess(0);

              //send this emitter to grid to create connexions after the creation of this process
              this.connectProcessItems.emit({
                indexRow : this.rowIndex,
                indexCol : this.colIndex,
                stepsBefore : <string[]>modalComponentInst.etapeForm.value.stepsBefore,
                stepsAfter : <string[]>modalComponentInst.etapeForm.value.stepsAfter,
              })
            } catch (error) {
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
  createItemProcess(source:number) {
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
      this.processItem.enableShowButtons = true;
      this.processItemCreated.emit({
        processItem : newProcessItem,
        rowIndex : this.rowIndex,
        colIndex : this.colIndex
      })
    }else
      throw new Error('Error at cell : cannot create Etape because processItem is null.')

  }

  deleteItemProcess(){
    if(this.processItem != null){

      const deleteModal = this.modalService.warning({
        nzTitle: "Attention !",
        nzContent: "All connections associated with this step will be lost, do you still want to delete?",
        nzWidth : 450,
        nzOkText : "Ok",
        nzOnOk: () => {
          this.container.clear();
          console.log("PROCESS ITEM AT CELL BEFORE DELETE : "+this.processItem);
          this.processItem = null;
          console.log("PROCESS ITEM A CELL AFTER DELETE : "+this.processItem);
          this.processItemDeleted.emit({
            rowIndex : this.rowIndex,
            colIndex : this.colIndex
          });
          this.modalService.success({
            nzTitle : "Step deleted successfully !"
          })
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
          nzTitle: "Attention: You want to replace an already created step !",
          nzContent: "Do you still want to replace the current step?",
          nzOkText : "Ok",
          nzWidth : 450,
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
