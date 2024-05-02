import {
  AfterViewInit, booleanAttribute,
  Component,
  ComponentFactoryResolver, EventEmitter,
  Input,
  OnInit, Output, Type,
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
export class CellComponent implements OnInit,AfterViewInit{
  itemsTypes : any = {
    square: 'square',
    rhombus: 'rhombus',
    circle : 'circle'
  }
  @Input('processItem') processItem: BaseEtape | null = null;
  @Output('processItemCreated') processItemCreated = new EventEmitter<{processItem:BaseEtape ,rowIndex:number,colIndex:number}>();
  @Output('processItemDeleted') processItemDeleted = new EventEmitter<{rowIndex:number,colIndex:number}>();
  @Input('rowIndex') rowIndex! : number;
  @Input('colIndex') colIndex! : number;
  @Input('order') order!:number;
  @ViewChild('container',{read : ViewContainerRef})
  container! : ViewContainerRef;
  displayInfoModal:boolean =false;
  constructor(private CFR: ComponentFactoryResolver,
              private modalService: NzModalService) {
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }

  onClickCell() {
    console.log("on click cell ["+this.rowIndex+"]["+this.colIndex+"] CLICKED ::: "+this.processItem?.type);
  }

  drop(event :CdkDragDrop<BaseEtape>) {

    // show the modal warning before replacing a processItem
    this.warningModal().then(message => {
      const modalRef = this.modalService.create({
        nzTitle: 'Veuillez remplir les informations de l\'étape :',
        nzContent: EtapeModalComponent,
        nzWidth : 550,
        nzOkText : "Confirmer",
        nzCancelText : "Annuler",
        nzKeyboard: true,
        nzOnOk :()=>{
          const modalComponentInst = modalRef.componentRef?.instance as EtapeModalComponent;
          let formIsValid = modalComponentInst.formIsValid()

          //if form is valid then create the itemprocess
          if(formIsValid){
            try
            {
              this.createItemProcess(
                event.item.dropContainer.data[event.previousIndex].type,
                <string>modalComponentInst.etapeForm.value.description,
                <number>modalComponentInst.etapeForm.value.dureeEstimee,
                <number>modalComponentInst.etapeForm.value.delaiAttente,
                <boolean>modalComponentInst.etapeForm.value.isFirst,
                <boolean>modalComponentInst.etapeForm.value.isEnd,
                <boolean>modalComponentInst.etapeForm.value.isValidate,
                <boolean>modalComponentInst.etapeForm.value.isPaid
              );
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

  createItemProcess(
    type:string,
    description:string,
    dureeEstime:number,
    delaiAttente:number,
    isFirst:boolean,
    isEnd:boolean,
    isValidate:boolean,
    isPaid:boolean
  ) {
    let newProcessItem : BaseEtape;
    if (!this.container)
      throw new Error('ViewContainerRef is not defined at CellComponent.');

    //create new processItem based on his type
    console.log("----------------> "+this.getComponentByType(type));
    let componentFactory = this.CFR.resolveComponentFactory(this.getComponentByType(type));
    let childComponentRef = this.container.createComponent(componentFactory);
    newProcessItem = childComponentRef.instance;
    newProcessItem.description=description;
    newProcessItem.duréeEstimée=dureeEstime;
    newProcessItem.délaiAttente=delaiAttente;
    newProcessItem.ordre=this.order;
    newProcessItem.isFirst=isFirst;
    newProcessItem.isEnd=isEnd;
    newProcessItem.isValidate=isValidate;
    newProcessItem.isPaid=isPaid;

    this.processItem = newProcessItem;
    this.processItem.cellRef = this;
    this.processItem.enableShowButtons = true;
    this.processItemCreated.emit({
      processItem : newProcessItem,
      rowIndex : this.rowIndex,
      colIndex : this.colIndex
    })
  }

  deleteItemProcess(){
    if(this.processItem != null){

      const deleteModal = this.modalService.warning({
        nzTitle: "Attention : Vous voulez supprimer une étape !",
        nzContent: "Voulez-vous toujours supprimer cette étape?",
        nzWidth : 450,
        nzOkText : "Valider",
        nzOnOk: () => {
          this.container.clear();
          console.log("PROCESS ITEM AT CELL BEFORE DELETE : "+this.processItem);
          this.processItem = null;
          console.log("PROCESS ITEM A CELL AFTER DELETE : "+this.processItem);
          this.processItemDeleted.emit({
            rowIndex : this.rowIndex,
            colIndex : this.colIndex
          });
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
          nzTitle: "Attention : Vous désirez substituer une étape déjà créée",
          nzContent: "Voulez-vous toujours remplacer l'étape actuelle?",
          nzOkText : "Valider",
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


  getComponentByType(type :string) : Type<any>
  {
    switch (type){
      case this.itemsTypes.square:
        return SquareComponent;
      case this.itemsTypes.rhombus:
        return RhombusComponent;
      case this.itemsTypes.circle:
        return CircleComponent;
    }
    return SquareComponent;
    }
}
