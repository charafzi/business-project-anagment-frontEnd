import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn : "root"})
export class UserService{
  url : string = 'http://localhost:8100/user';
  user : User ={
    nom : '',
    email : '',
    prenom : '',
    numTel : '',
    role : '',
    idUser :  -1
  }
  userId : number =3;

  constructor(private http: HttpClient) {
    this.getUserById(this.userId)
      .subscribe(user=>{
        this.user = user;
      },
        error => {
        console.error('Error at getting User with id = '+this.userId);
        })
  }

  getUserById(id : number){
    return this.http.get<User>(this.url+"/"+id);
  }

  getRole() : string{
    switch (this.user.role){
      case 'RESPONSABLE':
      return 'Responsible';
      case 'TEAMLEADER':
        return 'Teamleader';
      case 'SOUSTRAITANT':
        return 'Subcontractor';
      case 'TRAVAILLEUR':
        return 'Agent';
    }
    return '';
  }

  getFullName(): string{
    let name: string = '';
    if(this.user.nom)
      name+=this.user.nom;
    if(this.user.prenom)
      name+=' '+this.user.prenom
    return name;
  }

}
