import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../modelos/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crearproducto',
  templateUrl: './crearproducto.component.html',
  styleUrls: ['./crearproducto.component.css']
})
export class CrearproductoComponent implements OnInit {
  producto: ProductoInterface = {
    idProducto: '',
    nombre: '',
    categoria: '',
    precio: null,
    tienda: ''
  }
  constructor(
    private productoService: ProductoService,
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  //CREAR PRODUCTOS
  onCrearProducto({ value }: { value: ProductoInterface }) {
    this.producto = value;
    this.producto.idProducto = this.authService.authFirebase.auth.currentUser.uid;
    this.productoService.crearProducto(this.producto);
  }
}
