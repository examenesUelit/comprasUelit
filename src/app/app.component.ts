import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CategoriaService } from './services/categoria.service';
import { ListaService } from './services/lista.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  seleccion: {
    nombre: string
  }
  busquedaObjeto: {
    buscar: string;
    categoria
  }
  isLogin: boolean = false;
  existeLista: boolean = false;
  nombreUsuario: string;
  fotoPerfil: string;
  usuarioId: string;
  opciones = [];
  categorias = [];
  categoria: string = '';
  uidUsuario: string = '';
  nombreLista: string = '';
  idListaActiva: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private listaService: ListaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.obtenerCategorias();
    this.isLogIn();
  }

  //OBTENER LA LISTA ACTIVA
  obtenerListaActiva() {
    this.nombreLista = '';
    this.idListaActiva = '';
    this.existeLista = false;
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.listaService.obtenerListasUsuario(this.uidUsuario)
      .subscribe(res => {
        // console.log(res)
        res.forEach(datos => {
          if (datos.estado == 'Activa') {
            if (datos.idUsuario == this.uidUsuario) {
              this.nombreLista = datos.nombre;
              this.idListaActiva = datos.firebaseId;
              this.existeLista = true;
            }
          }
        });
      });
  }

  //OBTENER TODAS LAS CATEGORIAS
  obtenerCategorias() {
    this.categoriaService.obtenerTodasCategorias()
      .subscribe(datos => {
        this.categorias = [];
        datos.map(categoria => {
          this.categorias.push(categoria.nombre);
        })
      });
  }

  //CAMBIA AL SELECCIONAR LA CATEGORIA
  seleccionCategoria(seleccionado: string) {
    let categoria
    if (this.opciones.length > 0) {
      categoria = this.opciones.indexOf(seleccionado);
      if (categoria == -1) {
        if (seleccionado == 'Todas') {
          this.opciones = [];
        } else {
          this.opciones.push(seleccionado);
        }
      }
      if (seleccionado == 'Todas') {
        this.opciones = [];
      }
    } else if (this.opciones.length == 0) {
      this.opciones.push(seleccionado);
    }
  }

  //BORRAR CATEGORIA DE LA LISTA
  borrarCategoria(categoria: string) {
    let ubicacion
    this.opciones.forEach(elemento => {
      if (elemento == categoria) {
        ubicacion = this.opciones.indexOf(elemento)
        if (ubicacion > -1) {
          this.opciones.splice(ubicacion, 1)
        }
      }
    });
  }

  //ALMACENAR BUSQUEDA EN STORAGE
  buscar(busqueda: HTMLInputElement) {
    this.busquedaObjeto = {
      buscar: busqueda.value,
      categoria: this.opciones
    }
    localStorage.setItem('busqueda', JSON.stringify(this.busquedaObjeto));
    this.router.navigate(['/buscar'])
      .then(() => {
        window.location.reload();
      });
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
          this.obtenerListaActiva()
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
