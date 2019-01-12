import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from 'src/app/modelos/producto.interface';
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-editarproducto',
  templateUrl: './editarproducto.component.html',
  styleUrls: ['./editarproducto.component.css']
})
export class EditarproductoComponent implements OnInit {
  producto: ProductoInterface = {
    idProducto: '',
    idUsuario: '',
    firebaseId: '',
    nombre: '',
    categoria: '',
    imagenUrl: '',
    precio: null,
    fecha: null,
    tienda: 'Aurrera'
  }
  idProducto: string = '';
  categorias = [];
  url: string = '';
  urlActual: string = '';
  tipoImagen: string = '';
  tipoCambio: number = 0;
  cambioImagen: string = '';
  porURL: boolean = true;
  porArchivo: boolean = false;
  cambiarImagen: boolean = false;
  imagen: [];
  categoriaPrimera: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['id'];
    this.urlActual = '';
    this.obtenerCategorias();
    setTimeout(() => {
      this.categoriaPrimera = this.categorias[0];
    }, 500);
    this.imagen = [];
    this.cambiarImagen = false;
    this.obtenerProducto();
  }

  //CAMBIO DE IMAGEN
  cambiarImagenProducto(cambio: boolean) {
    if (cambio) {
      this.cambiarImagen = true;
      this.producto.imagenUrl = '';
      this.imagen = [];
    } else if (cambio == false) {
      this.cambiarImagen = false;
      this.producto.imagenUrl = this.urlActual;
      this.imagen = [];
    }
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
    if (urlTexto) {
      urlTexto.value = '';
      this.url = '';
    }
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

    if (this.producto.imagenUrl) {
      this.url = this.producto.imagenUrl;
    }

    if (seleccion1.checked) {
      if (this.producto.imagenUrl) {
        this.producto.imagenUrl = '';
      }
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
        datos.map(categoria => {
          this.categorias.push(categoria.nombre);
        })
      });
  }

  //OBTENER DETALLES DEL PRODUCTO
  obtenerProducto() {
    this.productoService.obtenerTodosProductos()
      .subscribe(datos => {
        datos.forEach(producto => {
          if (this.idProducto == producto.firebaseId) {
            // this.producto = producto;
            if (producto.imagenUrl == 'LOCAL') {
              this.tipoImagen = producto.imagenUrl;
              this.productoService.obtenerImagen(producto.idUsuario, producto.firebaseId)
                .then(urlImagen => {
                  if (urlImagen) {
                    producto.imagenUrl = urlImagen;
                  }
                  if (producto.imagenUrl) {
                    this.producto = producto;
                    this.urlActual = producto.imagenUrl;
                  }
                });
            } else {
              this.tipoImagen = 'URL';
              producto.imagenUrl = producto.imagenUrl;
              if (producto.imagenUrl) {
                this.producto = producto;
                this.urlActual = producto.imagenUrl;
              }
            }
          }
        });
      });
  }

  //EDITAR PRODUCTO
  onEditarProducto({ value }: { value: ProductoInterface }) {
    let seleccion1 = <HTMLInputElement>document.getElementById('customRadio1');
    let seleccion2 = <HTMLInputElement>document.getElementById('customRadio2');
    let crear: boolean = false;
    let tipoCambioImagen: string = '';

    if (value.categoria == '') {
      value.categoria = this.categoriaPrimera;
    }

    if (value.nombre == '') {
      alert('Agrega un nombre al producto');
    } else if (value.categoria == '') {
      alert('Selecciona una categoria al producto');
    } else if (this.cambiarImagen) {
      if (seleccion1.checked) {
        if (this.url == '') {
          alert('Agrega una URL al producto');
        } else {
          crear = true;
          this.cambioImagen = 'CAMBIOURL';
          tipoCambioImagen = 'URL';
        }
      } else if (seleccion2.checked) {
        if (this.imagen.length == 0) {
          alert('Sube una imagen para el producto');
        } else {
          crear = true;
          value.imagenUrl = 'LOCAL';
          this.cambioImagen = 'CAMBIOLOCAL';
          tipoCambioImagen = 'LOCAL';
        }
      }
    } else if (!this.cambiarImagen) {
      crear = true;
      if (this.tipoImagen == 'LOCAL') {
        value.imagenUrl = 'LOCAL';
      } else if (this.tipoImagen == 'URL') {
        value.imagenUrl = this.urlActual;
      }
      this.cambioImagen = 'SINCAMBIO';
    }

    if (crear) {
      // console.log(this.tipoImagen + '   --IMAGEN')
      // console.log(this.cambioImagen + '  --ACTUAL')
      // console.log(tipoCambioImagen + '  --CAMBIO')

      if (this.cambioImagen == 'CAMBIOURL' && this.tipoImagen == 'LOCAL' && tipoCambioImagen == 'URL') {
        //CAMBIO DE ARCHIVO A URL
        this.tipoCambio = 1;
      }

      if (this.cambioImagen == 'CAMBIOLOCAL' && this.tipoImagen == 'LOCAL' && tipoCambioImagen == 'LOCAL') {
        //CAMBIO DE ARCHIVO A ARCHIVO
        this.tipoCambio = 2;
      }

      if (this.cambioImagen == 'CAMBIOURL' && this.tipoImagen == 'URL' && tipoCambioImagen == 'URL') {
        //CAMBIO DE URL A URL
        this.tipoCambio = 3;
      }

      if (this.cambioImagen == 'CAMBIOLOCAL' && this.tipoImagen == 'URL' && tipoCambioImagen == 'LOCAL') {
        //CAMBIO DE URL A ARCHIVO
        this.tipoCambio = 4;
      }
      // console.log(this.tipoCambio)

      this.producto = value;
      this.producto.firebaseId = this.idProducto;
      this.producto.ultimaModificacion = Date.now();
      this.producto.idUsuario = this.authService.authFirebase.auth.currentUser.uid;
      this.productoService.editarProducto(this.producto, this.imagen, this.cambioImagen, this.tipoCambio);
    }
  }

}
