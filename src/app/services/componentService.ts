import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { HotToastService } from "@ngneat/hot-toast";

@Injectable({
  providedIn: "root",
})
export class componentService {
  originalData: any;

  constructor(
    private router: Router,
    private service: AuthService,
    private toast: HotToastService
  ) {}

  getDepartments() {
    this.service
      .post({ searchQuery: "" }, "/api/v1/admin/list-departments")
      .subscribe(
        (response) => {
          if (response.statusCode == "200") {
            return response.data.data;
          } else {
            this.toast.error(response.message);
          }
        },
        (error) => {
          console.error("API call failed:", error);
        //   this.toast.error("Failed to fetch data.");
        }
      );
  }
}
