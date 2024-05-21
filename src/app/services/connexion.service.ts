import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {Connexion} from "../models/connexion.model";
import {BaseEtape} from "../pages/workspace/items/Etape.class";
import {ConnectionSet} from "../pages/workspace/grid/connection.class";

@Injectable({
  providedIn : 'root'
})
export class ConnexionService{
  connectionSet : ConnectionSet = new ConnectionSet();
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


}
