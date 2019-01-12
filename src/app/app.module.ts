//ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//ROUTING
import { AppRoutingModule } from './app-routing.module';

//SERVICIOS
import { AuthService } from './services/auth.service';
import { CategoriaService } from './services/categoria.service';
import { ListaService } from './services/lista.service';

//GUARDS
import { AuthGuard } from './guards/auth.guard';

//FIREBASE
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';

//COMPONENTES
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { CrearproductoComponent } from './componentes/crearproducto/crearproducto.component';
import { AgregarprecioComponent } from './componentes/agregarprecio/agregarprecio.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { PaginaNoEncontradaComponent } from './componentes/paginanoencontrada/paginanoencontrada.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AcercaComponent } from './componentes/acerca/acerca.component';
import { EditarprecioComponent } from './componentes/agregarprecio/editarprecio/editarprecio.component';
import { EditarproductoComponent } from './componentes/editarproducto/editarproducto.component';
import { BusquedaComponent } from './componentes/busqueda/busqueda.component';
import { ListasComponent } from './componentes/lista/listas/listas.component';
import { AgregarlistaComponent } from './componentes/lista/agregarlista/agregarlista.component';
import { DetallelistaComponent } from './componentes/lista/detallelista/detallelista.component';
import { ActivadetalleComponent } from './componentes/lista/activadetalle/activadetalle.component';
import { UsuarioslistasComponent } from './componentes/lista/usuarioslistas/usuarioslistas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductosComponent,
    ProductoComponent,
    CrearproductoComponent,
    AgregarprecioComponent,
    CategoriaComponent,
    PaginaNoEncontradaComponent,
    InicioComponent,
    AcercaComponent,
    EditarprecioComponent,
    EditarproductoComponent,
    BusquedaComponent,
    ListasComponent,
    AgregarlistaComponent,
    DetallelistaComponent,
    ActivadetalleComponent,
    UsuarioslistasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.configFirebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    CategoriaService,
    ListaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
