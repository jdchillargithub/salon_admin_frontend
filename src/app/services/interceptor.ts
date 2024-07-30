import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, switchMap, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { LoaderService } from "./loadingService";

@Injectable()
export class Interceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(
    private injector: Injector,
    private loaderService: LoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    if (req.url.includes("refreshToken")) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.getRefereshToken()}`,
        },
      });
    } else {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
    }
    this.requests.push(req);
    console.log(`=-=-=-=-=interceptor`);
    this.loaderService.showLoader(); // Show loader before making the request
    console.log("=-=-loader active=-=-");

    return next.handle(req).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            console.log("Response:", event);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            console.error("Error:", error.status);
            if (error.status === 401) {
              // Log out the user or perform any other desired action
              authService.logout();
            } else if (error.status === 403) {
              return this.handleRefrehToken(req, next);
            }
          }
        }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error("Request failed:", error);
        // Handle error cases globally if needed
        return throwError(error);
      }),
      finalize(() => {
        this.removeRequest(req);
        this.loaderService.hideLoader(); // Hide loader when the response is received
        console.log("=--loader deactivated=-=-");
      })
    );
  }


  handleRefrehToken(request: HttpRequest<any>, next: HttpHandler) {
    console.log("Token regenerating....");
    
    const authService = this.injector.get(AuthService);
    return authService.GenerateRefreshToken().pipe(
      switchMap((data: any) => {
        authService.SaveTokens(data);
        return next.handle(this.AddTokenheader(request,data.jwtToken))
      }),
      catchError(errodata=>{
        authService.logout();
        return throwError(errodata)
      })
    );
  }


  AddTokenheader(request: HttpRequest<any>, token: any) {
    return request.clone({ headers: request.headers.set('Authorization', 'bearer ' + token) });
  }

  private removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
  }
}
