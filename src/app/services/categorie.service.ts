import {Injectable} from "@angular/core";
import {Categorie} from "../models/categorie.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn : "root"})
export class CategorieService{
  url:string = "http://localhost:8100/categories";
  categories : Categorie[] = [];

  constructor(private http:HttpClient) {
    this.getAllCategories()
      .subscribe(categories=>{
          this.categories = categories;
        },
        error => {
          console.error("Error ate retrieving Categories from back-end : "+error)
        })
  }


  getAllCategories(){
    return this.http.get<Categorie[]>(this.url);
  }



  getCategorieById(id:number){
    return this.categories.find((cat: Categorie) => cat.idCategorie === id) || null;
  }
}
