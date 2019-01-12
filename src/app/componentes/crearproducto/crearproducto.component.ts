import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../modelos/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-crearproducto',
  templateUrl: './crearproducto.component.html',
  styleUrls: ['./crearproducto.component.css']
})
export class CrearproductoComponent implements OnInit {
  producto: ProductoInterface = {
    idProducto: '',
    idUsuario: '',
    nombre: '',
    categoria: '',
    precio: null,
    fecha: null,
    tienda: 'Aurrera'
  }
  categorias = [];
  url: string = '';
  porURL: boolean = true;
  porArchivo: boolean = false;
  imagen: [];
  categoriaPrimera: string = '';

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.obtenerCategorias();
    setTimeout(() => {
      this.categoriaPrimera = this.categorias[0];
    }, 500);
    this.imagen = [];
  }

  //VER IMAGEN ANTES DE SUBIR (ARCHIVO)
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0]) {
        var reader = new FileReader();
        this.imagen = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
      }
    }
  }

  //VER IMAGEN ANTES DE SUBIR (URL)
  onChangeUrl() {
    let urlTexto = <HTMLInputElement>document.getElementById('imagenUrl');
    if (urlTexto.value == '') {
      this.url = '';
    } else {
      this.url = urlTexto.value;
    }
  }

  //ERROR AL MOSTRAR LA IMAGEN (URL)
  errorArchivo() {
    this.borrarImagen();
    alert('Eliga un archivo válido.')
  }

  //ERROR AL MOSTRAR LA IMAGEN (URL)
  errorUrl() {
    this.borrarImagenUrl();
    alert('Introduzca una URL válida.')
  }

  //ELIMINAR IMAGEN SELECCIONADA (URL)
  borrarImagenUrl() {
    let urlTexto = <HTMLInputElement>document.getElementById('imagenUrl');
    urlTexto.value = '';
    this.url = '';
  }

  //ELIMINAR IMAGEN SELECCIONADA (ARCHIVO)
  borrarImagen() {
    let selector = <HTMLInputElement>document.getElementById('InputFile');
    selector.value = '';
    this.imagen = [];
    this.url = '';
  }

  //METODO SELECCIONADO PARA SUBIR IMAGEN
  urlImagen() {
    let seleccion1 = <HTMLInputElement>document.getElementById('customRadio1');
    let seleccion2 = <HTMLInputElement>document.getElementById('customRadio2');

    if (seleccion1.checked) {
      this.porURL = true;
      this.porArchivo = false;
      this.borrarImagen();
    } else if (seleccion2.checked) {
      this.porURL = false;
      this.porArchivo = true;
      this.borrarImagenUrl();
    }
  }

  //OBTENER TODAS LAS CATEGORIAS
  obtenerCategorias() {
    this.categoriaService.obtenerTodasCategorias()
      .subscribe(datos => {
        datos.map(categoriaDatos => {
          this.categorias.push(categoriaDatos.nombre);
        })
      });
  }

  //CREAR PRODUCTOS
  onCrearProducto({ value }: { value: ProductoInterface }) {
    // let form = <HTMLFormElement>document.getElementById('form');
    let seleccion1 = <HTMLInputElement>document.getElementById('customRadio1');
    let seleccion2 = <HTMLInputElement>document.getElementById('customRadio2');
    let crear: boolean = false;

    if (value.categoria == '') {
      value.categoria = this.categoriaPrimera;
    }

    if (value.nombre == '') {
      alert('Agrega un nombre al producto');
    } else if (value.categoria == '') {
      alert('Selecciona una categoria al producto');
    } else if (value.precio == null || value.precio == 0) {
      alert('Agrega un precio al producto');
    } else if (value.tienda == '') {
      alert('Selecciona una tienda al producto');
    } else if (seleccion1.checked) {
      if (this.url == '') {
        alert('Agrega una URL al producto');
      } else {
        crear = true;
      }
    } else if (seleccion2.checked) {
      if (this.imagen.length == 0) {
        alert('Sube una imagen para el producto');
      } else {
        crear = true;
        value.imagenUrl = 'LOCAL';
      }
    }
    if (crear) {
      this.producto = value;
      this.producto.idUsuario = this.authService.authFirebase.auth.currentUser.uid;
      this.producto.fecha = Date.now();
      this.productoService.crearProducto(this.producto, this.imagen);
    }
  }
  
}
