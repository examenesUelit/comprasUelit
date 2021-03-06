import { Component, OnInit } from '@angular/core';
import { ListaService } from 'src/app/services/lista.service';
import { ActivatedRoute } from '@angular/router';
import { ListaInterface } from 'src/app/modelos/lista.interface';
import { ListaProducto } from 'src/app/modelos/listaProducto.interface';
import { ProductoInterface } from 'src/app/modelos/producto.interface';
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-detallelista',
  templateUrl: './detallelista.component.html',
  styleUrls: ['./detallelista.component.css']
})
export class DetallelistaComponent implements OnInit {
  productosDetalles: ProductoInterface = {
    idProducto: '',
    idUsuario: '',
    nombre: '',
    categoria: '',
    precio: null,
    cantidad: null,
    tienda: '',
    firebaseId: '',
    detalle: []
  }
  lista: ListaInterface = {
    id: '',
    firebaseId: '',
    idUsuario: '',
    nombreUsuario: '',
    nombre: '',
    estado: '',
    fecha: null,
    tipo: ''
  }
  detalleProducto: ListaProducto = {
    id: '',
    idProducto: '',
    firebaseId: '',
    cantidad: null
  };
  listaProductos: ListaProducto[];
  producto: ProductoInterface[];
  idLista: string = '';
  isLogin: boolean = false;
  miLista: boolean = false;
  existeProductoLista: boolean = false;
  nombreLista: string = '';
  uidUsuario: string = '';
  cantidad: number = 0;
  nombreProducto: string = '';

  constructor(
    private productoService: ProductoService,
    private listaService: ListaService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idLista = this.route.snapshot.params['id'];
    this.obtenerLista();
    setTimeout(() => {
      this.obtenerProductosLista();
    }, 3000);
    this.isLogIn();
    this.producto = [];
  }

  //VERIFICAR SI ESTÁ AUTENTICADO EL USUARIO
  isLogIn() {
    this.authService.getAuth()
      .subscribe(respuesta => {
        if (respuesta) {
          this.isLogin = true;
          this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
        } else {
          this.isLogin = false;
        }
      });
  }

  //OBTENER TODOS LOS PRODUCTOS
  obtenerProductos() {
    this.productoService.obtenerTodosProductos()
      .subscribe(datos => {
        this.producto = [];
        if (datos) {
          datos.forEach(elementos => {
            if (elementos) {
              this.listaProductos.forEach(listaProducto => {
                if (listaProducto.idProducto == elementos.firebaseId) {
                  this.productosDetalles = {
                    idProducto: elementos.idProducto,
                    idUsuario: elementos.idUsuario,
                    nombre: elementos.nombre,
                    categoria: elementos.categoria,
                    precio: elementos.precio,
                    cantidad: listaProducto.cantidad,
                    tienda: elementos.tienda,
                    firebaseId: elementos.firebaseId,
                    detalle: []
                  }
                  this.producto.push(this.productosDetalles);
                  this.existeProductoLista = true;
                }
              })
            }
          });
          this.existeProductoLista = true;
        }
      });
  }

  //OBTENER TODOS LOS PRODUCTOS DE LA LISTA
  obtenerProductosLista() {
    this.listaService.obtenerProductosLista(this.idLista)
      .subscribe(res => {
        this.listaProductos = [];
        res.forEach(datos => {
          if (datos) {
            this.listaProductos.push(datos);
          }
        });
        this.obtenerProductos();
      });
  }

  //OBTENER LA LISTA
  obtenerLista() {
    this.listaService.obtenerTodasListas()
      .subscribe(listas => {
        listas.forEach(elemento => {
          if (elemento.firebaseId == this.idLista) {
            if (elemento.idUsuario == this.uidUsuario) {
              this.miLista = true;
            }
            this.lista = elemento;
          }
        });
      });
  }

  //ELIMINAR PRODUCTO DE LA LISTA
  eliminarProducto(idProducto: string) {
    if (confirm('¿Seguro que desea eliminar este producto de la lista "' + this.lista.nombre + '" ?')) {
      this.listaService.eliminarProductoLista(this.idLista, idProducto);
      this.obtenerProductosLista();
    }
  }

  //ACTUALIZAR PRODUCTO DE LA LISTA
  actualizarProducto(idProducto: string, cantidad: HTMLInputElement) {
    if (parseInt(cantidad.value) <= 0) {
      alert('La cantidad debe ser mayor a cero.')
    } else {
      if (confirm('¿Seguro que desea atualizar la cantidad del producto "' + this.nombreProducto + '" ?')) {
        this.detalleProducto.cantidad = parseInt(cantidad.value);
        this.listaService.actualizarProductoLista(this.idLista, idProducto, this.detalleProducto);
        this.obtenerProductosLista();
        document.getElementById('cerrarModal').click();
      }
    }
  }

  //OBTENER LOS DETALLES DEL PRODUCTOS
  obtenerProductoDetalle(idProducto: string) {
    this.producto.forEach(datos => {
      if (datos.firebaseId == idProducto) {
        this.detalleProducto.idProducto = idProducto;
        this.cantidad = datos.cantidad;
        this.nombreProducto = datos.nombre;
      }
    });
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

}
