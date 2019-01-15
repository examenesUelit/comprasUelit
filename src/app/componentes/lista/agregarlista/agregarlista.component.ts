import { Component, OnInit } from '@angular/core';
import { ListaInterface } from 'src/app/modelos/lista.interface';
import { ListaService } from 'src/app/services/lista.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-agregarlista',
  templateUrl: './agregarlista.component.html',
  styleUrls: ['./agregarlista.component.css']
})
export class AgregarlistaComponent implements OnInit {
  lista: ListaInterface = {
    idUsuario: '',
    nombreUsuario: '',
    nombre: '',
    estado: 'Activa',
    disponibilidad: 'Activada',
    fecha: '',
    tipo: 'Privada'
  }
  resultado: number = 0;

  constructor(
    private listaService: ListaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.obtenerTodo()
  }

  //OBTENER TODAS LAS LISTAS
  obtenerTodo() {
    this.listaService.obtenerTodasListas()
      .subscribe(res => {
        this.resultado = res.length
      });
  }

  //CREAR LISTA
  onCrearLista({ value }: { value: ListaInterface }) {
    if (value.nombre == '') {
      alert('Agregue un nombre a la lista');
    } else if (value.estado == '') {
      alert('Seleccione un estado para la lista');
    } else if (value.disponibilidad == '') {
      alert('Seleccione la privacidad de la lista');
    } else {
      this.lista = value
      this.lista.fecha = new Date().getTime();
      this.lista.disponibilidad = 'Activada';
      this.lista.estado = 'Activa';
      this.lista.idUsuario = this.authService.authFirebase.auth.currentUser.uid;
      this.lista.nombreUsuario = this.authService.authFirebase.auth.currentUser.displayName;
      if (this.resultado == 0) {
        this.listaService.agregarLista(this.lista);
      } else {
        if (this.listaService.cambiarEstado(1, this.lista.idUsuario) == true) {
          this.listaService.agregarLista(this.lista);
        }
      }
    }
  }

}
