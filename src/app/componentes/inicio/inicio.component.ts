import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  isLogin: boolean = false;
  uidUsuario: string = '';

  constructor(
    private authService: AuthService,

  ) { }

  ngOnInit() {
    this.isLogIn();
  }

  //VERIFICAR SI ESTÁ AUTENTICADO EL USUARIO
  isLogIn() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.isLogin = true;
          this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
        } else {
          this.isLogin = false;
        }
      });
  }

}
