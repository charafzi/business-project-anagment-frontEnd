import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {BaseEtape, StatutEtape, statutEtapeToString, statutfromJSONToString} from "../items/Etape.class";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {DOCUMENT, NgClass, NgIf} from "@angular/common";
import {Connection, ConnectionSet} from "./connection.class";
import LinkerLine from "linkerline";
import {ProcessusService} from "../../../services/processus.service";
import {Etape} from "../../../models/etape.model";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {ConnexionService} from "../../../services/connexion.service";
import {Connexion} from "../../../models/connexion.model";
import {NzModalService} from "ng-zorro-antd/modal";
import {Processus} from "../../../models/processus.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  imports: [
    CellComponent,
    NzColDirective,
    NzRowDirective,
    CdkDropList,
    NzFlexDirective,
    NgClass,
    NzSpinComponent,
    NgIf
  ],
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit,AfterViewInit{
  @ViewChild('grid', { read: ElementRef }) grid!: ElementRef;
  @Output('loading')  loading = new EventEmitter<boolean>;
  @Output('processValues') processValues = new EventEmitter<Processus>;
  nbRows:number = 3;
  nbCols:number = 3;
  indexRowDotCurr:number =-1;
  indexColDotCurr:number =-1;
  indexRowDotNext:number =-1;
  indexColDotNext:number =-1;
  arrayRows = new Array(this.nbRows);
  arrayCols = new Array(this.nbCols);
  gridComponentInstance! : GridComponent;
  processItems:(BaseEtape | null)[][] = [];
  connetions : Connection[] = [];
  connexions : ConnectionSet;
  isDotsVisible:boolean = false;
  isLoading:boolean =false;

  constructor(@Inject(DOCUMENT) private document:Document,
              private modalService: NzModalService,
              private processusService : ProcessusService,
              private connexionService : ConnexionService,
              private router : Router) {
    this.isLoading = true;
    this.connexions = new ConnectionSet();
    this.gridComponentInstance = this;
    setTimeout(() => {
      console.log("PRINT ATFER 8s")
      this.printProcessItems()
      this.printConnexions();
    }, 10000);

    if(this.processusService.processus.idProcessus === -1)
      this.router.navigate(['/processus']);
    else{
      this.nbRows = this.processusService.processus.nbLignes;
      this.nbCols = this.processusService.processus.nbColonnes;
      this.arrayRows = new Array(this.nbRows);
      this.arrayCols = new Array(this.nbCols);
      this.processItems =
        new Array(this.nbRows)
          .fill(null)
          .map(()=> new Array(this.nbCols).fill(null));
    }
  }

  ngAfterViewInit(): void {
    /**
     *  build connecxions on view initialization
     */
    if(this.processusService.processus.idProcessus){
      this.connexionService.getConnexionsByprocess(this.processusService.processus.idProcessus)
        .subscribe(connexions=>{
          //create connexions
          connexions.forEach(cnx=>{
            this.createConnexion(
              cnx.from.indexLigne,
              cnx.from.indexColonne,
              cnx.to.indexLigne,
              cnx.to.indexColonne
            )
          })
        },
        error => {
          console.error("Error at building connexions for 'Etapes' at grid AfterViewInit : "+error);
        },
          ()=>{
            this.isLoading=false;
          }
          )
    }
    }
  ngOnInit(): void {
    if(this.processusService.processus && this.processusService.processus.idProcessus){
      this.isLoading=true;
      this.processusService.retrieveProcessById(this.processusService.processus.idProcessus);

      /**
       * get "Etapes" from database and initialize grid matrix for processItems
       to initilize the view
       */
      this.processusService.retrieveEtapesByProcess(this.processusService.processus.idProcessus)
        .subscribe(processItems=>{
            processItems.forEach((etape:Etape)=>{
              this.processItems[etape.indexLigne][etape.indexColonne]= (etape as BaseEtape);
            });
          },
          error => {
            console.error("Error at fetching 'Etapes' at grid OnInit : "+error);
          },
          ()=>{
            this.isLoading=false;
          }
        )

    }

  }



  printProcessItems()
  {
    for(let i=0; i<this.nbRows; i++)
    {
      for(let j=0;j<this.nbCols;j++)
      {
        if (this.processItems[i][j] == null) {
          console.log("["+i+"]["+j+"]NULL");
        } else {
          console.log("["+i+"]["+j+"] TYPE is at grid: " + (this.processItems[i][j] as BaseEtape).description," MY ID = "+(this.processItems[i][j] as BaseEtape).idEtape);
          console.log("PROCESS = "+(this.processItems[i][j] as BaseEtape).processus?.nom);
          console.log("STATUT = "+statutfromJSONToString((this.processItems[i][j] as BaseEtape).statutEtape.toString()));
        }
      }
    }
  }

  updateRefProcessItems(eventData:{processItem:BaseEtape ,rowIndex:number,colIndex:number})
  {
    this.processItems[eventData.rowIndex][eventData.colIndex] = eventData.processItem;
    this.printProcessItems();
  }

  getConnectionIndexByProcessItemIndex(rowIndex:number,colIndex:number){
    let index=0;
    for(let conn of this.connetions){
      if(conn.getFrom() == this.processItems[rowIndex][colIndex]
        || conn.getTo() == this.processItems[rowIndex][colIndex]
      ){
        return index;
      }
      index++;
    }
    // no connections found for this processItem
    return -1;
  }

  /*deleteRefProcessItems(eventData:{rowIndex:number,colIndex:number})
  {
    let index:number = this.getConnectionIndexByProcessItemIndex(eventData.rowIndex,eventData.colIndex);
    //delete all connections found
    while(index != -1){
      this.connetions[index].getLineConnection().remove();
      this.connetions.splice(index,1);
      index = this.getConnectionIndexByProcessItemIndex(eventData.rowIndex,eventData.colIndex);
    }
    console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"] BEFORE DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);
    this.processItems[eventData.rowIndex][eventData.colIndex] = null;
    console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"]  AFTER DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);
  }*/

  deleteRefProcessItems(eventData:{rowIndex:number,colIndex:number})
  {
    let conn = this.connexions.getConnectionByIndexAtGrid(eventData.rowIndex,eventData.colIndex);
    //delete all connections found
    while(conn != undefined){
      conn.getLineConnection().remove();
      this.connexions.remove(conn);
      conn = this.connexions.getConnectionByIndexAtGrid(eventData.rowIndex,eventData.colIndex);
    }
    this.connexions.print();
    console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"] BEFORE DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);
    this.processItems[eventData.rowIndex][eventData.colIndex] = null;
    console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"]  AFTER DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);

  }

  addRow(){
    this.nbRows++;
    this.arrayRows = new Array(this.nbRows);
    this.processItems.push(new Array(this.nbCols).fill(null));
  }
  addCol(){
    this.nbCols++;
    this.arrayCols = new Array(this.nbCols);
    this.processItems.forEach(row => row.push(null));
  }

  sauvegarderEtapes(){
    this.loading.emit(true);

    /** get max indexRow and max IndexCols to save only the numbers of occupied rows and columns **/
    let maxRow = 0;
    let maxCol = 0;
    if(this.processusService.processus && this.processusService.processus.idProcessus){
      //update list of "Etape" (Add,delete,update)
      let etapesModel : Etape[] = [];

      for (let i = 0; i < this.nbRows; i++) {
        for (let j = 0; j < this.nbCols; j++) {
          if(this.processItems[i][j] != null){
            const etape = this.processItems[i][j] as Etape;
            etapesModel.push({
              idEtape : etape.idEtape,
              description : etape.description,
              indexLigne : etape.indexLigne,
              indexColonne: etape.indexColonne,
              ordre : etape.ordre,
              delaiAttente : etape.delaiAttente,
              dureeEstimee : etape.dureeEstimee,
              first : etape.first,
              intermediate : etape.intermediate,
              end : etape.end,
              paid : etape.paid,
              validate : etape.validate,
              statutEtape : etape.statutEtape,
              pourcentage : etape.pourcentage,
              type : etape.type,
              processus : etape.processus
            });
            maxRow = Math.max(maxRow,etape.indexLigne);
            maxCol = Math.max(maxCol,etape.indexColonne);
          }
        }
      }

      console.log(etapesModel)
      /**  update Process rows and cols**/
      this.processusService.updateProcessus({
        idProcessus : this.processusService.processus.idProcessus,
        nom : this.processusService.processus.nom,
        description : this.processusService.processus.description,
        nbLignes : maxRow+1,
        nbColonnes : maxCol+1
      })
        .subscribe(responseData=>{
          console.log("Processus updated succefully : "+responseData);
        },
          error => {
          console.error(error);
          })

      /** Update Etapes **/
      this.processusService.updateProcessEtapes(this.processusService.processus.idProcessus,etapesModel)
        .subscribe(responseData=>{
            console.log("RESPONSE PUT : "+responseData);
            /** Get Id for new "Etapes" **/
            // @ts-ignore
            this.processusService.retrieveEtapesByProcess(this.processusService.processus.idProcessus)
              .subscribe(etapes=>{
                etapes.forEach(etape=>{
                  const processItem = this.processItems[etape.indexLigne][etape.indexColonne];
                  if (processItem && processItem.idEtape === -1) {
                    processItem.idEtape = etape.idEtape;
                  }
                })

                /** Update connexions **/
                this.connexions.print();
                let connexionsModel : Connexion[] = [];
                this.connexions.getConnexionsList().forEach(cnx=>{
                  let etapeFrom = (cnx.getFrom() as Etape)
                  let etapeTo = (cnx.getTo() as Etape);
                  // here only the id is assigned
                  if(etapeFrom && etapeTo){
                    // @ts-ignore
                    connexionsModel.push({
                      from : {
                        idEtape: etapeFrom.idEtape,
                        description: '',
                        indexLigne: 0,
                        indexColonne: 0,
                        ordre: 0,
                        pourcentage: 0,
                        dureeEstimee: 0,
                        delaiAttente: 0,
                        statutEtape: StatutEtape.COMMENCEE,
                        first: false,
                        intermediate : false,
                        validate: false,
                        end: false,
                        paid: false
                      },
                      to : {
                        idEtape: etapeTo.idEtape,
                        description: '',
                        indexLigne: 0,
                        indexColonne: 0,
                        ordre: 0,
                        pourcentage: 0,
                        dureeEstimee: 0,
                        delaiAttente: 0,
                        statutEtape: StatutEtape.COMMENCEE,
                        first: false,
                        intermediate : false,
                        validate: false,
                        end: false,
                        paid: false
                      }
                    })
                  }
                })

                // @ts-ignore
                this.connexionService.updateConnexionsByProcess(this.processusService.processus.idProcessus,connexionsModel)
                  .subscribe(response => {
                      console.log("Response PUT connexions : "+response);
                    },
                    error => {
                      this.modalService.error({
                        nzTitle : "Erreur dans le serveur :",
                        nzContent : "Erreur lors de l'enregistrement du processus",
                        nzFooter : null,
                        nzOnCancel : ()=>{
                          return false;
                        }
                      })
                      this.loading.emit(false);
                      console.error("Error at updating Connexions :  "+error);
                    },
                    ()=>{
                    this.modalService.success({
                      nzTitle : "Sauvegarde réussite",
                      nzContent : "<p>Le processus est bien enregistré !</p>",
                      nzFooter : null,
                      nzOnCancel : ()=>{
                        return false;
                      }
                    })
                      this.loading.emit(false);
                      /*
                       * Linker needs upadte here because of spin for loading
                       */
                    })
              },error => {
                this.modalService.error({
                  nzTitle : "Erreur dans le serveur :",
                  nzContent : "Erreur lors de l'enregistrement du processus",
                  nzFooter : null,
                  nzOnCancel : ()=>{
                    return false;
                  }
                })
                this.loading.emit(false);
                console.error("Error at retrieving Etapes IDS :  "+error);
              })
          },
          error => {
            this.modalService.error({
              nzTitle : "Erreur dans le serveur !",
              nzContent : "Erreur lors de l'enregistrement du processus",
              nzFooter : null,
              nzOnCancel : ()=>{
                return false;
              }
            })
            this.loading.emit(false);
            console.error("Error at updating Etapes : "+error);
          },()=>{
            /**
             * Linker needs upadte here because of spin for loading
             */
          })
    }else{
      this.modalService.error({
        nzTitle : "Erreur !",
        nzContent : "Aucun processus est associé.",
        nzFooter : null,
        nzOnCancel : ()=>{
          return false;
        }
      })
      this.loading.emit(false);
      console.error("Error at retrieving Etapes IDS: Processus Id is undefined");
    }
  }

 /* dotLeftClicked(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1
      && this.indexColDotCurr!=-1
    ){
      this.indexRowDotNext = indexRow;
      this.indexColDotNext = indexCol;

      let rowCurr = this.indexRowDotCurr;
      let colCurr =this.indexColDotCurr;
      let rowNext = this.indexRowDotNext;
      let colNext = this.indexColDotNext;
      let idFrom:string = 'cell-'+rowCurr+'-'+colCurr;
      let idTo:string = 'cell-'+rowNext+'-'+colNext;

      console.log("ROWCURR = "+this.indexRowDotCurr +"/ COLCURR = "+ this.indexColDotCurr + "///// ROWNEXT ="+ this.indexRowDotNext +" / COLNEXT ="+ this.indexColDotNext)
      this.indexRowDotCurr = this.indexRowDotNext = this.indexRowDotCurr= this.indexColDotNext = -1;

      console.log('cell-'+rowNext+'-'+colNext);
      const el1 = document.getElementById(idFrom);
      const el2 = document.getElementById(idTo);
      const grid = this.grid.nativeElement;
      if (el1 && el2 && this.processItems[rowCurr][colCurr]) {
        const conn :Connection = new Connection(
          idFrom,
          idTo,
          this.processItems[rowCurr][colCurr],
          this.processItems[rowNext][colNext],
          new LinkerLine<any, any>(
            {
              parent: grid,
              start: el1,
              end: el2,
              color: '#000000',
              outline: true,
              outlineColor : '#000000',
              endPlugOutline: true,
              endPlugSize: 1.1,
              startPlug : "disc",
              endPlug : "arrow2",
              startSocket : "right",
              endSocket : "left",
              path : "straight"
            })
          );
        this.connetions.push(conn);
        this.printConnexions();
        /!*conn.getLineConnection().element.addEventListener('click', (event) => {
          console.log('Line clicked!', event);
        });*!/
        this.printProcessItems();
      } else {
        console.error('One or both elements not found OR There is no processItem at ['+rowCurr+']['+colCurr+']');
      }
    }
  }*/

  dotLeftClicked(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1
      && this.indexColDotCurr!=-1
    ){
      this.indexRowDotNext = indexRow;
      this.indexColDotNext = indexCol;

      let rowCurr = this.indexRowDotCurr;
      let colCurr =this.indexColDotCurr;
      let rowNext = this.indexRowDotNext;
      let colNext = this.indexColDotNext;

      this.createConnexion(rowCurr,colCurr,rowNext,colNext);
      this.indexRowDotCurr = this.indexRowDotNext = this.indexRowDotCurr= this.indexColDotNext = -1;
      this.connexions.print();

    }
  }

  getOrderByCell(rowIndex:number,colIndex:number){
    let order:number=1;
    let col:number=0;
    while (col!=colIndex){
      for(let i=0;i<this.nbRows;i++){
        if(this.processItems[i][col]!= null)
          order++;
      }
      col++;
    }

    for(let i=0;i<this.nbRows;i++){
      if(this.processItems[i][colIndex]!=null)
        order++;
    }
    return order;
  }

  dotRightHovered(indexRow:number,indexCol:number){
    if(this.processItems[indexRow][indexCol] != null){
      this.indexRowDotCurr=indexRow;
      this.indexColDotCurr=indexCol;
    }
  }

  dotNotHovered(){
    this.indexRowDotCurr=-1;
    this.indexColDotCurr=-1;
  }

  /**
   * position :
   0 : top
   1 : right
   2: bottom
   3: left
   * */
  isDotVisible(indexRow:number,indexCol:number,position:number){
    if(this.processItems[indexRow][indexCol]){
      switch (position){
        case 0:
          return indexRow != 0;
        case 1:
          return true;
        case 2:
          return true;
        case 3:
          return indexCol != 0;
        default:
          return false;
      }
    }
    return false;
  }

  dotClicked(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr==indexRow && this.indexColDotCurr==indexCol){
      this.indexRowDotCurr = -1;
      this.indexColDotCurr = -1;
    }
    else if(this.indexRowDotCurr==-1 && this.indexColDotCurr==-1){
      this.indexRowDotCurr = indexRow;
      this.indexColDotCurr = indexCol;
    }
    else{
      this.indexRowDotNext = indexRow;
      this.indexColDotNext = indexCol;
      this.createConnexion( this.indexRowDotCurr,this.indexColDotCurr, this.indexRowDotNext,this.indexColDotNext);
      this.indexRowDotCurr = -1;
      this.indexColDotCurr = -1;
      this.indexRowDotNext = -1;
      this.indexColDotNext = -1;
    }

  }

  /**
   * To allow border css on the cell where a dot is clicked
   * */
  onDotClickedCSS(indexRow:number,indexCol:number){
    return this.indexRowDotCurr == indexRow && this.indexColDotCurr == indexCol;
  }


  isDotLeftVisible(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1 && this.indexColDotCurr !=-1 && this.processItems[indexRow][indexCol]){
      if(indexCol == this.indexColDotCurr+1)
        return true;
    }
    return false;
  }

  isDotRightVisible(indexRow:number,indexCol:number){
    if(this.indexRowDotCurr !=-1 && this.indexColDotCurr !=-1 && this.processItems[indexRow][indexCol]){
      if(indexRow == this.indexRowDotCurr && indexCol == this.indexColDotCurr)
        return true;
    }
    return false;
  }

  printConnexions():void {
    console.log("****************************** CONNEXIONS :")
    for(let i=0;i<this.connetions.length;i++){
      console.log("FROM["+this.connetions[i].getFrom()?.indexLigne+"]["+this.connetions[i].getFrom()?.indexColonne+"] id = ",
        this.connetions[i].getFrom()?.idEtape,":: TO["+this.connetions[i].getTo()?.indexColonne+"]["+this.connetions[i].getTo()?.indexColonne+"] id=",this.connetions[i].getTo()?.idEtape);
  }
}

  /*updateConnections(){
    this.connetions.forEach(connection=>{
      const elemFrom = document.getElementById(connection.getIdFrom());
      const elemTo = document.getElementById(connection.getIdTo());
      let fromRect;
      let toRect;
      let rectGrid;

      if(elemFrom!= null && elemTo !=null && this.grid.nativeElement != null){
        fromRect = elemFrom.getBoundingClientRect();
        toRect = elemTo.getBoundingClientRect();
        rectGrid = this.grid.nativeElement.getBoundingClientRect();
        //check the "From" cell is inside the Grid
        if(
          (toRect.top>= rectGrid.top
          && toRect.left >= rectGrid.left
          && toRect.right <= rectGrid.right
          && toRect.bottom <= rectGrid.bottom)
          ||
          (fromRect.top>= rectGrid.top
            && fromRect.left >= rectGrid.left
            && fromRect.right <= rectGrid.right
            && fromRect.bottom <= rectGrid.bottom
          )
        )
        {
          //check the "To" cell is inside the Grid
          connection.getLineConnection().show('draw',{
            duration : 1000,
            timing : "ease-out"
          });
          connection.getLineConnection().position();
         /!* else
            connection.getLineConnection().hide('none');*!/
        }
        else
          connection.getLineConnection().hide('none',);
      }

    });
  }*/
  createConnexion(indexRowFrom:number,
                  indexColFrom:number,
                  indexRowTo:number,
                  indexColTo:number
                  ):void{
    let idFrom:string = 'cell-'+indexRowFrom+'-'+indexColFrom;
    let idTo:string = 'cell-'+indexRowTo+'-'+indexColTo;

    const el1 = document.getElementById(idFrom);
    const el2 = document.getElementById(idTo);
    const grid = this.grid.nativeElement;
    if (el1 && el2
      && this.processItems[indexRowFrom][indexColFrom]
      && this.processItems[indexRowTo][indexColTo]) {
      const conn :Connection = new Connection(
        idFrom,
        idTo,
        this.processItems[indexRowFrom][indexColFrom],
        this.processItems[indexRowTo][indexColTo],
        new LinkerLine<any, any>(
          {
            parent: grid,
            start: el1,
            end: el2,
            color: '#000000',
            outline: true,
            outlineColor : '#000000',
            endPlugOutline: true,
            startPlugSize : 0.8,
            endPlugSize: 0.8,
            startPlug : "disc",
            endPlug : "arrow1",
            startSocket : "auto",
            endSocket : "auto",
            path : "straight",
            size : 3
          })
      );
      //this.connetions.push(conn);
      this.connexions.add(conn);
      this.printConnexions();
      /*conn.getLineConnection().element.addEventListener('click', (event) => {
        console.log('Line clicked!', event);
      });*/
      this.printProcessItems();
    }else{
      console.error('One or both elements not found OR There is no processItem at ['+indexRowFrom+']['+indexColFrom+'] or  ['+indexRowTo+']['+indexColTo+']');
    }


  }

  onCellClicked(){
    this.isDotsVisible = !this.isDotsVisible;
  }

}
