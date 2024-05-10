import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {Connexion} from "../models/connexion.model";

@Injectable({
  providedIn : 'root'
})
export class ConnexionService{
  url:string = 'http://localhost:8100/connexions';
  constructor(private http:HttpClient) {
  }

  getConnexionsByprocess(processId:number){
   return this.http.get<Connexion[]>(this.url+"/processus/"+processId);
  }

  updateConnexionsByProcess(processId:number,conenxions: Connexion[]){
    return this.http.put(this.url+"/processus/"+processId,conenxions);
  }
}
