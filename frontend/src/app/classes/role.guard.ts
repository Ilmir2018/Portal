import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../services/auth.service";


@Injectable({
    providedIn: 'root'
})

export class RoleGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router){}

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(childRoute, state)
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if(localStorage.getItem('role') === "ADMIN") {
            return of (true)
        } else {
            this.router.navigate(['/contacts'], {
                queryParams: {
                    roleDenied: true
                }
            })
            return of(false)
        }
    }

}