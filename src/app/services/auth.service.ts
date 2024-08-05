import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}
  /*** LOCAL BACKEND ***/
  // baseURL = "http://localhost:8000";
  /*** PRODUCTION BACKEND ***/
  // baseURL = "";

  /* UAT LINK */
  // baseURL = "http://139.59.76.214:8081";
  // baseURL = "http://booking.chillarpayments.com:8081";
  baseURL = "http://booking.chillarpayments.com:8090";

  /* NGROK LINK */
  // baseURL = "https://5f77-122-161-24-214.ngrok-free.app"

  // 1. Generic API Methods
  post(data: any, apiURL): Observable<any> {
    return this.http.post(`${this.baseURL}${apiURL}`, data);
  }

  put(data: any, apiURL): Observable<any> {
    return this.http.put(`${this.baseURL}${apiURL}`, data);
  }

  get(apiURL): Observable<any> {
    return this.http.get(`${this.baseURL}${apiURL}`);
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }
  getRefereshToken() {
    return localStorage.getItem("refreshToken");
  }
  SaveTokens(tokendata: any) {
    localStorage.setItem('accessToken', tokendata.accessToken);
    localStorage.setItem('refreshToken', tokendata.refreshToken);
  }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem("accessToken");
    return new HttpHeaders().set("Authorization", `Bearer ${accessToken}`);
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  }

  GenerateRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    const userType = localStorage.getItem("userType");

    let refreshTokenEndpoint: string;

    if (userType === "0") {
      refreshTokenEndpoint = `${this.baseURL}/api/v1/admin/admin-verify-refreshToken`;
    } else {
      refreshTokenEndpoint = `${this.baseURL}/api/v1/auth/refreshToken`;
    }

    return this.post({}, refreshTokenEndpoint);
  }

  // refreshToken(): Observable<any> {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   const userType = localStorage.getItem("userType");

  //   if (userType === "0") {
  //     console.log(1212121);
  //     this.post({}, "/api/v1/admin/admin-verify-refreshToken").subscribe(
  //       (response) => {
  //         console.log(1111);
  //         // Update local storage with new tokens
  //         if (response.statusCode === "200") {
  //           alert("Success1");
  //           localStorage.setItem("accessToken", response.data.accessToken);
  //           return response.data.accessToken;
  //         }
  //       }
  //     );
  //   } else {
  //     this.post({}, "/api/v1/auth/refreshToken").subscribe((response) => {
  //       console.log(1111);
  //       // Update local storage with new tokens
  //       if (response.statusCode === "200") {
  //         alert("Success2");
  //         localStorage.setItem("accessToken", response.data.accessToken);
  //         return response.data.accessToken;
  //       }
  //     }); // Subscribe to the observable
  //   }
  //   return ;
  // }

  logout(): Observable<HttpResponse<any>> {
    return this.http
      .delete(this.baseURL + "/v1/security/logout", { observe: "response" })
      .pipe(
        tap((response) => {
          if (response.status === 200) {
            localStorage.clear();
            console.log(response);
          }
        })
      );
  }
}
