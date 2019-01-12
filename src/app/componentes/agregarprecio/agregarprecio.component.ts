import { Component, OnInit } from '@angular/core';
import { ProductoDetalle } from '../../modelos/detalle.interface';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agregarprecio',
  templateUrl: './agregarprecio.component.html',
  styleUrls: ['./agregarprecio.component.css']
})
export class AgregarprecioComponent implements OnInit {
  producto: ProductoDetalle = {
    idProducto: '',
    precio: null,
    tienda: 'Aurrera'
  }
  idProducto: string;
  nombre: string = '';
  uidUsuario: string = '';

  constructor(
    private authService: AuthService,
    private productoService: ProductoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['id'];
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.obtenerDetalles();
  }

  //AGREGAR CAMBIO DE PRECIO
  onCambiarPrecio({ value }: { value: ProductoDetalle }) {
    if (value.precio == null || value.precio == 0) {
      alert('Agregue un precio');
    } else if (value.tienda == '') {
      alert('Seleccione una tienda')
    } else {
      this.producto = value;
      this.producto.idUsuario = this.authService.authFirebase.auth.currentUser.uid;
      this.producto.idProducto = this.idProducto;
      this.productoService.agregarPrecioProducto(this.idProducto, this.producto, true);
    }
  }

  //OBTENER DETALLES DEL PRODUCTO
  obtenerDetalles() {
    this.productoService.obtenerDetalle(this.idProducto)
      .subscribe(datos => {
        datos.map(res => {
          this.nombre = res.nombre;
        });
      });
  }

}
