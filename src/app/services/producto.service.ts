import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { ProductoInterface } from '../modelos/producto.interface';
import { ProductoDetalle } from '../modelos/detalle.interface';
import { Router } from '@angular/router';
import { all } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  productoCollection: AngularFirestoreCollection<ProductoInterface>;
  productoDetalleCollection: AngularFirestoreCollection<ProductoDetalle>;
  productoDoc: AngularFirestoreDocument<ProductoInterface>;
  productos: Observable<ProductoInterface[]>;
  productosDetalle: Observable<ProductoDetalle[]>;
  producto: Observable<ProductoInterface>;
  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.productoCollection = this.afs.collection('productos', ref => ref);
  }

  //CREAR PRODUCTO
  crearProducto(producto: ProductoInterface) {
    this.productoCollection = this.afs.collection('productos/', ref => ref);
    this.productoCollection.add(producto)
      .then(() => {
        alert('Se creo correctamente el producto');
      }).catch(error => { console.error(error) });
    this.router.navigate(['/productos/producto/' + producto.idProducto]);
  }

  //AGREGAR PRECIO
  agregarPrecioProducto(idProducto: string, idUsuario: string, precio: ProductoDetalle) {
    this.productoCollection = this.afs.collection('productos/').doc(idProducto).collection('detalle', ref => ref);
    this.productoCollection.add(precio)
      .then(() => {
        alert('Se agrego correctamente el precio');
      }).catch(error => { console.error(error) });
    this.router.navigate(['/productos/' + idUsuario]);
  }

  //OBTENER TODOS LOS PRODUCTOS
  obtenerTodosProductos() {
    this.productoCollection = this.afs.collection('productos/', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(change => {
        return change.map(action => {
          const data = action.payload.doc.data() as ProductoInterface;
          return data;
        });
      });
    return this.productos;
  }

  //OBTENER MIS PRODUCTOS
  obtenerMisProductos(id: string) {
    this.productoCollection = this.afs.collection('productos/', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoInterface;
          return datos;
        });
      });
    return this.productos;
  }

  //OBTENER CATEGORIAS
  obtenerCategoriaProducto() {
    this.productoCollection = this.afs.collection('productos/', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoInterface;
          return datos;
        });
      });
    return this.productos;
  }

  //OBTENER DETALLE DEl PRODUCTO
  obtenerDetalle(id: string) {
    this.productoCollection = this.afs.collection('productos/', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoInterface;
          // datos.idProducto = accion.payload.doc.id;
          return datos;
        });
      });
    return this.productos;
  }

  //OBTENER DETALLES DE PRODUCTOS
  obtenerDetalleProductos(idUsuario: string, idProducto: string) {
    this.productoDetalleCollection = this.afs.collection('productos').doc(idProducto).collection('detalle', ref => ref);
    this.productosDetalle = this.productoDetalleCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoDetalle;
          // datos.idProducto = accion.payload.doc.id;
          console.log(datos)
          return datos;
        });
      });
    return this.productosDetalle;
  }

  //OBTENER DETALLES DEL PRODUCTO PRINCIPAL
  obtenerDetalleProducto(idUsuario: string, idProducto: string) {
    this.productoCollection = this.afs.collection('productos', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoInterface;
          // datos.idProducto = accion.payload.doc.id;
          return datos;
        });
      });
    return this.productos;
  }
}
