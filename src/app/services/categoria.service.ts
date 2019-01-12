import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CategoriaInterface } from '../modelos/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  categoriaCollection: AngularFirestoreCollection<CategoriaInterface>;
  categoriaDoc: AngularFirestoreDocument<CategoriaInterface>;
  categorias: Observable<CategoriaInterface[]>;
  categoria: Observable<CategoriaInterface>;

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) { 
    this.categoriaCollection = this.afs.collection('categorias', ref => ref);
  }

  //OBTENER TODAS LAS CATEGORIAS
  obtenerTodasCategorias() {
    this.categoriaCollection = this.afs.collection('categorias/', ref => ref.orderBy('nombre', "asc"));
    this.categorias = this.categoriaCollection.snapshotChanges()
      .map(changes => {
        return changes.map(accion => {
          const datos = accion.payload.doc.data() as CategoriaInterface;
          datos.id = accion.payload.doc.id;
          // console.log(datos)
          return datos;
        });
      });
      return this.categorias;
  }

}
