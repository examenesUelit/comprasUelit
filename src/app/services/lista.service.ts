import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { ListaInterface } from '../modelos/lista.interface';
import { Router } from '@angular/router';
import { ListaProducto } from '../modelos/listaProducto.interface';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  listaCollection: AngularFirestoreCollection<ListaInterface>;
  listaDoc: AngularFirestoreDocument<ListaInterface>;
  listas: Observable<ListaInterface[]>;
  lista: Observable<ListaInterface>;

  listaProductoCollection: AngularFirestoreCollection<ListaProducto>;
  listaProductoDoc: AngularFirestoreDocument<ListaProducto>;
  listaProductos: Observable<ListaProducto[]>;
  listaProducto: Observable<ListaProducto>;

  resultado: number = 0;

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.listaCollection = this.afs.collection('listas', ref => ref);
  }

  //AGREGAR NUEVA LISTA
  agregarLista(lista: ListaInterface) {
    this.listaCollection = this.afs.collection('listas', ref => ref);
    this.listaCollection.add(lista)
      .then(() => {
        alert('La lista se agrego correctamente');
      }).catch(error => console.error(error));
    this.router.navigate(['/listas/' + lista.idUsuario]);
  }

  //CAMBIAR A INACTIVAS LAS LISTAS
  cambiarEstado(veces, idUsuario: string) {
    this.obtenerListasUsuario(idUsuario)
      .subscribe(res => {
        if (veces == 1) {
          res.forEach(datos => {
            if (datos.idUsuario == idUsuario) {
              this.listaDoc = this.afs.collection('listas').doc(datos.firebaseId);
              datos.estado = 'Inactiva';
              this.listaDoc.update(datos);
            }
          });
          veces = veces + 1;
        }
      });
    return true;
  }

  //CAMBIAR A INACTIVAS LAS LISTAS
  cambiarEstadoListaActiva(veces, idUsuario: string, idLista: string) {
    this.obtenerListasUsuario(idUsuario)
      .subscribe(res => {
        if (veces == 1) {
          res.forEach(datos => {
            if (datos.idUsuario == idUsuario) {
              if (datos.firebaseId == idLista) {
              } else {
                this.listaDoc = this.afs.collection('listas').doc(datos.firebaseId);
                datos.estado = 'Inactiva';
                this.listaDoc.update(datos);
              }
            }
          });
          veces = veces + 1;
        }
      });
    this.obtenerListasUsuario(idUsuario).subscribe().unsubscribe();
    return true;
  }

  //EDITAR LA LISTA ACTIVA
  editarEstadoLista(idLista: string, lista: ListaInterface) {
    this.listaDoc = this.afs.collection('listas').doc(idLista);
    this.listaDoc.update(lista)
      .then(() => {
        // alert('La lista "' + lista.nombre + '" se activo correctamente');
      }).catch(error => console.error(error));
  }

  //CAMBIAR ESTADO DE LA LISTA
  cambiarEstadoLista(idLista: string, estado, total) {
    this.obtenerTodasListas()
      .subscribe(res => {
        if (total == 0) {
          res.forEach(datos => {
            if (datos.firebaseId == idLista) {
              this.listaDoc = this.afs.collection('listas').doc(idLista);
              datos.disponibilidad = estado;
              if (estado == 'Desactivada') {
                datos.estado = 'Inactiva';
                this.editarEstadoLista(idLista, datos);
                this.listaDoc.update(datos);
              } else if (estado == 'Activada') {
                this.listaDoc.update(datos);
              }
              // datos.disponibilidad = estado;
              // console.log(datos)
              // this.listaDoc.update(datos);
            }
          });
          total = total + 1;
        }
      });
  }

  //AGREGAR PRODUCTO A LA LISTA
  agregarProducto(listaProducto: ListaProducto, idLista: string) {
    this.listaDoc = this.afs.collection('listas').doc(idLista).collection('productos').doc(listaProducto.idProducto);
    this.listaDoc.set(listaProducto)
      .then(() => {
        alert('Se agrego correcatmente el producto a la lista');
      }).catch(error => console.error(error));
  }

  //OBTENER PRODUCTOS DE UNA LISTA
  obtenerProductosLista(idLista: string) {
    this.listaProductoCollection = this.afs.collection('listas').doc(idLista).collection('productos');
    this.listaProductos = this.listaProductoCollection.snapshotChanges()
      .map(cambios => {
        return cambios.map(accion => {
          const datos = accion.payload.doc.data() as ListaProducto;
          datos.firebaseId = accion.payload.doc.id;
          return datos;
        });
      });
    return this.listaProductos;
  }

  //ELIMINAR PRODUCTO DE LA LISTA
  eliminarProductoLista(idLista: string, idProducto: string) {
    this.listaProductoDoc = this.afs.collection('listas').doc(idLista).collection('productos').doc(idProducto);
    this.listaProductoDoc.delete()
      .then(() => {
        alert('Producto eliminado de la lista');
      }).catch(error => console.error(error));
  }

  //ACTUALIZAR PRODUCTO DE LA LISTA
  actualizarProductoLista(idLista: string, idProducto: string, producto: ListaProducto) {
    this.listaProductoDoc = this.afs.collection('listas').doc(idLista).collection('productos').doc(idProducto);
    this.listaProductoDoc.update(producto)
      .then(() => {
        alert('Producto actualizado correctamente');
      }).catch(error => console.error(error));
  }

  //OBTENER TODAS LAS LISTAS
  obtenerTodasListas() {
    this.listaCollection = this.afs.collection('listas', ref => ref);
    this.listas = this.listaCollection.snapshotChanges()
      .map(cambios => {
        return cambios.map(accion => {
          const datos = accion.payload.doc.data();
          datos.firebaseId = accion.payload.doc.id;
          return datos;
        });
      });
    return this.listas;
  }

  //OBTENER TODAS LAS LISTAS DE UN USUARIO
  obtenerListasUsuario(idUsuario: string) {
    this.listaCollection = this.afs.collection('listas', ref => ref.where('idUsuario', '==', idUsuario));
    this.listas = this.listaCollection.snapshotChanges()
      .map(cambios => {
        return cambios.map(accion => {
          const datos = accion.payload.doc.data();
          datos.firebaseId = accion.payload.doc.id;
          return datos;
        });
      });
    return this.listas;
  }

}