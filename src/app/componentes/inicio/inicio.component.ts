import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  isLogin: boolean = false;
  usuarioId: string = '';
  categorias = [];

  constructor(
    private authService: AuthService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.obtenerCategorias();
    this.isLogIn();
    this.categorias = [];
  }

  //OBTENER TODAS LAS CATEGORIAS
  obtenerCategorias() {
    this.categoriaService.obtenerTodasCategorias()
      .subscribe(datos => {
        this.categorias = [];
        datos.map(categoria => {
          this.categorias.push(categoria);
        })
      });
  }

  //VERIFICAR SI ESTÁ AUTENTICADO EL USUARIO
  isLogIn() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.isLogin = true;
          this.usuarioId = this.authService.authFirebase.auth.currentUser.uid;
        } else {
          this.isLogin = false;
        }
      });
  }

}
