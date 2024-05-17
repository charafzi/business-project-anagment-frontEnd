import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList} from "@angular/cdk/drag-drop";
import {BaseEtape, StatutEtape, statutEtapeToString} from "../../items/Etape.class";
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
import {verifyHostBindings} from "@angular/compiler";
import {ProcessusService} from "../../../../services/processus.service";


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
    NzBadgeComponent
  ],
  styleUrl: './cell.component.css'
})
export class CellComponent implements OnInit,OnChanges,AfterViewInit,AfterContentInit{

  @Input('processItem') processItem: BaseEtape | null = null;
  @Output('processItemCreated') processItemCreated = new EventEmitter<{processItem:BaseEtape ,rowIndex:number,colIndex:number}>();
  @Output('processItemShowButtons') processItemShowButtons = new EventEmitter<{show:boolean ,rowIndex:number,colIndex:number}>();
  @Output('processItemDeleted') processItemDeleted = new EventEmitter<{rowIndex:number,colIndex:number}>();
  @Input('rowIndex') rowIndex! : number;
  @Input('colIndex') colIndex! : number;
  @Input('order') order!:number;
  @Input('onDotClicked') onDotClicked:boolean = false;
  @ViewChild('container',{read : ViewContainerRef})
  container! : ViewContainerRef;
  displayInfoModal:boolean =false;
  constructor(private CFR: ComponentFactoryResolver,
              private modalService: NzModalService,
              private typeService : TypeService,
              private processusService : ProcessusService
  ) {
    setTimeout(() => {
      if(this.processItem != null)
      {
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is type === "+this.processItem.type);
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is desc === "+this.processItem.description);
      }
      else
      {
        console.log("CELL at ["+this.rowIndex+"]["+this.colIndex+"] is null");
      }

    }, 8000);
  }

  ///////////////////////////////////////////////////////////////CHOUF HNA
  /*
  * RIGEL LBLAN DYL modal (etape from databse is not synchronized with componenet and modal)
  *
  * !!!! chuf blan dyl t7eyed extends fcomponeent dyl base Etape o t3ewedo battribut dyl process item
  * */

  ngAfterViewInit(): void {

    }

  ngOnInit(): void {
    if(this.processItem) {
      //timeout to avoid Angular error for changing properties before view is initialized
      setTimeout(()=>{
        /*if(this.processItem?.type){
          const componentType = this.typeService.getComponentByType(this.processItem.type.nom);
          if (componentType) {
            const componentFactory = this.CFR.resolveComponentFactory(componentType);
            const childComponentRef = this.container?.createComponent(componentFactory);
            /!*!//enable showing buttons
            (childComponentRef?.instance as BaseItem).enableShowButtons=true;
            //link this cell to the component at this cell
            (childComponentRef?.instance as BaseItem).cellRef = this;
            //link "Etape" to the componeent
            (childComponentRef?.instance as BaseItem).etape=this.processItem;*!/
            (childComponentRef?.instance as BaseItem)._etape=this.processItem;
            (childComponentRef?.instance as BaseItem)._enableShowButtons=true;
            console.log("ITEMM : "+(childComponentRef?.instance as BaseItem)._etape?.description)
        }
      }*/
        if(this.processItem){
          if(this.processItem.type){
            this.createItemProcess(1);
          }
        }else{
          console.error("Error at creating component at Cell AfterViewInit ["+this.rowIndex+"]["+this.colIndex+"] : Cell is null or Type is undefined.")
        }
      },10)
    }
  }

  ngAfterContentInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }




  onClickCell() {
    console.log("Cell["+this.rowIndex+"]["+this.colIndex+"]  clicked !")
  }

  /**Create an item on drop on a cell
   scenarios : Cell is empty
                Cell already contains a proessItem (Etape)
   **/
  drop(event :CdkDragDrop<BaseItem>) {
    console.log(event.item.dropContainer.data[event.previousIndex]);

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
              let periodDelaiAttente = <string>modalComponentInst.etapeForm.value.radioDelaiAttente;
              let selectedFIE = <string>modalComponentInst.etapeForm.value.radioFIE;
              let dureeEstime = <number>modalComponentInst.etapeForm.value.dureeEstimee;
              let delaiAttente = <number>modalComponentInst.etapeForm.value.delaiAttente;
              this.processItem = new BaseEtape();
              this.processItem.componentName = event.item.dropContainer.data[event.previousIndex]._componentName;
              this.processItem.description = <string>modalComponentInst.etapeForm.value.description;
              this.processItem.validate = <boolean>modalComponentInst.etapeForm.value.isValidate;
              this.processItem.paid = <boolean>modalComponentInst.etapeForm.value.isPaid;
              switch (periodDureeEstime){
                case 'H':
                  break;
                case 'D':
                  dureeEstime = dureeEstime * 24;
                  break;
                case 'M':
                  dureeEstime = dureeEstime * 24 * 31;
                  break;
              }

              this.processItem.dureeEstimee = dureeEstime;
              switch (periodDelaiAttente){
                case 'H':
                  break;
                case 'D':
                  delaiAttente = delaiAttente * 24;
                  break;
                case 'M':
                  delaiAttente = delaiAttente * 24 * 31;
                  break;
              }
              this.processItem.delaiAttente = delaiAttente;
              switch (selectedFIE){
                case 'F':
                  this.processItem.first = true;
                  break;
                case 'I':
                  this.processItem.intermediate = true;
                  break;
                case 'E':
                  this.processItem.end = true;
                  break;
              }
              this.createItemProcess(0);
            } catch (error) {
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
      console.log("I WILL CREATE : "+this.processItem.idEtape,"desc = ",this.processItem.description);
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
        newProcessItem.description=this.processItem.description;
        newProcessItem.dureeEstimee=this.processItem.dureeEstimee;
        newProcessItem.delaiAttente=this.processItem.delaiAttente;
        newProcessItem.ordre=this.order;
        newProcessItem.first=this.processItem.first
        newProcessItem.intermediate = this.processItem.intermediate;
        newProcessItem.end=this.processItem.end
        newProcessItem.validate=this.processItem.validate;
        newProcessItem.paid=this.processItem.paid;
        newProcessItem.indexLigne=this.rowIndex;
        newProcessItem.indexColonne=this.colIndex;
        newProcessItem.componentName=this.typeService.getComponentNameByType(typeName);
        newProcessItem.pourcentage=0;
        newProcessItem.statutEtape = StatutEtape.PAS_ENCORE_COMMENCEE;
        newProcessItem.processus = this.processusService.processus;
        newProcessItem._cellRef=this;
      }else{
        if(this.processItem != null){
          newProcessItem.idEtape=this.processItem.idEtape;
          newProcessItem.description=this.processItem.description;
          newProcessItem.ordre=this.processItem.ordre;
          newProcessItem.dureeEstimee=this.processItem.dureeEstimee;
          newProcessItem.delaiAttente=this.processItem.delaiAttente;
          newProcessItem.first = this.processItem.first;
          newProcessItem.intermediate = this.processItem.intermediate;
          newProcessItem.end=this.processItem.end;
          newProcessItem.validate=this.processItem.validate;
          newProcessItem.paid=this.processItem.paid;
          newProcessItem.indexLigne=this.processItem.indexLigne;
          newProcessItem.indexColonne=this.processItem.indexColonne;
          newProcessItem.pourcentage=this.processItem.pourcentage;
          newProcessItem.statutEtape = this.processItem.statutEtape;
          newProcessItem.componentName=this.typeService.getComponentNameByType(typeName)
          newProcessItem.processus = this.processItem.processus;
          newProcessItem._cellRef=this;
        }
      }
      newProcessItem.enableShowButtons=true;
      newProcessItem.showButtons = true;

      //newProcessItem.showButtons=true;
      let T = this.typeService.getTypeByName(typeName)
      if(T == undefined)
        throw Error('Error when creating itemProcess at Cell : Cannot assign a type.');
      newProcessItem.type = T;

      //assign Etape to component
      (childComponentRef.instance as BaseItem)._etape = newProcessItem;
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

  displayEditItemProcess(){
    this.displayInfoModal = true;
  }

  hideItemProcess(){
    this.displayInfoModal = false;
  }



}
