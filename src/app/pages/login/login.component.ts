import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";
import { HotToastService } from "@ngneat/hot-toast";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private toast: HotToastService
  ) // private userPhoneService : UserPhone
  {}
  ngOnInit() {
    this.myForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }
  ngOnDestroy() {}

  onSubmit() {
    if (this.myForm.valid) {
      const formValue = {
        email: this.myForm.value.email,
        password: this.myForm.value.password,
      };
      console.log(`=-=-=-=form=-=-=-`, formValue);

      // Perform your login logic here

      this.service.post(formValue, "/api/v1/admin/admin-login").subscribe(
        (response) => {
          console.log(`login success`, response);
          this.myForm.reset();
          if (response.statusCode === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("userType", response.data.userType);
            this.router.navigate(["/dashboard"]);
          } else if (response.statusCode === 400) {
            console.log(response.message);
            this.toast.error(response.message);
          } else {
            console.log("Something went wrong!");
            this.toast.error(response.message);
          }
        },
        (error) => {
          // Handle the error response
          console.error("Login failed:", error);
        }
      );
    }
  }

  switchToCLinic(){
    this.router.navigate(['/clinic-login']);
  }
}
