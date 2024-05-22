import {ElementRef, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {Connexion} from "../models/connexion.model";
import {BaseEtape} from "../pages/workspace/items/Etape.class";
import {Connection, ConnectionSet} from "../pages/workspace/grid/connection.class";
import LinkerLine from "linkerline";

@Injectable({
  providedIn : 'root'
})
export class ConnexionService{
  grid!: ElementRef; //this to refere the parent component that hold cells to create connections with LeaderLine
  document!:Document;
  private connectionSet : ConnectionSet = new ConnectionSet();
  url:string = 'http://localhost:8100/connexions';
  /**
   it's used to hold temporarily the matrix of "Etape" to help to transfer it from the grid component
   and use it in the modal for step creation to display the steps (Etapes) on the list
   */
  processItems:(BaseEtape | null)[][] = [];
  constructor(private http:HttpClient) {
  }

  getConnectionSet():ConnectionSet{
    return this.connectionSet;
  }
  deleteAllConnectionsToCell(rowIndex:number,colIndex:number){
    let conn = this.connectionSet.getConnectionByIndexAtGrid(rowIndex,colIndex);
    //delete all connections found
    while(conn != undefined){
      conn.getLineConnection().remove();
      this.connectionSet.remove(conn);
      conn = this.connectionSet.getConnectionByIndexAtGrid(rowIndex,colIndex);
    }
  }
  getConnexionsByprocess(processId:number){
   return this.http.get<Connexion[]>(this.url+"/processus/"+processId);
  }

  updateConnexionsByProcess(processId:number,conenxions: Connexion[]){
    return this.http.put(this.url+"/processus/"+processId,conenxions);
  }

  getEtapesFromGrid():BaseEtape[]{
    let etapes : BaseEtape[] = [];
    for (let i = 0; i <this.processItems.length; i++) {
      for (let j = 0; j < this.processItems[i].length; j++) {
        const item = this.processItems[i][j];
        if (item !== null) {
          etapes.push(item as BaseEtape);
        }
      }
    }
    return etapes;
  }

  createConnexion(indexRowFrom:number,
                  indexColFrom:number,
                  indexRowTo:number,
                  indexColTo:number,
  ):number{
    try {
      console.log("i will create :::"+this.grid)
      //wait the grid to be ready before creating connections
      let idFrom:string = 'cell-'+indexRowFrom+'-'+indexColFrom;
      let idTo:string = 'cell-'+indexRowTo+'-'+indexColTo;

      const el1 = this.document.getElementById(idFrom);
      const el2 = this.document.getElementById(idTo);
      const grid = this.grid.nativeElement;
      console.log("this is the grid :"+this.grid.nativeElement)
      if (el1 && el2
        && this.processItems[indexRowFrom][indexColFrom]
        && this.processItems[indexRowTo][indexColTo]) {
        let found = this.connectionSet.foundConnection(idFrom,idTo);
        if(found == undefined){
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
                color: this.generateRandomColor(),
                outline: true,
                outlineColor : '#000000',
                endPlugOutline: true,
                startPlugSize : 0.8,
                endPlugSize: 1.0,
                startPlug : "disc",
                endPlug : "arrow1",
                startSocket : "auto",
                endSocket : "auto",
                path : "straight",
                size : 3
              })
          );
          this.connectionSet.add(conn);
          this.connectionSet.print();
          /*conn.getLineConnection().element.addEventListener('click', (event) => {
            console.log('Line clicked!', event);
          });*/
          return 1;
        }else{
          /*this.modalService.warning({
            nzTitle : "This connection has already been set up !",
          })*/
          return 0;
        }
      }else{
        console.error('One or both elements not found OR There is no processItem at ['+indexRowFrom+']['+indexColFrom+'] or  ['+indexRowTo+']['+indexColTo+']');
        return -1;
      }
    }
    catch (error){
      console.error(error);
      return -1;
    }
  }

  getEtapesTo(rowIndex:number,colIndex:number):BaseEtape[] {
    let etapes: BaseEtape[] = [];
    this.connectionSet.connections.forEach(cnx => {
      if (cnx.getTo() && cnx.getTo()?.indexLigne === rowIndex && cnx.getTo()?.indexColonne === colIndex) {
        etapes.push(cnx.getFrom() as BaseEtape);
      }
    })
    return etapes;
  }

  getEtapesFrom(rowIndex:number,colIndex:number):BaseEtape[] {
    let etapes: BaseEtape[] = [];
    this.connectionSet.connections.forEach(cnx => {
      if (cnx.getFrom() && cnx.getFrom()?.indexLigne === rowIndex && cnx.getFrom()?.indexColonne === colIndex) {
        etapes.push(cnx.getTo() as BaseEtape);
      }
    })
    return etapes;
  }

  deleteConnection(rowFromIndex:number,colFromIndex:number,rowToIndex:number,colToIndex:number):number{
   try {
     let connection = this.connectionSet.connections.find(cnx=>
       cnx.getFrom()?.indexLigne===rowFromIndex
       && cnx.getFrom()?.indexColonne===colFromIndex
       && cnx.getTo()?.indexLigne===rowToIndex
       && cnx.getTo()?.indexColonne===colToIndex
     )
     if(connection !== undefined)
     {
       connection.getLineConnection().remove();
       this.connectionSet.remove(connection);
       return 1;
     }
     return 0;
   }
   catch (error){
     console.error(error);
     return 0;
   }
  }

  generateRandomColor(): string {
    // Génère trois valeurs de couleur aléatoires pour les composantes rouge, vert et bleu
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Convertit les valeurs de couleur en représentation hexadécimale
    const redHex = red.toString(16).padStart(2, '0'); // Convertit en hexadécimal et assure une longueur de 2 chiffres
    const greenHex = green.toString(16).padStart(2, '0'); // Convertit en hexadécimal et assure une longueur de 2 chiffres
    const blueHex = blue.toString(16).padStart(2, '0'); // Convertit en hexadécimal et assure une longueur de 2 chiffres

    // Combine les composantes rouge, vert et bleu pour former un code couleur hexadécimal
    const colorHex = `#${redHex}${greenHex}${blueHex}`;

    return colorHex;
  }

}
