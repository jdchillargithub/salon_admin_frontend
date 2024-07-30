import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ChartsModule } from "ng2-charts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { AuthLayoutRoutes } from "./auth-layout.routing";
import { LoginComponent } from "../../pages/login/login.component";
import { ClinicLoginComponent } from "../../pages/clinic-login/clinic-login.component";
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgOtpInputModule,
  ],
  declarations: [LoginComponent, ClinicLoginComponent],
})
export class AuthLayoutModule {}
