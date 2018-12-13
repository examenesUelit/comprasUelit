import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authservice: AuthService, private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authservice.authFirebase.authState
      .take(1)
      .map(authState => !! authState)
      .do(usuario => {
        if (!usuario) {
          this.router.navigate(['/login']);
          alert('Debe iniciar sesión para ver esta página.')
        }
      });
  }
}
