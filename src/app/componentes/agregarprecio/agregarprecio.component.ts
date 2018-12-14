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
    tienda: ''
  }
  idProducto: string;
  nombre: string = '';
  uidUsuario: string = '';

  constructor(private authService: AuthService,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['id'];
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.obtenerDetalles();
  }

  //AGREGAR CAMBIO DE PRECIO
  onCambiarPrecio({ value }: { value: ProductoDetalle }) {
    this.producto = value;
    this.producto.idProducto = this.authService.authFirebase.auth.currentUser.uid;
    this.productoService.agregarPrecioProducto(this.idProducto, this.uidUsuario, this.producto);
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
