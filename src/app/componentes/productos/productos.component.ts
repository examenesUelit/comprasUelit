import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ProductoInterface } from '../../modelos/producto.interface';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  producto: ProductoInterface[];
  productoActual: string;
  detalle: ProductoInterface[];
  existeDetalle: boolean = false;
  idProducto: string = '';
  uidUsuario: string = '';

  constructor(
    private authService: AuthService,
    private productosService: ProductoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['id'];
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.detalle = [];
    this.obtenerProducto();
  }

  //OBTENER PRODUCTO
  obtenerProducto() {
    this.productosService.obtenerDetalleProductos(this.uidUsuario, this.idProducto)
      .subscribe(datos => {
        this.producto = datos;
        if (this.producto) {
          this.existeDetalle = true;
        } else {
          this.existeDetalle = false;
        }
      });
  }


  //OBTENER DETALLES
  obtenerProductoDetalle() {
    this.productosService.obtenerTodosProductos()
      .subscribe(datos => {
        this.detalle = datos;
      });
  }
  // //OBTENER PRODUCTO
  // obtenerProducto() {
  //   this.productosService.obtenerDetalleProducto(this.uidUsuario, this.idProducto)
  //     .subscribe(datos => {
  //       datos.map(res => {
  //         if (res) {
  //           console.log(res.idProducto)
  //           if (res.idProducto == this.idProducto) {
  //             this.producto.idProducto = res.idProducto;
  //             this.producto.nombre = res.nombre;
  //             this.producto.categoria = res.categoria;
  //             this.producto.precio = res.precio;
  //             this.producto.tienda = res.tienda;
  //             this.obtenerProductosDetalle(this.producto.idProducto);
  //           }
  //         }
  //       });
  //     });
  // }

  //OBTENER DETALLES DE PRODUCTOS
  obtenerProductosDetalle(id: string) {
    this.productosService.obtenerDetalleProductos(this.uidUsuario, id)
      .subscribe(datos => {
        datos.map(respuesta => {
          if (respuesta) {
            console.log(respuesta.idProducto)
            console.log(this.idProducto)
            if (respuesta.idProducto == this.idProducto) {
              this.detalle.push(respuesta);
              console.log(this.detalle)
              this.existeDetalle = true;
            }
          } else {
            this.existeDetalle = false;
          }
        })
      })
  }

}
