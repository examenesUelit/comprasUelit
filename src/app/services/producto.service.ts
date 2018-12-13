import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { ProductoInterface } from '../modelos/producto.interface';
import { ProductoDetalle } from '../modelos/detalle.interface';

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
  constructor(private afs: AngularFirestore) {
    this.productoCollection = this.afs.collection('productos', ref => ref);
  }

  //CREAR PRODUCTO
  crearProducto(producto: ProductoInterface) {
    this.productoCollection.doc(producto.id).collection('producto').add(producto)
      .then(() => {
        alert('Se creo correctamente el producto');
      }).catch(error => { console.error(error) });
  }

  //AGREGAR PRECIO
  agregarPrecioProducto(id: string, idUsuario: string, precio: ProductoDetalle) {
    this.productoCollection.doc(idUsuario).collection('producto').doc(id).collection('detalle').add(precio)
      .then(() => {
        alert('Se creo correctamente el producto');
      }).catch(error => { console.error(error) });
  }

  //OBTENER MIS PRODUCTOS
  obtenerMisProductos(id: string) {
    this.productoCollection = this.afs.collection('productos/' + id + '/producto', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoInterface;
          datos.id = accion.payload.doc.id;
          return datos;
        });
      });
    return this.productos;
  }

  //OBTENER DETALLE DEl PRODUCTO
  obtenerDetalle(id: string) {
    this.productos = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoInterface;
          datos.id = accion.payload.doc.id;
          return datos;
        });
      });
    return this.productos;
  }

  //OBTENER DETALLES DE PRODUCTOS
  obtenerDetalleProductos(idUsuario: string, idProducto: string) {
    this.productoDetalleCollection = this.afs.collection('productos/' + idUsuario + '/producto' + idProducto + '/detalle', ref => ref);
    this.productosDetalle = this.productoDetalleCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoDetalle;
          datos.id = accion.payload.doc.id;
          return datos;
        });
      });
    return this.productosDetalle;
  }

}
