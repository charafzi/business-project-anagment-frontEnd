import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Tache} from "../models/tache.model";
import {Processus} from "../models/processus.model";

@Injectable({
  providedIn : "root"
})
export class TacheService{
  url:string = 'http://localhost:8100/tache';
  tacheEdit!:Tache;

  constructor(private http:HttpClient) {
    this.tacheEdit ={
      idTache : -1,
      objetTache : '',
      dateDebutPrevue : undefined,
      dateExpiration : undefined,
      travailleurs : [],
      sousTraitant : null
    }
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

  updateTacheMere(tache : Tache){
    return this.http.put(this.url+"/"+tache.idTache,tache);
  }

  updateTacheMereDateExpiration(tache : Tache){
    return this.http.put(this.url+"/"+tache.idTache+"/dateExpiration",tache);
  }

}
