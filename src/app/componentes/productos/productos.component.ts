import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductoDetalle } from '../../modelos/detalle.interface';
import { ProductoInterface } from 'src/app/modelos/producto.interface';
import { ListaService } from 'src/app/services/lista.service';
import { ListaProducto } from 'src/app/modelos/listaProducto.interface';

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
  }; //DETALLES DEL PRODUCTO A AGREGAR A LA LISTA
  listaProducto: ListaProducto = {
    idProducto: '',
    firebaseId: '',
    cantidad: null
  }; //INTERFAZ DE PRODUCTOS EN LA LISTA
  productoActual: string; //NOMBRE DEL PRODUCTO ACTUAL
  detalle: ProductoDetalle[]; //TODOS LOS PRECIOS
  detalleBarato: ProductoDetalle[]; //EL MÁS BARATO
  existeDetalle: boolean = false; //VERIFICAR SI EXISTEN DETALLES
  idProducto: string = ''; //IDENTIFICADOR DEL PRODUCTO
  uidUsuario: string = ''; //IDENTIFICADOR DEL USUARIO LOGUEADO
  existeUsuario: boolean = false; //VERIFICADOR DE USUARIO
  existePrecioLista: boolean = false; //VERIFICAR SI EXISTEN MÁS PRECIOS
  existeLista: boolean = false; //VERIFICAR SI EXISTEN PRECIOS
  cargandoPreciosLista: boolean = true; //MUESTRA ICONO AL ESTAR CARGANDO
  imagenUrl: string = ''; //URL DE LA IMAGEN DEL PRODUCTO
  idUsuario: string = ''; //IDENTIFICADOR DEL USUARIO QUE CREO EL PRODUCTO
  cantidad: number = 0; //CANTIDAD DE PRODUCTOS A AGREGAR A LA LISTA
  nombreListaActiva: string = ''; //NOMBRE DE LA LISTA ACTIVA
  idListaActiva: string = ''; //IDENTIFICADOR DE LA LISTA ACTIVA

  constructor(
    private productosService: ProductoService,
    private route: ActivatedRoute,
    private listaService: ListaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['id'];
    this.detalle = [];
    this.detalleBarato = [];
    setTimeout(() => {
      this.obtenerProducto();
    }, 3000);
  }

  //VERIFICAR USUARIO PARA EDITAR
  verificarUsuario() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
          if (this.precio.idUsuario == this.uidUsuario) {
            this.existeUsuario = true;
            this.obtenerListaActiva();
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
            this.idUsuario = producto.idUsuario;
            this.obtenerImagenProducto(producto.imagenUrl);
            this.verificarUsuario();
            this.ordenarPrecios();
          }
        });
      });
  }

  //OBTENER IMAGEN DEL SERVIDOR
  obtenerImagenProducto(imagenUrl: string) {
    if (imagenUrl == 'LOCAL') {
      this.productosService.obtenerImagen(this.idUsuario, this.idProducto)
        .then(urlImagen => {
          if (urlImagen) {
            this.imagenUrl = urlImagen;
          }
        });
    } else if (imagenUrl != 'LOCAL') {
      this.imagenUrl = imagenUrl;
    }
  }

  //ERROR AL CARGAR LA IMAGEN
  errorImagen() {
    let imagen = <HTMLImageElement>document.getElementById('imagen');
    imagen.src = '../../../assets/img/compras.png';
  }

  //ORDENAR LOS PRECIOS DE LOS PRODUCTOS
  ordenarPrecios() {
    this.productosService.obtenerProductoDetalle(this.idProducto)
      .forEach(precios => {
        this.detalleBarato = [];
        this.cargandoPreciosLista = false;
        if (precios) {
          if (precios.length >= 1) {
            this.detalle = precios;
            this.detalleBarato.push(this.detalle[0])
            this.existeDetalle = true;
            if (precios.length > 1) {
              this.existePrecioLista = true;
            }
          } else {
            this.productosService.agregarPrecioProducto(this.idProducto, this.precio, false)
            this.detalleBarato.push(this.producto)
            this.existeDetalle = false;
          }
          this.existeLista = true;
        }
      });
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

  //OBTENER LOS DETALLES DEL PRODUCTOS
  obtenerProductoDetalle(idProducto: string) {
    this.cantidad = 1;
    if (this.producto.firebaseId == idProducto) {
      this.detalleProducto = this.producto;;
    }
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

  //AGREGAR PRODUCTO A LA LISTA
  agregarProducto(idProducto: string, cantidad: HTMLInputElement) {
    // console.log(this.isLogin)
    if (this.existeUsuario) {
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

}
