import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoInterface } from 'src/app/modelos/producto.interface';
import { ProductoDetalle } from 'src/app/modelos/detalle.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ListaService } from 'src/app/services/lista.service';
import { ListaProducto } from 'src/app/modelos/listaProducto.interface';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  productosDetalles: ProductoInterface = {
    idProducto: '',
    idUsuario: '',
    nombre: '',
    categoria: '',
    precio: null,
    tienda: '',
    firebaseId: '',
    detalle: []
  };
  detallePrecio: ProductoDetalle = {
    idProducto: '',
    idUsuario: '',
    firebaseId: '',
    precio: null,
    tienda: '',
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
    firebaseId: ''
  }
  busqueda: {
    buscar?: '',
    categoria: {}
  };
  productoLista: ProductoInterface[];
  sinResultados: boolean = true;
  producto: ProductoInterface[];
  detalle: ProductoDetalle[];
  IdCategoria: string = '';
  todo: boolean = false;
  categorias: {};
  uidUsuario: string = '';
  idListaActiva: string = '';
  nombreListaActiva: string = '';
  isLogin: boolean = false;
  cantidad: number = 0;

  constructor(
    private productosService: ProductoService,
    private listaService: ListaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.producto = [];
    this.detalleProducto.imagenUrl = '../../../assets/img/compras.png';
    this.isLogIn();
    this.sinResultados = true;
    this.busquedaDatos();
    this.obtenerProducto();
    this.cantidad = 1;
  }

  //OBTENER DATOS DE BUSQUEDA
  busquedaDatos() {
    this.busqueda = {
      buscar: '',
      categoria: {}
    };
    this.categorias = {};
    this.busqueda = JSON.parse(localStorage.getItem('busqueda'));
    this.categorias = this.busqueda.categoria;
  }

  //FILTRO DE CATEGORIAS
  filtroCategoria(IdCategoria: string) {
    let filtro
    let igual

    filtro = this.categorias
    if (filtro.length != 0) {
      filtro.forEach(ele => {
        if (ele == IdCategoria) {
          igual = true;
        }
      })
    } else {
      igual = true;
    }
    return igual;
  }

  //FILTRO DEL TEXTO
  filtroTexto(texto: string, busqueda: string) {
    this.todo = false;
    let existe
    let igual

    existe = texto.indexOf(busqueda)
    if (busqueda.length != 0) {
      if (existe >= 0) {
        igual = true;
      } else {
        igual = false;
        this.sinResultados = false;
      }
    } else {
      this.todo = true;
      igual = true;
    }
    return igual;
  }

  //OBTENER PRODUCTOS
  obtenerProducto() {
    this.productoLista = [];
    this.productosService.obtenerTodosProductos()
      .subscribe(datos => {
        this.productoLista = [];
        datos.forEach(elementos => {
          if (this.filtroCategoria(elementos.categoria)) {
            if (this.filtroTexto(elementos.nombre.toLowerCase(), this.busqueda.buscar.toLowerCase())) {
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
          }
        });
        this.producto = this.productoLista;
      });
    if (this.producto.length == 0) {
      this.sinResultados = true;
    }
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
  disminuirCantidad(cantidad: number) {
    // console.log(cantidad)
    if (cantidad <= 1) {
      this.cantidad = 1;
    } else {
      this.cantidad--;
    }
  }

  //AUMENTAR CANTIDAD DEL PRODUCTO
  aumentarCantidad(cantidad: number) {
    // console.log(cantidad)
    if (cantidad >= 1) {
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

  //AGREGAR PRODUCTO A LA LISTA
  agregarProducto(idProducto: string) {
    // console.log(this.isLogin)
    if (this.isLogin) {
      if (this.idListaActiva != '') {
        if (confirm('¿Desea agregar el producto seleccionado a la lista "' + this.nombreListaActiva + '"?')) {
          this.listaProducto.idProducto = idProducto;
          this.listaService.agregarProducto(this.listaProducto, this.idListaActiva);
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

}
