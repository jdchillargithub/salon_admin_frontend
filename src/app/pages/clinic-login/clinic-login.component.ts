import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";
import { HotToastService } from "@ngneat/hot-toast";

@Component({
  selector: "app-clinic-login",
  templateUrl: "./clinic-login.component.html",
  styleUrls: ["./clinic-login.component.css"],
})
export class ClinicLoginComponent implements OnInit {
  submitedOtp: string = "";
  otpFilled: boolean = false;
  isTimerEnd: boolean = false;
  regexPattern: RegExp = /^\d{6}$/;
  otpViewFlag = false;
  timer: any;
  timeLeft: number = 60;

  myForm!: FormGroup;
  otpForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private toast: HotToastService // private userPhoneService : UserPhone
  ) {}
  ngOnInit() {
    this.initializeForm();
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/\D/g, "");
    const maxLength = 10;

    this.myForm.patchValue({ phoneNumber: newValue.substring(0, maxLength) });
  }

  onOtpInputChange(data: any) {
    this.submitedOtp = data;
    console.log("typing...", data);

    if (this.regexPattern.test(this.submitedOtp)) {
      this.otpFilled = true;
    }else{
      this.otpFilled = false;
    }
  }

  initializeForm(): void {
    this.myForm = this.fb.group({
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
    });

    this.otpForm = this.fb.group({
      otp: ["", [Validators.required]],
    });
  }

  onSubmit() {
    console.log(`=-=-=-=FORM=-=-=-`, this.myForm);

    if (this.myForm.valid) {
      localStorage.setItem("phone", this.myForm.value.phoneNumber);

      const formValue = {
        phone: this.myForm.value.phoneNumber,
      };
      console.log(`=-=-=-=form=-=-=-`, this.myForm.value);

      this.service.post(formValue, "/api/v1/clinic/generate-otp").subscribe(
        (response) => {
          console.log(`Otp response`, response);
          this.myForm.reset();
          if (response.statusCode === 200) {
            this.otpViewFlag = true;
            this.startTimer();
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

  onOtpSubmit() {
    console.log(1111);
    
    if (this.otpFilled) {
      const phoneNum = localStorage.getItem("phone");
      const formValue = {
        phone: phoneNum,
        otp: this.submitedOtp,
      };
      console.log(`=-=-=-=form=-=-=-`, this.myForm.value);

      this.service.post(formValue, "/api/v1/clinic/clinic-login").subscribe(
        (response) => {
          console.log(`Otp response`, response);
          this.myForm.reset();
          if (response.statusCode === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("clinicId", response.data.clinicId);
            localStorage.setItem("userType", response.data.userType);
            localStorage.setItem("clinicName", response.data.clinicName);
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
    } else {
      console.log("Form is invalid");
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.isTimerEnd = false;
        this.timeLeft--;
      } else {
        this.isTimerEnd = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  resndOtp() {
    clearInterval(this.timer); // Reset the timer
    this.timeLeft = 60;
    this.otpForm.setValue({ otp: "" });
    const phoneNum = localStorage.getItem("phone");
    if (phoneNum) {
      const formValue = {
        phone: phoneNum,
      };

      this.service.post(formValue, "/api/v1/clinic/resend-otp").subscribe(
        (response) => {
          console.log(`Otp response`, response);
          if (response.statusCode === 200) {
            this.startTimer();
            this.toast.success("OTP sent");
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
    } else {
      this.toast.warning("Invalid Phone Number !");
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
