import { Component, OnInit } from '@angular/core';
import { ProductoDetalle } from '../../../modelos/detalle.interface';
import { AuthService } from '../../../services/auth.service';
import { ProductoService } from '../../../services/producto.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editarprecio',
  templateUrl: './editarprecio.component.html',
  styleUrls: ['./editarprecio.component.css']
})
export class EditarprecioComponent implements OnInit {
  producto: ProductoDetalle = {
    idProducto: '',
    idUsuario: '',
    precio: null,
    tienda: ''
  }
  idPrecio: string;
  idProducto: string;
  nombre: string = '';
  uidUsuario: string = '';

  constructor(private authService: AuthService,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['idProducto'];
    this.idPrecio = this.route.snapshot.params['idPrecio'];
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
      this.producto.firebaseId = this.idPrecio;
      this.producto.idUsuario = this.authService.authFirebase.auth.currentUser.uid;
      this.productoService.actualizarPrecioProducto(this.idProducto, this.producto, true);
    }
  }

  //OBTENER DETALLES DEL PRODUCTO
  obtenerDetalles() {
    this.productoService.obtenerDetallePrecio(this.idProducto)
      .subscribe(datos => {
        datos.map(res => {
          if (res) {
            if (res.firebaseId == this.idPrecio) {
              this.producto = res;
            }
          }
        });
      });
  }
}
