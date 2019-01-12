import { Component, OnInit } from '@angular/core';
import { ListaService } from 'src/app/services/lista.service';
import { ListaInterface } from 'src/app/modelos/lista.interface';
import { AuthService } from 'src/app/services/auth.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-usuarioslistas',
  templateUrl: './usuarioslistas.component.html',
  styleUrls: ['./usuarioslistas.component.css']
})
export class UsuarioslistasComponent implements OnInit {
  lista: ListaInterface = {
    idUsuario: '',
    firebaseId: '',
    nombreUsuario: '',
    nombre: '',
    estado: '',
    disponibilidad: '',
    fecha: '',
    tipo: ''
  }
  listas: ListaInterface[];
  isLogin: boolean = false;
  uidUsuario: string = '';
  existeLista: boolean = false;
  total: number = 0;

  constructor(
    private listaService: ListaService,
    private principalComponente: AppComponent,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.obtenerListas();
    this.listas = [];
  }

  //OBTENER TODAS LAS LISTAS DEL USUARIO
  obtenerListas() {
    this.total = 0
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.listaService.obtenerListasUsuario(this.uidUsuario)
      .subscribe(res => {
        this.listas = [];
        if (this.total == 0) {
          res.forEach(datos => {
            if (datos) {
              datos.productos = [];
              this.listaService.obtenerProductosLista(datos.firebaseId)
                .subscribe(res => {
                  res.forEach(elementos => {
                    if (elementos) {
                      datos.productos.push(elementos.firebaseId);
                    }
                  });
                });
              this.listas.push(datos);
              this.existeLista = true;
            }
          });
          this.total + 1;
        }
      });
  }

  //CAMBIAR EL ESTADO DE LA LISTA A DESACTIVADA
  desactivarLista(idLista: string, nombreLista: string) {
    this.total = 0
    if (confirm('¿Seguro que desea DESACTIVAR la lista "' + nombreLista + '"?')) {
      this.listaService.cambiarEstadoLista(idLista, 'Desactivada', this.total);
      this.cambiarEstado(true, idLista);
    }
  }

  //CAMBIAR EL ESTADO DE LA LISTA A ACTIVADA
  activarLista(idLista: string, nombreLista: string) {
    this.total = 0
    if (confirm('¿Seguro que desea ACTIVAR la lista "' + nombreLista + '"?')) {
      this.listaService.cambiarEstadoLista(idLista, 'Activada', this.total);
    }
  }

  //CAMBIAR LA LISTA ACTIVA
  cambiarEstado(desactivar: boolean, idLista: string) {
    this.listas.forEach(datos => {
      if (datos.firebaseId == idLista) {
        this.lista = datos;
      }
    });
    if (this.lista.firebaseId != '') {
      if (this.lista.disponibilidad == 'Desactivada') {
        alert('La lista debe estar ACTIVADA para porder seleccionarla como lista activa.');
      } else if (this.lista.disponibilidad == 'Activada') {
        if (desactivar) {
          this.lista.estado = 'Inactiva';
          this.listaService.editarEstadoLista(idLista, this.lista);
          this.principalComponente.obtenerListaActiva();
        } else if (!desactivar) {
          this.lista.estado = 'Activa';
          this.listaService.cambiarEstadoListaActiva(1, this.uidUsuario, idLista);
          this.listaService.editarEstadoLista(idLista, this.lista);
          this.principalComponente.obtenerListaActiva();
        }
      }
    }
  }

}
