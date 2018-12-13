import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../modelos/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';

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
  detalle = [];
  existeDetalle: boolean = false;
  idProducto: string = '';

  constructor(
    private productosService: ProductoService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.obtenerProductos();
  }

  //OBTENER MIS PRODUCTOS
  obtenerProductos() {
    this.idProducto = this.route.snapshot.params['id'];
    this.productosService.obtenerMisProductos(this.idProducto)
      .subscribe(datos => {
        datos.map(res => {
          this.detalle.push(res);
        })
      })
  }
  productos() {
    
  }

}
