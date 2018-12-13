import { Injectable } from '@angular/core';
import { UserInterface } from '../modelos/usuario.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioCollection: AngularFirestoreCollection<UserInterface>;
  usuarioDoc: AngularFirestoreDocument<UserInterface>;
  usuarios: Observable<UserInterface[]>;
  usuario: Observable<UserInterface>;
  constructor(public authFirebase: AngularFireAuth) {
  }

  //INICIAR SESIÓN CON GOOGLE
  loginGoogle() {
    return this.authFirebase.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(error => console.error(error))
  }

  //INICIAR SESIÓN CON FACEBOOK
  loginFacebook() {
    return this.authFirebase.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .catch(error => console.error(error))
  }

  //OBTENER EL USUARIO ACTUAL
  getCurrentUser() {
    return this.authFirebase.auth.currentUser
  }

  //ESTADO DE LA SESIÓN
  getAuth() {
    return this.authFirebase.authState.map(res => res)
  }

  //CERRAR SESIÓN
  logOut() {
    return this.authFirebase.auth.signOut()
      .catch(error => console.error(error))
  }
}
