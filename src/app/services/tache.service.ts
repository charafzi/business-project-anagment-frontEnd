import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Tache} from "../models/tache.model";
import {Processus} from "../models/processus.model";

@Injectable({
  providedIn : "root"
})
export class TacheService{
  url:string = 'http://localhost:8100/tache';

  constructor(private http:HttpClient) {
  }

  retrieveAllTachesMere(){
    return this.http.get<Tache[]>(this.url);
  }

  deleteTacheMere(id:number){
    return this.http.delete(this.url+"/"+id);
  }

  createTacheMere(tache:Tache,idProcess:number){
    return this.http.post<Tache>(this.url+"/process/"+idProcess,tache);
  }

  getTacheMereById(idTacheMere:number){
    return this.http.get<Tache>(this.url+"/"+idTacheMere);
  }

  getProcessByIdTacheMere(idTacheMere:number){
    return this.http.get<Processus>(this.url+"/"+idTacheMere+"/process");
  }
  
  updateSousTache(sousTache:Tache){
    return this.http.put(this.url+"/sousTache/"+sousTache.idTache,sousTache);
  }

}
