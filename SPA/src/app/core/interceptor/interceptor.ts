import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../serviceInfo/auth.service';
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor(private authSrv: AuthService) { }

    /**
     *  Interceita o pedido http e adiciona o token de autenticação
     * @param req 
     * @param next 
     * @returns 
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authSrv.getToken()
        if (token) {
            const cloned = req.clone({ headers: req.headers.set("Authorization", "Bearer " + token) });
            let authenticationHeader = cloned.headers.get("Authorization");
            if(authenticationHeader !== null){
                let tokenA = authenticationHeader.split(" ")[1];
            }
            return next.handle(cloned);
        }else {
            return next.handle(req);
        }
    }
}