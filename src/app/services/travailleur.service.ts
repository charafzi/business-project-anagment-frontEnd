import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Travailleur} from "../models/travailleur.model";

@Injectable({
  providedIn : "root"
})
export class TravailleurService{
  url:string = "http://localhost:8100/travailleur";

  constructor(private http:HttpClient) {
  }

  retrieveAllTravailleurs(){
    return this.http.get<Travailleur[]>(this.url);
  }
}
