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
import { EditarprecioComponent } from './componentes/agregarprecio/editarprecio/editarprecio.component';
import { EditarproductoComponent } from './componentes/editarproducto/editarproducto.component';
import { BusquedaComponent } from './componentes/busqueda/busqueda.component';
import { ListasComponent } from './componentes/lista/listas/listas.component';
import { AgregarlistaComponent } from './componentes/lista/agregarlista/agregarlista.component';
import { DetallelistaComponent } from './componentes/lista/detallelista/detallelista.component';
import { ActivadetalleComponent } from './componentes/lista/activadetalle/activadetalle.component';
import { UsuarioslistasComponent } from './componentes/lista/usuarioslistas/usuarioslistas.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: '#', component: InicioComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'buscar', component: BusquedaComponent },
  { path: 'listas', component: ListasComponent },
  { path: 'listas/:id', component: UsuarioslistasComponent, canActivate: [AuthGuard] },
  { path: 'listas/detalle/:id', component: DetallelistaComponent },
  { path: 'listas/activa/detalle/:id', component: ActivadetalleComponent, canActivate: [AuthGuard] },
  { path: 'listas/agregar/nueva', component: AgregarlistaComponent, canActivate: [AuthGuard]  },
  { path: 'precio/agregar/:id', component: AgregarprecioComponent, canActivate: [AuthGuard] },
  { path: 'precio/editar/:idProducto/:idPrecio', component: EditarprecioComponent, canActivate: [AuthGuard] },
  { path: 'categorias/categoria/:id', component: CategoriaComponent },
  { path: 'productos/:id', component: ProductosComponent },
  { path: 'productos/crear/nuevo', component: CrearproductoComponent, canActivate: [AuthGuard] },
  { path: 'productos/editar/:id', component: EditarproductoComponent, canActivate: [AuthGuard] },
  { path: 'productos/producto/:id', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: '**', component: PaginaNoEncontradaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
