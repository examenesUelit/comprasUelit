import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  //INICIAR SESIÓN CON GOOGLE
  logInGoogle() {
    this.authService.loginGoogle()
      .then(auth => {
        if (auth) {
          alert('Sesión iniciada correctamente desde Google')
        }
      }).catch(error => {
        alert(`Ha ocurrido un error al iniciar sesión ${error}`)
      })
  }

  //INICIAR SESIÓN CON FACEBOOK
  logInFacebook() {
    this.authService.loginFacebook()
      .then(auth => {
        if (auth) {
          alert('Sesión iniciada correctamente desde Facebook')
        }
      }).catch(error => {
        alert(`Ha ocurrido un error al iniciar sesión ${error}`)
      })
  }

}
