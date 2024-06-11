import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Tache} from "../models/tache.model";
import {Processus} from "../models/processus.model";
import {Paiement} from "../models/paiement.model";
import {Validation} from "../models/validation.model";

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

  savePaiement(idTache : number,paiement : Paiement){
    return this.http.post<Paiement>(this.url+"/"+idTache+"/payment",paiement)
  }

  retrieveAllPayments(idTache : number){
    return this.http.get<Paiement[]>(this.url+"/"+idTache+"/payments");
  }

  saveValidation(idTache:number,validation : Validation){
    return this.http.post<Validation>(this.url+"/"+idTache+"/validation",validation)
  }

  retrieveAllValidations(idTache : number){
    return this.http.get<Validation[]>(this.url+"/"+idTache+"/validations");
  }

  retrieveAllTachesMereByAgent(idAgent : number){
    return this.http.get<Tache[]>(this.url+"/travailleur/"+idAgent);
  }

  retrieveAllTachesMereBySubcontractor(idSt : number){
    return this.http.get<Tache[]>(this.url+"/sousTraitant/"+idSt);
  }
}
