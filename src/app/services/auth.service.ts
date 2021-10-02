import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.api;
  token:string;
  userId:string;
  isAuth$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }
  
  signup(nom:string, prenom:string, email:string, identifiant:string, mdp: string){
    return new Promise((resolve, reject)=>{
      this.http.post(this.api+'/api/signup', {nom:nom, prenom:nom, email:email, identifiant:identifiant, mdp: mdp}).subscribe(
        (signUpData: {status:number, message: string})=>{
          if(signUpData.status === 201){
          //authentifier l'utilisateur
          this.signin(email, mdp)
          .then(()=>{
            resolve(true);
            })
          .catch((err)=>{
            reject(err)
            });  
          }else{
            reject(signUpData.message);
          }

        },
        (err)=>{
          reject(err)
        }
      )
    })
  }

  signin(email:string, mdp: string){
    return new Promise((resolve, reject)=>{
      this.http.post(this.api+'/api/signup', { email:email, mdp: mdp}).subscribe(
        (authData: {token: string, userId:string})=>{
         this.token = authData.token;
         this.userId = authData.userId;
         this.isAuth$ = authData.isAuth$.next(true);
         resolve(true); 
        },
        (err)=>{
          reject(err)
        }
      )
    })
  }

  logout(){
    this.isAuth$.next(false);
    this.userId = null;
    this.token = null;
  }
}
