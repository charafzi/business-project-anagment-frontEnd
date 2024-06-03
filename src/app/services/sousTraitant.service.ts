import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SousTraitant} from "../models/sousTraitant.model";

@Injectable({
  providedIn : "root"
})
export class SousTraitantService{
  url:string = "http://localhost:8100/sousTraitant";

  constructor(private http:HttpClient) {
  }

  retrieveAllSousTraitants(){
    return this.http.get<SousTraitant[]>(this.url);
  }
}
