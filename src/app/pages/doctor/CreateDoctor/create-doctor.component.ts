import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import Swal from "sweetalert2";
import { HotToastService } from "@ngneat/hot-toast";
import { DocRegStepOne } from "../../../services/docRegStepOne.service";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Location } from "@angular/common";

export interface PeriodicElement {
  ID: number;
  department_name: string;
  status: string;
  department_id: number;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-create-doctor",
  templateUrl: "./create-doctor.component.html",
  styleUrls: ["./create-doctor.component.scss"],
})
export class CreateDoctorComponent implements OnInit, OnDestroy {
  faCheckCircle = faCheckCircle;

  selectedOption: any;
  typeSelected: boolean = false;
  btntext: string = "Create";
  myForm!: FormGroup;
  originalData: PeriodicElement[] = [];
  docData: any;
  clinId: any;

  dataSource: PeriodicElement[] = ELEMENT_DATA;

  departments: any[] = [];
  selectedFiles: File[] = [];
  FileData: File;
  clinicName: any;
  isGSTRegistered: boolean = false;
  isFromClinic: boolean = false;

  onRadioChange(option: any) {
    this.selectedOption = option;
    console.log("Selected option:", this.selectedOption);
    if (this.selectedOption === "individual") {
      this.myForm.patchValue({ clinic: "no clinic" });
      this.handleEntityNameChange()
      this.btntext = "Next >";
    } else {
      this.myForm.patchValue({ clinic: "" });
      this.myForm.patchValue({ entityName: "" });
      this.btntext = "Create";
      this.getClinicLIst();
    }
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private toast: HotToastService,
    private docRegStepOne: DocRegStepOne,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.clinId = parseInt(localStorage.getItem("clinicId"));
    this.getDepartments();
  }

  ngOnInit() {
    this.initializeForm();
    this.checkNavigationState();
  }

  checkNavigationState() {
    const source = localStorage.getItem("source");
    if (source === "clinic") {
      this.onRadioChange("staff");
      this.isFromClinic = true;
      this.myForm.patchValue({
        clinic: this.clinId,
      });
      this.myForm.patchValue({ businessType: "staff" });
    }
  }

