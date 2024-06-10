import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Etape} from "../models/etape.model";
import {Processus} from "../models/processus.model";
import {map} from "rxjs/operators"
import {TypeService} from "./type.service";
import {NzModalService} from "ng-zorro-antd/modal";

@Injectable({providedIn : "root"})
export class ProcessusService{
  url:string = "http://localhost:8100/processus";
  processus!:Processus;
  processusEdit!:Processus;
  /**
   * mode = 1 : Edit mode (for process management)
   * mode = 2 : View mode (for tasks management)
   **/
  mode:number = 1;
  /**
   * id of mainTask to get displayed if mode == 2
   **/
  idMainTask!:number;
  constructor(private http:HttpClient,
              private typeService:TypeService,
              private modalService : NzModalService
  ) {
    this.processus = {
      idProcessus : 7,
      nbColonnes: 6,
      nbLignes : 6,
      nom : "test",
      description : "test"
    }

    this.processusEdit = {
      idProcessus : -1,
      nbColonnes: 0,
      nbLignes : 0,
      nom : "",
      description : ""
    }
  }

  updateProcessEtapes(processId:number,etapes:Etape[]){
    return this.http.put(this.url+"/"+processId,etapes);
  }

  retrieveProcessById(processId:number){
    return this.http.get<Processus>(this.url+"/process/"+processId);
  }

  retrieveAllProcessus(){
    return this.http.get<Processus[]>(this.url+"/allprocess");
  }

  retrieveEtapesByProcess(processId:number){

    return this.http.get<Etape[]>(this.url+"/process/"+processId+"/etapes")
      .pipe(
        map(responseData=>{
          responseData.forEach(etape=>{
            //console.log("Id rerived : "+etape.idEtape)
          })
          return responseData;
        })
      )
  }

  saveProcessus(process:Processus){
    return this.http.post<Processus>(this.url,process);
  }

  updateProcessus(process : Processus){
    return this.http.put(this.url+"/process/"+process.idProcessus,process);
  }

  deleteProcessus(processId:number){
    return this.http.delete(this.url+"/"+processId);
  }


}
