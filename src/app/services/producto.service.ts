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
import { AngularFireStorage } from '@angular/fire/storage';

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
    private afm: AngularFireStorage,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.productoCollection = this.afs.collection('productos', ref => ref);
  }

  //CREAR PRODUCTO
  crearProducto(producto: ProductoInterface, imagen: []) {
    this.productoCollection = this.afs.collection('productos/', ref => ref);
    this.productoCollection.add(producto)
      .then(() => {
        this.productoCollection = this.afs.collection('productos/', ref => ref.orderBy('fecha', 'asc'));
        this.productoCollection.snapshotChanges()
          .subscribe(productos => {
            productos.forEach(elementos => {
              const data = elementos.payload.doc.data() as ProductoInterface;
              data.firebaseId = elementos.payload.doc.id;
              if (data.fecha == producto.fecha && data.idUsuario == producto.idUsuario && data.imagenUrl == 'LOCAL') {
                if (imagen) {
                  this.subirImagen(imagen, data);
                }
              }
            });
          })
      }).catch(error => { console.error(error) });
    this.router.navigate(['/productos/producto/' + producto.idUsuario]);
  }

  //SUBIR IMAGEN
  subirImagen(imagen, producto: ProductoInterface) {
    this.afm.storage.ref().child(`Producto/${producto.idUsuario}/${producto.firebaseId}`)
      .put(imagen)
      .then(function () {
        // File upload successfully
        console.log('Se subio')
      }).catch(function (error) {
        // Uh-oh, an error occurred!
        console.log('Error al subir')
      });
  }

  //OBTENER URL DE LA IMAGEN
  obtenerImagen(idUsuario: string, idProducto: string) {
    return this.afm.storage.ref().child(`Producto/${idUsuario}/${idProducto}`)
      .getDownloadURL()
      .then(function (img) {
        // File download successfully
        console.log('Se descargo')
        return img;
      }).catch(function (error) {
        // Uh-oh, an error occurred!
        console.log('Error al descargar')
        return error;
      });
    // return this.afm.ref(`Producto/${idUsuario}/${idProducto}`)
    //   .getDownloadURL();
  }

  //ELIMINAR IMAGEN DEL SERVIDOR
  eliminarImagen(idUsuario: string, idProducto: string) {

    this.afm.storage.ref().child(`Producto/${idUsuario}/${idProducto}`)
      .delete()
      .then(function () {
        // File deleted successfully
        console.log('Se elimino')
      }).catch(function (error) {
        // Uh-oh, an error occurred!
        console.log('Error al eliminar')
      });
  }

  //ACTUALIZAR PRODUCTO
  editarProducto(producto: ProductoInterface, imagen: [], cambioImagen: string, tipoCambio: number) {
    let actualizarImagen: boolean = false;
    if (cambioImagen == 'SINCAMBIO') {
      //SIN CAMBIO DE IMAGEN
      console.log('//SIN CAMBIO DE IMAGEN')
      actualizarImagen = true;
    } else if (tipoCambio == 1) {
      //CAMBIO DE ARCHIVO A URL
      console.log('//CAMBIO DE ARCHIVO A URL')
      this.eliminarImagen(producto.idUsuario, producto.firebaseId)
      actualizarImagen = true;
    } else if (tipoCambio == 2) {
      //CAMBIO DE ARCHIVO A ARCHIVO
      console.log('//CAMBIO DE ARCHIVO A ARCHIVO')
      if (imagen) {
        this.eliminarImagen(producto.idUsuario, producto.firebaseId)
        this.subirImagen(imagen, producto)
        actualizarImagen = true;
      }
    } else if (tipoCambio == 3) {
      //CAMBIO DE URL A URL
      console.log('//CAMBIO DE URL A URL')
      actualizarImagen = true;
    } else if (tipoCambio == 4) {
      //CAMBIO DE URL A ARCHIVO
      console.log('//CAMBIO DE URL A ARCHIVO')
      if (imagen) {
        this.subirImagen(imagen, producto)
        producto.imagenUrl = 'LOCAL';
        actualizarImagen = true;
      }
    }

    if (actualizarImagen == true) {
      this.productoDoc = this.afs.collection('productos/').doc(producto.firebaseId);
      this.productoDoc.update(producto)
        .then(() => {
          this.router.navigate(['/productos/producto/' + producto.idUsuario]);
          alert('Se actualizó correctamente el producto');
        }).catch(error => {
          alert('Ha ocurrido un error al actualizar el producto. \n\n' + error);
        });
    } else {
      alert('Ha ocurrido un error al actualizar el producto');
    }
  }

  //AGREGAR PRECIO
  agregarPrecioProducto(idProducto: string, precio: ProductoDetalle, crearPrecio: boolean) {
    this.productoCollection = this.afs.collection('productos/').doc(idProducto).collection('detalle', ref => ref);
    this.productoCollection.add(precio)
      .then(() => {
        if (!crearPrecio) {
        } else {
          alert('Se agrego correctamente el precio');
        }
      }).catch(error => { console.error(error) });
    if (!crearPrecio) {

    } else {
      this.router.navigate(['/productos/' + idProducto]);
    }
  }

  //ACTUALIZAR PRECIO
  actualizarPrecioProducto(idProducto: string, precio: ProductoDetalle, crearPrecio: boolean) {
    this.productoDoc = this.afs.collection('productos/').doc(idProducto).collection('detalle').doc(precio.firebaseId);
    this.productoDoc.update(precio)
      .then(() => {
        if (!crearPrecio) {
        } else {
          alert('Se agrego correctamente el precio');
        }
      }).catch(error => { console.error(error) });
    if (!crearPrecio) {

    } else {
      this.router.navigate(['/productos/' + idProducto]);
    }
  }

  //OBTENER TODOS LOS PRODUCTOS
  obtenerTodosProductos() {
    this.productoCollection = this.afs.collection('productos/', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(change => {
        return change.map(action => {
          const data = action.payload.doc.data() as ProductoInterface;
          data.firebaseId = action.payload.doc.id
          // console.log(data)
          return data;
        });
      });
    return this.productos;
  }

  //OBTENER DETALLES DE UN PRODUCTO
  obtenerProductoDetalle(idProducto: string) {
    this.productoCollection = this.afs.collection('productos').doc(idProducto).collection('detalle/', ref => ref.orderBy('precio', "asc"));
    this.productosDetalle = this.productoCollection.snapshotChanges()
      .map(change => {
        return change.map(action => {
          const data = action.payload.doc.data() as ProductoDetalle;
          data.firebaseId = action.payload.doc.id
          return data;
        });
      });
    return this.productosDetalle;
  }

  //OBTENER PRODUCTO
  obtenerProducto(idProducto: string) {
    this.productoCollection = this.afs.collection('productos/', ref => ref.orderBy('precio', "asc"));
    this.productos = this.productoCollection.snapshotChanges()
      .map(change => {
        return change.map(action => {
          const data = action.payload.doc.data() as ProductoInterface;
          data.firebaseId = action.payload.doc.id
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
  obtenerDetalle(idProducto: string) {
    this.productoCollection = this.afs.collection('productos').doc(idProducto).collection('detalle/', ref => ref);
    this.productos = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoInterface;
          datos.firebaseId = accion.payload.doc.id;
          return datos;
        });
      });
    return this.productos;
  }

  //OBTENER DETALLE DEl PRODUCTO
  obtenerDetallePrecio(idProducto: string) {
    this.productoCollection = this.afs.collection('productos').doc(idProducto).collection('detalle/', ref => ref);
    this.productosDetalle = this.productoCollection.snapshotChanges()
      .map(state => {
        return state.map(accion => {
          const datos = accion.payload.doc.data() as ProductoDetalle;
          datos.firebaseId = accion.payload.doc.id;
          return datos;
        });
      });
    return this.productosDetalle;
  }

}
