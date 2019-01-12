import { Component, OnInit } from '@angular/core';
import { ListaService } from 'src/app/services/lista.service';
import { ListaInterface } from 'src/app/modelos/lista.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css']
})
export class ListasComponent implements OnInit {
  listas: ListaInterface[];
  isLogin: boolean = false;

  constructor(
    private listaService: ListaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLogIn();
    this.obtenerListas();
    this.listas = [];
  }

  //VERIFICAR SI ESTÁ AUTENTICADO EL USUARIO
  isLogIn() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      });
  }

  //OBTENER TODAS LAS LISTAS
  obtenerListas() {
    this.listas = [];
    this.listaService.obtenerTodasListas()
      .subscribe(listas => {
        this.listas = listas;
        if (listas) {
          listas.forEach(dato => {
            dato.productos = [];
            this.listaService.obtenerProductosLista(dato.firebaseId)
              .subscribe(res => {
                res.forEach(datos => {
                  if (datos) {
                    dato.productos.push(datos.firebaseId);
                  }
                });
              });
          })
        }
      });
  }

}
