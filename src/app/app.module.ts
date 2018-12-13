//ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//ROUTING
import { AppRoutingModule } from './app-routing.module';

//SERVICIOS
import { AuthService } from './services/auth.service';

//GUARDS
import { AuthGuard } from './guards/auth.guard';

//FIREBASE
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';


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
    AcercaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.configFirebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
