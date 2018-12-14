import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../modelos/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  producto: ProductoInterface = {
    nombre: '',
    categoria: '',
    precio: null,
    tienda: ''
  }
  detalle: ProductoInterface[];
  existeDetalle: boolean = false;
  idProducto: string = '';
  uidUsuario: string = '';
  verOtro: boolean = false;
  ver: boolean = false;

  constructor(
    private productosService: ProductoService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.uidUsuario = this.authService.authFirebase.auth.currentUser.uid;
    this.detalle = [];
    this.obtenerProductos();
  }

  //OBTENER MIS PRODUCTOS
  obtenerProductos() {
    this.productosService.obtenerTodosProductos()
      .subscribe(datos => {
        // console.log(datos)
        this.detalle = datos;
        // this.detalle.map(res => {
        //   this.idProducto = res.idProducto;
        // })
        // if (this.idProducto == this.uidUsuario) {
        //   this.ver = true;
        // }

      });
  }
  // //OBTENER MIS PRODUCTOS
  // obtenerProductos() {
  //   this.idProducto = this.route.snapshot.params['id'];
  //   this.productosService.obtenerTodosProductos()
  //     .subscribe(datos => {
  //       datos.map(res => {
  //         if (res) {
  //           console.log(res.idProducto)
  //           console.log(this.uidUsuario)
  //           if (res.idProducto == this.uidUsuario) {
  //             this.detalle.push(res);
  //             if (this.detalle.length > 1) {
  //               this.verOtro = true;
  //             } else {
  //               this.verOtro = false;
  //             }
  //           }
  //         }
  //       })
  //     })
  // }

}
