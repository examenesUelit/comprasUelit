import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLogin: boolean = false;
  nombreUsuario: string;
  fotoPerfil: string;
  usuarioId: string;

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit() {
    this.isLogIn();
  }

  //VERIFICAR SI ESTÁ AUTENTICADO EL USUARIO
  isLogIn() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.isLogin = true;
          this.nombreUsuario = respuesta.displayName;
          this.fotoPerfil = respuesta.photoURL;
          this.usuarioId = respuesta.uid;
          window.localStorage.setItem('id', respuesta.uid);
          window.localStorage.setItem('fotoPerfil', respuesta.photoURL);
          window.localStorage.setItem('email', respuesta.email);
          window.localStorage.setItem('nombre', respuesta.displayName);
          this.router.navigate(['/']);
        } else {
          this.isLogin = false;
        }
      });
  }

  //CERRAR SESIÓN
  logOut() {
    this.authService.logOut()
      .then(() => {
        this.isLogin = false;
        window.localStorage.clear();
        this.nombreUsuario = '';
        this.router.navigate(['/login']);
      }).catch(error => {
        console.error(error);
      });
  }

}
