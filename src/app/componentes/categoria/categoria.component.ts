import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../modelos/producto.interface';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { ProductoDetalle } from 'src/app/modelos/detalle.interface';
import { ListaProducto } from 'src/app/modelos/listaProducto.interface';
import { ListaService } from 'src/app/services/lista.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
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
  };
  detalleProducto: ProductoInterface = {
    idProducto: '',
    idUsuario: '',
    nombre: '',
    categoria: '',
    precio: null,
    imagenUrl: '',
    tienda: '',
    firebaseId: '',
    detalle: []
  };
  listaProducto: ListaProducto = {
    idProducto: '',
    firebaseId: '',
    cantidad: null
  };
  productoLista: ProductoInterface[];
  producto: ProductoInterface[];
  detalle: ProductoDetalle[];
  IdCategoria: string = '';
  uidUsuario: string = '';
  nombreListaActiva: string = '';
  idListaActiva: string = '';
  isLogin: boolean = false;
  cantidad: number = 0;
  existeLista: boolean = false;
  existeProductoLista: boolean = false;
  cargandoProductoLista: boolean = true;

  constructor(
    private productosService: ProductoService,
    private listaService: ListaService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.detalleProducto.imagenUrl = '../../../assets/img/compras.png';
    this.IdCategoria = this.route.snapshot.params['id'];
    this.producto = [];
    this.productoLista = [];
    this.isLogIn();
    setTimeout(() => {
      this.obtenerProducto();
    }, 3000);
    this.cantidad = 1;
    this.producto = this.productoLista;
  }

  //AGREGAR PRODUCTO A LA LISTA
  agregarProducto(idProducto: string, cantidad: HTMLInputElement) {
    // console.log(this.isLogin)
    if (this.isLogin) {
      if (this.idListaActiva != '') {
        if (parseInt(cantidad.value) <= 0) {
          alert('La cantidad debe ser mayor a cero.')
        } else {
          if (confirm('¿Desea agregar el producto seleccionado a la lista "' + this.nombreListaActiva + '"?')) {
            this.listaProducto.idProducto = idProducto;
            this.listaProducto.cantidad = parseInt(cantidad.value);
            this.listaService.agregarProducto(this.listaProducto, this.idListaActiva);
            document.getElementById('cerrarModal').click();
          }
        }
      } else {
        alert('Debes tener una lista activa para agregarle productos')
      }
    } else {
      alert('Debes iniciar sesión antes de agregar un producto a una lista')
    }
  }

  //OBTENER LA LISTA ACTIVA
  obtenerListaActiva() {
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.listaService.obtenerListasUsuario(this.uidUsuario)
      .subscribe(res => {
        // console.log(res)
        res.forEach(datos => {
          if (datos.estado == 'Activa') {
            this.idListaActiva = datos.firebaseId;
            this.nombreListaActiva = datos.nombre;
          }
        });
      });
  }

  //OBTENER LOS PRODUCTOS DE LA CATEGORIA
  obtenerProducto() {
    this.productoLista = [];
    this.productosService.obtenerTodosProductos()
      .subscribe(datos => {
        this.productoLista = [];
        this.cargandoProductoLista = false;
        if (datos) {
          datos.forEach(elementos => {
            if (elementos.categoria == this.IdCategoria) {
              this.productosService.obtenerProductoDetalle(elementos.firebaseId)
                .subscribe(detalles => {
                  this.detalle = [];
                  if (detalles) {
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
                    if (this.existeProductoLista == false) {
                      this.existeProductoLista = true;
                    }
                  }
                });
              this.existeLista = true;
            }
          });
          this.producto = this.productoLista;
        }
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

  //OBTENER LOS DETALLES DEL PRODUCTOS
  obtenerProductoDetalle(idProducto: string) {
    this.cantidad = 1;
    this.producto.forEach(datos => {
      if (datos.firebaseId == idProducto) {
        this.detalleProducto = datos;
      }
    });
  }

  //ERROR AL CARGAR LA IMAGEN
  errorImagen() {
    let imagen = <HTMLImageElement>document.getElementById('imagen');
    imagen.src = '../../../assets/img/compras.png';
  }

  //DISMINUIR CANTIDAD DEL PRODUCTO
  disminuirCantidad(cantidad: HTMLInputElement) {
    this.cantidad = parseInt(cantidad.value)
    if (this.cantidad <= 1) {
      this.cantidad = 1;
    } else {
      this.cantidad--;
    }
  }

  //AUMENTAR CANTIDAD DEL PRODUCTO
  aumentarCantidad(cantidad: HTMLInputElement) {
    this.cantidad = parseInt(cantidad.value);
    if (this.cantidad >= 1) {
      this.cantidad++;
    }
  }

  //VERIFICAR SI ESTÁ AUTENTICADO EL USUARIO
  isLogIn() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.isLogin = true;
          this.obtenerListaActiva();
        } else {
          this.isLogin = false;
        }
      });
  }

}
