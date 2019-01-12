import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../modelos/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductoDetalle } from 'src/app/modelos/detalle.interface';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  detallePrecio: ProductoDetalle = {
    idProducto: '',
    idUsuario: '',
    firebaseId: '',
    precio: null,
    tienda: '',
  };
  productosDetalles: ProductoInterface = {
    idProducto: '',
    idUsuario: '',
    nombre: '',
    categoria: '',
    precio: null,
    imagenUrl: '',
    tienda: '',
    firebaseId: '',
    detalle: []
  }
  productoLista: ProductoInterface[];
  producto: ProductoInterface[];
  detalle: ProductoDetalle[];
  IdCategoria: string = '';
  uidUsuario: string = '';

  constructor(
    private authService: AuthService,
    private productosService: ProductoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.IdCategoria = this.route.snapshot.params['id'];
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.producto = [];
    this.obtenerProducto();
  }

  //OBTENER MIS PRODUCTOS
  obtenerProducto() {
    this.productoLista = [];
    this.productosService.obtenerTodosProductos()
      .subscribe(datos => {
        this.productoLista = [];
        datos.forEach(elementos => {
          if (elementos.idUsuario == this.uidUsuario) {
            this.productosService.obtenerProductoDetalle(elementos.firebaseId)
              .subscribe(detalles => {
                this.detalle = [];
                detalles.forEach(detalleElemento => {
                  this.detallePrecio = detalleElemento
                  this.detalle.push(this.detallePrecio)
                });
                this.productosDetalles = {
                  idProducto: elementos.idProducto,
                  idUsuario: elementos.idUsuario,
                  nombre: elementos.nombre,
                  categoria: elementos.categoria,
                  imagenUrl: elementos.imagenUrl,
                  precio: elementos.precio,
                  tienda: elementos.tienda,
                  firebaseId: elementos.firebaseId,
                  detalle: this.detalle
                }
                this.productoLista.push(this.productosDetalles);
                this.obtenerImagenProductos();
              });
          }
        });
        this.producto = this.productoLista;
      });
  }

  //OBTENER IMAGENES DEL SERVIDOR
  obtenerImagenProductos() {
    this.productoLista.forEach(elementos => {
      if (elementos.imagenUrl == 'LOCAL') {
        this.productosService.obtenerImagen(elementos.idUsuario, elementos.firebaseId)
          .then(urlImagen => {
            if (urlImagen) {
              elementos.imagenUrl = urlImagen;
              this.producto = this.productoLista;
            }
          });
      } else if (elementos.imagenUrl != 'LOCAL' && elementos.imagenUrl.length > 0) {
        this.producto = this.productoLista;
      }
    });
  }

  //ERROR AL CARGAR LA IMAGEN
  errorImagen() {
    let imagen = <HTMLImageElement>document.getElementById('imagen');
    imagen.src = '../../../assets/img/compras.png';
    this.obtenerImagenProductos();
  }

}
