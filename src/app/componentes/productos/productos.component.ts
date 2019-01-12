import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductoDetalle } from '../../modelos/detalle.interface';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  producto: ProductoDetalle = {
    idProducto: '',
    idUsuario: '',
    firebaseId: '',
    precio: null,
    tienda: ''
  }; //ALMACENAR TODO EL PRODUCTO ACTUAL
  precio: ProductoDetalle = {
    idProducto: '',
    idUsuario: '',
    firebaseId: '',
    precio: null,
    tienda: ''
  }; //INTERFAZ PARA INSERTAR EL PRECIO DEL PRODUCTO ORIGINAL
  productoActual: string; //NOMBRE DEL PRODUCTO ACTUAL
  detalle: ProductoDetalle[]; //TODOS LOS PRECIOS
  detalleBarato: ProductoDetalle[]; //EL MÁS BARATO
  existeDetalle: boolean = false; //VERIFICAR SI EXISTEN DETALLES
  idProducto: string = ''; //IDENTIFICADOR DEL PRODUCTO
  uidUsuario: string = '';
  existeUsuario: boolean = false;

  constructor(
    private productosService: ProductoService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['id'];
    this.detalle = [];
    this.detalleBarato = [];
    this.obtenerProducto();
  }

  //VERIFICAR USUARIO PARA EDITAR
  verificarUsuario() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
          if (this.precio.idUsuario == this.uidUsuario) {
            this.existeUsuario = true;
          } else {
            this.existeUsuario = false;
          }
        }
      });
  }

  //OBTENER DETALLES DEL PRODUCTO
  obtenerProducto() {
    this.productosService.obtenerTodosProductos()
      .subscribe(datos => {
        datos.forEach(producto => {
          if (this.idProducto == producto.firebaseId) {
            this.precio = {
              idUsuario: producto.idUsuario,
              firebaseId: producto.firebaseId,
              precio: producto.precio,
              tienda: producto.tienda
            }
            this.producto = this.precio
            this.productoActual = producto.nombre;
            this.verificarUsuario();
            this.ordenarPrecios();
          }
        });
      });
  }

  //ORDENAR LOS PRECIOS DE LOS PRODUCTOS
  ordenarPrecios() {
    this.productosService.obtenerProductoDetalle(this.idProducto)
      .forEach(precios => {
        this.detalleBarato = [];
        if (precios.length >= 1) {
          this.detalle = precios;
          this.detalleBarato.push(this.detalle[0])
          this.existeDetalle = true;
        } else {
          this.productosService.agregarPrecioProducto(this.idProducto, this.precio, false)
          this.detalleBarato.push(this.producto)
          this.existeDetalle = false;
        }
      });
  }

}
