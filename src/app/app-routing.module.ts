import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { AgregarprecioComponent } from './componentes/agregarprecio/agregarprecio.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { CrearproductoComponent } from './componentes/crearproducto/crearproducto.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { PaginaNoEncontradaComponent } from './componentes/paginanoencontrada/paginanoencontrada.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AcercaComponent } from './componentes/acerca/acerca.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: InicioComponent, pathMatch: 'full'},
  { path: '#', component: InicioComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'precio/agregar/:id', component: AgregarprecioComponent, canActivate: [AuthGuard] },
  { path: 'categorias/categoria/:id', component: CategoriaComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'productos/crear', component: CrearproductoComponent, canActivate: [AuthGuard] },
  { path: 'productos/producto/:id', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: '**', component: PaginaNoEncontradaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
