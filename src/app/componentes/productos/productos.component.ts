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
  producto: ProductoInterface = {
    nombre: '',
    categoria: '',
    precio: null,
    tienda: ''
  }
  detalle = [];
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
    this.obtenerProductos();
    this.obtenerProductosDetalle();
  }

  //OBTENER MIS PRODUCTOS
  obtenerProductos() {
    this.productosService.obtenerMisProductos(this.idProducto)
      .subscribe(datos => {
        datos.map(res => {
          this.producto.id = res.id;
          this.producto.nombre = res.nombre;
          this.producto.categoria = res.categoria;
          this.producto.precio = res.precio;
          this.producto.tienda = res.tienda;
        })
      })
  }

  //OBTENER DETALLES DE PRODUCTOS
  obtenerProductosDetalle() {
    this.productosService.obtenerDetalleProductos(this.uidUsuario, this.producto.id)
      .subscribe(datos => {
        datos.map(res => {
          if (res) {
            this.detalle.push(res);
            this.existeDetalle = true;
          } else {
            this.existeDetalle = false;
          }
        })
      })
  }

}
