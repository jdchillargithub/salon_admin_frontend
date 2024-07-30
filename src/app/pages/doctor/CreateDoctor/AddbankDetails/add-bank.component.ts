import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../services/auth.service";
import Swal from "sweetalert2";
import { HotToastService } from "@ngneat/hot-toast";
import { DocRegStepOne } from "../../../../services/docRegStepOne.service";
import { Location } from "@angular/common";
import { LoaderService } from "../../../../services/loadingService";

@Component({
  selector: "app-add-bank",
  templateUrl: "./add-bank.component.html",
  styleUrls: ["./add-bank.component.scss"],
})
export class AddBankComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  storedData: any;
  source: string;
  clinId: number;
  bankDataOf: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private toast: HotToastService,
    private docRegStepOne: DocRegStepOne,
    private location: Location,
    private loaderService: LoaderService
  ) {
    this.source = localStorage.getItem("source");
    this.clinId = parseInt(localStorage.getItem("clinicId"));
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bankDataOf: string };
    if (state && state.bankDataOf) {
      this.bankDataOf = state.bankDataOf;
    }
    // this.storedData = this.docRegStepOne.docRegStepOne;

    // Check if storedData is empty
    // const isEmpty =
    //   Object.keys(this.storedData).length === 0 &&
    //   this.storedData.constructor === Object;

    // if (isEmpty) {
    //   console.log("The stored data is empty.");
    //   this.router.navigate(["create-doctor"]);
    // } else {
    //   console.log("The stored data is not empty.");
    // }
    this.myForm = this.fb.group({
      account: ["", [Validators.required, Validators.pattern(/^\d{14}$/)]],
      ifsc: ["", [Validators.required, Validators.pattern(/^[A-Z]{4}\d{7}$/)]],
      bank: ["", Validators.required],
      accountHolder: ["", Validators.required],
      upi: ["", [Validators.required, Validators.pattern(/^[\w\d]+@\w+$/)]],
    });
  }

  validateToLettersAndNumbersOnly(field: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
      input.dispatchEvent(new Event("input"));
    }
    if (field === "ifsc") {
      input.value = input.value.toUpperCase();
      input.dispatchEvent(new Event("input"));
    }
  }

  validateToLettersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z\s]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z\s]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  onInputChange(fieldName: string, event: any) {
    const inputValue = event.target.value;
    let newValue = inputValue;
    let maxLength = 0;

    switch (fieldName) {
      case "ifsc":
        newValue = inputValue.toUpperCase();
        maxLength = 11;
        break;
      case "account":
        newValue = inputValue.replace(/\D/g, "");
        maxLength = 14;
        break;
      case "upi":
        maxLength = 50;
        break;
      default:
        break;
    }
    this.myForm.patchValue({ [fieldName]: newValue.substring(0, maxLength) });
  }

  ngOnDestroy() {}

  submit() {
    if (this.myForm.valid) {
      const account_no = this.myForm.value.account;
      const ifsc_code = this.myForm.value.ifsc;
      const bank_name = this.myForm.value.bank;
      const account_holder_name = this.myForm.value.accountHolder;
      const UPI_ID = this.myForm.value.upi;

      if (this.source == "clinic") {
        let formValue2 = {
          entityId: this.clinId,
          account_no: account_no,
          ifsc_code: ifsc_code,
          bank_name: bank_name,
          account_holder_name: account_holder_name,
          UPI_ID: UPI_ID,
        };
        this.service.post(formValue2, "/api/v1/admin/add-bank").subscribe(
          (response) => {
            console.log(`login success`, response);
            this.myForm.reset();
            if (response.statusCode === 200) {
              this.toast.success(response.message);
              this.router.navigate(["clinic-list"]);
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
        let formValue2 = {
          entityId: this.clinId,
          account_no: account_no,
          ifsc_code: ifsc_code,
          bank_name: bank_name,
          account_holder_name: account_holder_name,
          UPI_ID: UPI_ID,
        };
        console.log("=--=-=2=-=-", formValue2);

        this.service.post(formValue2, "/api/v1/admin/add-bank").subscribe(
          (response) => {
            console.log(`login success`, response);
            this.myForm.reset();
            if (response.statusCode === 200) {
              this.toast.success(response.message);
              this.router.navigate(["doctors"]);
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
        ),
          (error) => {
            // Handle the error response
            console.error("Login failed:", error);
          };
      }
    }
  }
  onBack() {
    this.location.back();
  }
}
