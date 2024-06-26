import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {BaseEtape} from "../items/Etape.class";
import {DOCUMENT, NgClass, NgIf} from "@angular/common";
import {ProcessusService} from "../../../services/processus.service";
import {Etape} from "../../../models/etape.model";
import {ConnexionService} from "../../../services/connexion.service";
import {Connexion} from "../../../models/connexion.model";
import {NzModalService} from "ng-zorro-antd/modal";
import {Processus} from "../../../models/processus.model";
import {Router} from "@angular/router";
import {getStatutEtapeFromString} from "../../../models/StatutEtape";
import {Tache} from "../../../models/tache.model";
import {DurationUnite} from "../../../models/DurationUnite";
import {EtapeService} from "../../../services/etape.service";
import {TacheService} from "../../../services/tache.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {DemoNgZorroAntdModule} from "../../../ng-zorro-antd.module";
import {UserService} from "../../../services/user.service";
import {StatutTache} from "../../../models/StatutTache";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  imports: [
    CellComponent,
    NzColDirective,
    NzRowDirective,
    CdkDropList,
    DemoNgZorroAntdModule,
    NgClass,
    NgIf
  ],
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit,AfterViewInit{
  @ViewChild('grid', { read: ElementRef }) grid!: ElementRef;
  @Output('loading')  loading = new EventEmitter<boolean>;
  @Output('processValues') processValues = new EventEmitter<Processus>;
  /**
   * mode = 1 : Edit mode (for process management)
   * mode = 2 : View mode (for tasks management)
   **/
  mode : number = 1;
  nbRows:number = 3;
  nbCols:number = 3;
  indexRowDotCurr:number =-1;
  indexColDotCurr:number =-1;
  indexRowDotNext:number =-1;
  indexColDotNext:number =-1;
  arrayRows = new Array(this.nbRows);
  arrayCols = new Array(this.nbCols);
  processItems:(BaseEtape | null)[][] = [];
  tache! : Tache;
  isDotsVisible:boolean = false;
  etapesRetrived:boolean = false;
  isLoading:boolean =true;

  constructor(@Inject(DOCUMENT) private document:Document,
              private modalService: NzModalService,
              private processusService : ProcessusService,
              private connexionService : ConnexionService,
              private etapeService : EtapeService,
              private tacheService : TacheService,
              private userService : UserService,
              private msg : NzMessageService,
              private router : Router) {
    //this page is accessed directly
    if(this.processusService.processus.idProcessus === -1)
      this.router.navigate(['/processus']);
    else{
      this.mode = this.processusService.mode;
      this.nbRows = this.processusService.processus.nbLignes;
      this.nbCols = this.processusService.processus.nbColonnes;
      this.arrayRows = new Array(this.nbRows);
      this.arrayCols = new Array(this.nbCols);
      this.processItems =
        new Array(this.nbRows)
          .fill(null)
          .map(()=> new Array(this.nbCols).fill(null));
      this.etapeService.processItems = this.processItems;
      this.userService.getUserById(this.userService.userId)
        .subscribe(user=>{
            this.userService.user = user;
          },
          error=>{
            this.msg.error('Error at getting userId');
            console.error(error)
          })
    }
  }

  ngOnInit(): void {
    //if the processus exist
    if(this.processusService.processus && this.processusService.processus.idProcessus){
      this.processusService.retrieveProcessById(this.processusService.processus.idProcessus)
      /**
       * get "Etapes" from database and initialize grid matrix for processItems
       to initilize the view
       */
      this.processusService.retrieveEtapesByProcess(this.processusService.processus.idProcessus)
        .subscribe(processItems=>{
            processItems.forEach((etape:Etape)=>{
              this.processItems[etape.indexLigne][etape.indexColonne]= (etape as BaseEtape);
              //assing subTasks to each BaseEtape
            });
            //assign subTasks if mode == 2
            if(this.mode==2){
              this.tacheService.getTacheMereById(this.processusService.idMainTask)
                .subscribe(tache=>{
                    this.tache = tache;
                    this.tache.sous_taches?.forEach(tache=>{
                      // @ts-ignore
                      tache.dateDebutPrevue = new Date(tache.dateDebutPrevue);
                      // @ts-ignore
                      tache.dateExpiration = new Date(tache.dateExpiration);
                      tache.sous_taches?.forEach(sous_tache=>{
                        // @ts-ignore
                        sous_tache.dateDebutPrevue = new Date(sous_tache.dateDebutPrevue);
                        // @ts-ignore
                        sous_tache.dateExpiration = new Date(sous_tache.dateExpiration);
                        if(sous_tache.dateDebutEffective){
                          // @ts-ignore
                          sous_tache.dateDebutEffective = new Date(sous_tache.dateDebutPrevue);
                        }
                        if(sous_tache.dateFinEffective){
                          // @ts-ignore
                          sous_tache.dateFinEffective = new Date(sous_tache.dateFinEffective);
                        }
                      })
                    })
                    this.tache.sous_taches?.forEach(sousTache=>{
                      const indexLigne = sousTache.etape?.indexLigne;
                      const indexColonne = sousTache.etape ?.indexColonne;
                      if (indexLigne !== undefined && indexColonne !== undefined) {
                        const processItem = this.processItems[indexLigne][indexColonne];
                        if (processItem) {
                          processItem.tache = sousTache;
                        }else{
                          console.error("Error at assigning processItem : processItem is undefined.")
                        }
                      }else{
                        console.error("Error at assigning processItem : ",indexLigne," & ",indexColonne," are undefined.")
                      }
                    })


                  },
                  error => {
                    console.error("Error at getting mainTask from back-end on mode == 2 :"+error);
                  })
            }
          },
          error => {
          this.msg.error('Error at fetching steps');
            console.error("Error at fetching 'Etapes' at grid OnInit : "+error);
          },
          ()=>{
            this.isLoading=false;
            this.etapesRetrived = true;
          }
        )
    }
  }


  ngAfterViewInit(): void {
    setTimeout(()=>{
      //assign the document and the grid
      this.connexionService.document = this.document;
      this.connexionService.grid=this.grid;
      /**
       *  build connexions if exist on view initialization
       */
      if(this.processusService.processus.idProcessus){
        this.connexionService.getConnexionsByprocess(this.processusService.processus.idProcessus)
          .subscribe(connetions=>{
              //clear the connectionSet to be filled with the connections of a selected process
              this.connexionService.getConnectionSet().clear();
              //assign the matrix after completing
              this.connexionService.processItems=this.processItems;
              //Create connetions
              connetions.forEach(cnx=>{
                this.connexionService.createConnexion(
                  cnx.from.indexLigne,
                  cnx.from.indexColonne,
                  cnx.to.indexLigne,
                  cnx.to.indexColonne,
                  cnx.delaiAttente,
                  cnx.delaiAttenteUnite,
                  getStatutEtapeFromString(cnx.statut ? cnx.statut.toString() : '')
                );
              })
            },
            error => {
              console.error("Error at building connexions for 'Etapes' at grid AfterViewInit : "+error);
            },
            ()=>{

            }
          )
      }
    },100)
  }
  /*printProcessItems()
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
        }
      }
    }
  }*/

  updateRefProcessItems(eventData:{processItem:BaseEtape ,rowIndex:number,colIndex:number})
  {
    this.processItems[eventData.rowIndex][eventData.colIndex] = eventData.processItem;
  }

  deleteRefProcessItems(eventData:{rowIndex:number,colIndex:number})
  {
    this.connexionService.deleteAllConnectionsToCell(eventData.rowIndex,eventData.colIndex);
    //console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"] BEFORE DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);
    this.processItems[eventData.rowIndex][eventData.colIndex] = null;
    //console.log("PROCESS ITEM AT GRID["+eventData.rowIndex+"]["+eventData.colIndex+"]  AFTER DELETE : "+ this.processItems[eventData.rowIndex][eventData.colIndex]);
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
              dureeEstimee : etape.dureeEstimee,
              dureeEstimeeUnite : etape.dureeEstimeeUnite,
              first : etape.first,
              intermediate : etape.intermediate,
              end : etape.end,
              paid : etape.paid,
              validate : etape.validate,
              accepted : etape.accepted,
              //statutEtape : etape.statutEtape,
              //pourcentage : etape.pourcentage,
              type : etape.type,
              processus : etape.processus,
              categorie : etape.categorie
            });
            maxRow = Math.max(maxRow,etape.indexLigne);
            maxCol = Math.max(maxCol,etape.indexColonne);
          }
        }
      }

      //console.log(etapesModel)
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
            /** Update Etapes **/
            // @ts-ignore
            this.processusService.updateProcessEtapes(this.processusService.processus.idProcessus,etapesModel)
              .subscribe (responseData=>{
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
                      let connexionsModel : Connexion[] = [];
                      this.connexionService.getConnectionSet().connections.forEach(cnx=>{
                        let etapeFrom = (cnx.getFrom() as Etape)
                        let etapeTo = (cnx.getTo() as Etape);
                        // here only the id is assigned
                        if(etapeFrom && etapeTo){
                          connexionsModel.push({
                            from : {
                              idEtape: etapeFrom.idEtape,
                              description: '',
                              indexLigne: 0,
                              indexColonne: 0,
                              ordre: 0,
                              //pourcentage: 0,
                              dureeEstimee: 0,
                              dureeEstimeeUnite : DurationUnite.HOUR,
                              //statutEtape: StatutEtape.COMMENCEE,
                              first: false,
                              intermediate : false,
                              validate: false,
                              end: false,
                              paid: false,
                              accepted : false,
                              categorie : null,
                              type : null
                            },
                            to : {
                              idEtape: etapeTo.idEtape,
                              description: '',
                              indexLigne: 0,
                              indexColonne: 0,
                              ordre: 0,
                              //pourcentage: 0,
                              dureeEstimee: 0,
                              dureeEstimeeUnite : DurationUnite.HOUR,
                              //statutEtape: StatutEtape.COMMENCEE,
                              first: false,
                              intermediate : false,
                              validate: false,
                              end: false,
                              paid: false,
                              accepted : false,
                              categorie : null,
                              type : null
                            },
                            statut : cnx.statut,
                            delaiAttente : cnx.delaiAttente,
                            delaiAttenteUnite : cnx.delaiAttenteUnite
                          })
                        }
                      })

                      // @ts-ignore
                      this.connexionService.updateConnexionsByProcess(this.processusService.processus.idProcessus,connexionsModel)
                        .subscribe(response => {
                            console.log("Response PUT connexions : "+response);
                          },
                          error => {
                          this.msg.error('Server error : error during saving')
                            this.loading.emit(false);
                            console.error("Error at updating Connexions :  "+error);
                          },
                          ()=>{
                           this.msg.success("Process saved successfully")
                            this.loading.emit(false);
                          })
                    },error => {
                      this.msg.error('Server error : error during saving')
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

                })
        },
          error => {
          console.error("Error at updating processus properties : "+error);
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
      this.connexionService.processItems=this.processItems;
      let result = this.connexionService.createConnexion(this.indexRowDotCurr,this.indexColDotCurr, this.indexRowDotNext,this.indexColDotNext)
      if(result == 0){
        this.msg.warning('This connection has already been set up');
      }
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

  updateProcessItems(eventData:{}){
    //update the matrix of steps on connexion service when an item is dropped in grid
    this.connexionService.processItems=this.processItems;
  }

  //Create connections from based on lists from modal creation
  connectProcessItems(eventData:{indexRow:number,indexCol:number,stepsBefore : string[],stepsAfter : string[]}){
    try{
      this.connexionService.processItems=this.processItems;
      if(eventData.stepsBefore.length != 1){
        for(let i=1; i<eventData.stepsBefore.length;i++){
          let indexs = eventData.stepsBefore[i].split("-");
          let result = this.connexionService.createConnexion(parseInt(indexs[0]),parseInt(indexs[1]),eventData.indexRow,eventData.indexCol)
          if(result == 0){
            this.msg.warning('This connection has already been set up');
          }
        }
      }

      if(eventData.stepsAfter.length != 1){
        for(let i=1; i<eventData.stepsAfter.length;i++){
          let indexs = eventData.stepsAfter[i].split("-");
          let result = this.connexionService.createConnexion(eventData.indexRow,eventData.indexCol,parseInt(indexs[0]),parseInt(indexs[1]))
          if(result == 0){
            this.msg.warning('This connection has already been set up');
          }
        }
      }
    }
    catch (error){
      this.modalService.error({
        nzTitle : "Error at creating connections please try again !"
      })
      console.error(error);
    }
  }

  onCellClicked(rowIndex:number,colIndex:number){
    switch (this.mode){
      case 1:
        this.isDotsVisible = !this.isDotsVisible;
        break;
      case 2:
        if(this.processItems[rowIndex][colIndex])
        {
          if(this.processItems[rowIndex][colIndex]?.tache){
            if(['Subcontractor','Agent'].includes(this.userService.getRole())){
              if(!this.processItems[rowIndex][colIndex]?.first){
                let etapes : BaseEtape [] = this.connexionService.getEtapesTo(rowIndex,colIndex);
                let allDones = true;
                etapes.forEach(etape=>{
                  if(etape.tache && etape.tache.statutTache!=StatutTache.TERMINE){
                    allDones = false;
                  }
                })
                if(!allDones){
                  this.msg.warning('All previous tasks should be done before accessing to this')
                }else{
                  (this.processItems[rowIndex][colIndex] as BaseEtape).subTaskModalIsVisibe=true;
                }
              }else{
                (this.processItems[rowIndex][colIndex] as BaseEtape).subTaskModalIsVisibe=true;
              }
            }else{
              (this.processItems[rowIndex][colIndex] as BaseEtape).subTaskModalIsVisibe=true;
            }
          }
        }
        break;
    }
  }

}
