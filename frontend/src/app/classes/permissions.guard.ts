import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../services/auth.service";


@Injectable({
    providedIn: 'root'
})

export class PermissionsGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router){}

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(childRoute, state)
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let permissions = JSON.parse(localStorage.getItem('permissions'))
        let permission;
        //Получаем массив разрешений на (чтение, запись и удаление)
        permissions.forEach((item) => {
            if(item.url == route.routeConfig.path) {
                permission = item
            }
        })
        // console.log(permissions)
        //Проверяем право на чтение
        if(permission.permissions[0] !== true) {
            return of (true)
        } else {
            this.router.navigate([], {
                queryParams: {
                    permissionDenied: true
                }
            })
            return of(false)
        }
    }

}