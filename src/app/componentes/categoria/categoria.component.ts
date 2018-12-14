import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../modelos/producto.interface';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  producto: ProductoInterface = {
    nombre: '',
    categoria: '',
    precio: null,
    tienda: ''
  }
  productoActual: string;
  detalle: ProductoInterface[];
  existeDetalle: boolean = false;
  idProducto: string = '';
  uidUsuario: string = '';
  categoria: string = '';
  verOtro: boolean = false;

  constructor(
    private authService: AuthService,
    private productosService: ProductoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['id'];
    // this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.obtenerProducto();
  }

  //OBTENER MIS PRODUCTOS
  obtenerProducto() {
    this.productosService.obtenerTodosProductos()
      .subscribe(datos => {
        // console.log(datos)
        this.detalle = datos;
      });
  }

}