  getClinicLIst() {
    let apiUrl = `/api/v1/admin/list-clinic-name`;

    this.service.post({}, apiUrl).subscribe(
      (response) => {
        console.log("clinicName Res==>", response.data.clinicData);

        if (response.statusCode == "200") {
          this.clinicName = response.data.clinicData;
        } else {
          this.toast.error(response.message);
        }
      },
      (error) => {
        console.error("API call failed:", error);
        this.toast.error("Failed to fetch clinic data.");
      }
    );
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.getDoctorData((event.target as HTMLInputElement).value);
    }
  }

  initializeForm(): void {
    this.myForm = this.fb.group({
      businessType: ["", Validators.required],
      clinic: ["", Validators.required],
      doctorName: ["", [Validators.required, Validators.minLength(3)]],
      entityName: [""],
      doctorQualification: ["", [Validators.required, Validators.minLength(2)]],
      department: ["", Validators.required],
      bookingType: ["", Validators.required],
      // doctorDescription: ['', Validators.required],
      phone: ["", [Validators.required, Validators.maxLength(10)]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      // gst: [
      //   "",
      //   [
      //     Validators.required,
      //     Validators.pattern(
      //       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}[0-9]{1}$/
      //     ),
      //   ],
      // ],
      gst: [""],
      consultationDuration: [
        "",
        [Validators.required, Validators.pattern(/^\d{1,2}$/)],
      ],
      tokensCount: [""],
      consultationCharge: ["", Validators.required],
      description: ["",[Validators.required, Validators.minLength(5)]],
      files: ["", Validators.required],
    });
  }

  handleEntityNameChange() {
    const entityNameControl = this.myForm.get("entityName");
    if (this.isFromClinic) {
      entityNameControl?.setValidators([Validators.required]);
    } else {
      entityNameControl?.clearValidators();
    }
    entityNameControl?.updateValueAndValidity();
  }

  ngOnDestroy() {
    localStorage.setItem("source", "");
  }

  validateToLettersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z\s]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z\s]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  validateToLettersAndNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  validateToLettersAndSpecialCharactersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z\s\W_]*$/;
  
    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[0-9]/g, ""); // Remove numbers
      input.dispatchEvent(new Event("input"));
    }
  }

  validateToNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^0-9]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  restrictToNumbers(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
    value = value.slice(0, 10); // Restrict to maximum 10 digits

    // Update the input value
    input.value = value;

    // Update the form control value
    this.myForm.get("phone")?.setValue(value);
  }

  restrictToNumbersWithDot(event: any) {
    const input = event.target;
    const currentValue = input.value;

    // Regular expression to match numbers and at most one dot
    const regex = /^[0-9]*(\.[0-9]{0,1})?$/;

    if (!regex.test(currentValue)) {
      // Remove non-numeric and extra dot characters
      input.value = currentValue
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
      this.myForm.get("consultationCharge")?.setValue(input.value);
    }
  }

  onBookingTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const tokensCountControl = this.myForm.get("tokensCount");
    const durationCountControl = this.myForm.get("consultationDuration");
    if (selectedValue == "token") {
      this.typeSelected = true;
      tokensCountControl.setValidators([Validators.required]);
      tokensCountControl.updateValueAndValidity();
    } else {
      this.typeSelected = false;
      tokensCountControl.setValidators(null);
      tokensCountControl.updateValueAndValidity();
      // durationCountControl.setValidators([Validators.required]);
    }
  }

  logValidationErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      const controlErrors = form.get(key).errors;
      if (controlErrors != null) {
        console.log("Key:", key, "Errors:", controlErrors);
      }
    });
  }

  submit() {
    if (this.myForm.valid && this.selectedFiles.length > 0) {
      const formData = new FormData();

      formData.append("businessType", this.selectedOption);
      formData.append("entity_id", this.myForm.value.clinic);
      formData.append("doctor_name", this.myForm.value.doctorName);
      formData.append("entityName", this.myForm.value.entityName);
      formData.append("bookingType", this.myForm.value.bookingType);
      formData.append("qualification", this.myForm.value.doctorQualification);
      formData.append("department_id", this.myForm.value.department);
      formData.append("email", this.myForm.value.email);
      formData.append("doctor_phone", this.myForm.value.phone);
      formData.append("tokens", this.myForm.value.tokensCount);
      formData.append(
        "consultation_time",
        this.myForm.value.consultationDuration
      );
      formData.append(
        "consultation_charge",
        this.myForm.value.consultationCharge
      );
      formData.append("description", this.myForm.value.description);
      formData.append("gstNo", this.myForm.value.gst);
      formData.append("file", this.selectedFiles[0]);

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const apiUrl = "/api/v1/admin/add-doctor";

      this.service.post(formData, apiUrl).subscribe(
        (response) => {
          this.myForm.reset();
          this.selectedFiles = [];
          if (
            response.statusCode === 200 &&
            this.selectedOption === "individual"
          ) {
            this.toast.success(response.message);
            localStorage.setItem("clinicId", response.data.entityId);
            this.router.navigate(["add-bank"]);
          } else if (
            response.statusCode === 200 &&
            this.selectedOption === "staff"
          ) {
            this.toast.success(response.message);
            localStorage.setItem("clinicId", response.data.entityId);
            this.router.navigate(["doctors"]);
          } else {
            this.toast.error(response.message);
            this.myForm.patchValue({ clinic: "", department: "" });
          }
        },
        (error) => {
          console.error("Add doctor failed:", error);
          this.toast.error("Failed to add doctor.");
        }
      );
    }
  }

  // submit() {
  //   for (let file of this.selectedFiles) {
  //     console.log("=-=-=file=-=-=", file);
  //     this.FileData = file;
  //   }
  //   if (this.myForm.valid && this.FileData) {
  //     let formValue = {
  //       businessType: this.selectedOption,
  //       entity_id: this.myForm.value.clinic,
  //       doctor_name: this.myForm.value.doctorName,
  //       entityName: this.myForm.value.entityName,
  //       qualification: this.myForm.value.doctorQualification,
  //       department_id: this.myForm.value.department,
  //       email: this.myForm.value.email,
  //       doctor_phone: this.myForm.value.phone,
  //       consultation_time: this.myForm.value.consultationDuration,
  //       consultation_charge: this.myForm.value.consultationCharge,
  //       file: this.FileData,
  //       description: this.myForm.value.description,
  //       gstNo: this.myForm.value.gst,
  //     };
  //     console.log("=-=-=-formsss=-=-", formValue);
  //     if (formValue.businessType === "individual") {
  //       this.service.post(formValue, "/api/v1/admin/add-doctor").subscribe(
  //         (response) => {
  //           this.myForm.reset();
  //           if (response.statusCode === 200) {
  //             this.toast.success(response.message);
  //             localStorage.setItem("clinicId", response.data.entityId);
  //             this.selectedFiles = [];
  //             this.router.navigate(["add-bank"]);
  //           } else if (response.statusCode === 400) {
  //             this.toast.error(response.message);
  //           } else {
  //             this.toast.error(response.message);
  //           }
  //         },
  //         (error) => {
  //           console.error("Add doctor failed:", error);
  //         }
  //       );
  //     } else if (formValue.businessType === "staff") {
  //       this.service.post(formValue, "/api/v1/admin/add-doctor").subscribe(
  //         (response) => {
  //           console.log(`login success`, response);
  //           this.myForm.reset();
  //           if (response.statusCode === 200) {
  //             this.toast.success(response.message);
  //             this.router.navigate(["doctors"]);
  //           } else if (response.statusCode === 400) {
  //             console.log(response.message);
  //             this.toast.error(response.message);
  //             this.selectedFiles = [];
  //             this.myForm.patchValue({ clinic: "", department: "" });
  //           } else {
  //             console.log("Something went wrong!");
  //             this.toast.error(response.message);
  //             this.selectedFiles = [];
  //             this.myForm.patchValue({ clinic: "", department: "" });
  //           }
  //         },
  //         (error) => {
  //           // Handle the error response
  //           console.error("Login failed:", error);
  //         }
  //       );
  //     }
  //   }
  // }

  async getDepartments() {
    try {
      const response: any = await this.service
        .post({ searchQuery: "" }, "/api/v1/admin/list-departments")
        .toPromise();
  
      if (response.statusCode == "200") {
        this.originalData = response.data.data;
      } else {
        this.toast.error(response.message);
      }
    } catch (error) {
      console.error("API call failed:", error);
      this.toast.error("Failed to fetch data.");
    }
  }
  

  getDoctorData(phone: string) {
    this.service
      .post({ doctorPhone: phone }, "/api/v1/admin/search-doctor-by-phone")
      .subscribe(
        (response) => {
          if (response.statusCode == "200") {
            this.toast.success(response.message);
            this.docData = response.data.doctorData;
            const filteredDepartments = this.originalData.filter(
              (dept) => dept.department_name == this.docData.department
            );
            console.log("filteredDepartments==>", filteredDepartments);

            const departmentId =
              filteredDepartments.length > 0
                ? filteredDepartments[0].department_id
                : null;
            console.log("department_id==>", departmentId);

            this.myForm.patchValue({
              doctorName: this.docData.doctorName,
              department: departmentId,
              phone: this.docData.doctorPhone,
              email: this.docData.email,
              doctorQualification: this.docData.qualification,
              description: this.docData.description,
            });
          } else {
            this.toast.error(response.message);
          }
        },
        (error) => {
          console.error("API call failed:", error);
          this.toast.error("Failed to fetch data.");
        }
      );
  }

  onBack() {
    // this.router.navigate(["doctors"]);
    this.location.back();
  }

  onFileChange(event: Event) {
    console.log("Form values:", this.myForm.value);
    console.log("Form valid:", this.myForm.valid);
    if (!this.myForm.valid) {
      this.logValidationErrors(this.myForm);
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length) {
      const file = inputElement.files[0]; // Get the first file from the list

      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"]; // Define allowed image extensions

      if (allowedExtensions.includes(fileExtension)) {
        // File is valid, proceed with handling it
        this.selectedFiles = [file];
        this.myForm.patchValue({ files: this.selectedFiles }); // Update the form control value
      } else {
        // File is invalid, handle it accordingly
        console.log(
          "Invalid file format. Only images (jpg, jpeg, png, gif) are allowed."
        );
      }
    } else {
      // No file selected, reset the selectedFiles array and form control value
      this.selectedFiles = [];
      this.myForm.patchValue({ files: [] });
    }
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
    const filesInput = document.getElementById(
      "filesInput"
    ) as HTMLInputElement;
    this.updateFileInput(filesInput);
  }

  updateFileInput(input: HTMLInputElement) {
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach((file: any) => {
      dataTransfer.items.add(file);
    });
    input.files = dataTransfer.files;
  }

  handleGSTChange() {
    this.isGSTRegistered = !this.isGSTRegistered;
    const gstControl = this.myForm.get("gst");
    if (this.isGSTRegistered) {
      gstControl?.setValidators([
        Validators.required,
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}[0-9]{1}$/
        ),
      ]);
    } else {
      gstControl?.clearValidators();
    }
    gstControl?.updateValueAndValidity();
  }
}
