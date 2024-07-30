import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";

@Component({
  selector: "app-add-clinic",
  templateUrl: "./add-clinic.component.html",
  styleUrls: ["./add-clinic.component.css"],
})
export class AddClinicComponent implements OnInit, OnDestroy {
  states: any;
  districts: any;
  selectedFiles: File[] = [];
  File: any;
  clinicData: any;
  stateId: any;
  isEditForm: boolean = false;
  isClinicData: boolean = false;
  isFileChanged: boolean = false;
  myForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private toast: HotToastService
  ) {}

  ngOnInit() {
    let clinId = parseInt(localStorage.getItem("clinicId"));
    this.initializeForm();
    this.getStates();
    if (this.router.url.includes("edit-clinic") && clinId) {
      this.isEditForm = true;
      this.getClinicDetails(clinId);
    }
  }

  initializeForm(): void {
    this.myForm = this.fb.group({
      entityName: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      streetName: ["", [Validators.required, Validators.minLength(3)]],
      cityName: ["", [Validators.required, Validators.minLength(3)]],
      stateId: ["", Validators.required],
      districtId: ["", Validators.required],
      pincode: ["", [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      files: ["", Validators.required],
      gst: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}[0-9]{1}$/
          ),
        ],
      ],
    });
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

  validateToNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^0-9]/g, "");
      input.dispatchEvent(new Event("input"));
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

  onInputChange(event: any, id: string) {
    let maxLength: any;
    if (id == "phone") {
      maxLength = 10;
    } else if (id == "pincode") {
      maxLength = 6;
    }
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/\D/g, "");

    this.myForm.patchValue({ phoneNumber: newValue.substring(0, maxLength) });
  }

  ngOnDestroy() {}

  submit() {
    if (this.myForm.valid) {
      for (let file of this.selectedFiles) {
        console.log("=-=-=file=-=-=", file);
        this.File = file;
      }
      const formValue = {
        entityName: this.myForm.value.entityName,
        description: this.myForm.value.description,
        email: this.myForm.value.email,
        phone: this.myForm.value.phone,
        gstNo: this.myForm.value.gst,
        streetName: this.myForm.value.streetName,
        cityName: this.myForm.value.cityName,
        stateId: this.myForm.value.stateId,
        districtId: this.myForm.value.districtId,
        pincode: this.myForm.value.pincode,
        file: this.File,
      };
      const formData = new FormData();
      for (const key in formValue) {
        if (formValue.hasOwnProperty(key)) {
          formData.append(key, formValue[key]);
        }
      }

      this.service.post(formData, "/api/v1/admin/add-clinic").subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.toast.success(response.message);
            localStorage.setItem("source", "clinic");
            localStorage.setItem("clinicId", response.data.entityId);
            this.router.navigate(["add-bank"]);
          } else {
            // Handle error response
            this.toast.error(response.message);
          }
        },
        (error) => {
          console.error("API call failed:", error);
          this.toast.error(error);
        }
      );
    }
  }

  getClinicDetails(clinic: number) {
    const payload = {
      entityId: clinic,
    };
    this.service.post(payload, "/api/v1/admin/clinic-profile").subscribe(
      (response) => {
        console.log("clinicProfile Res==>", response.data.entityResponse);
        if (response.statusCode == "200") {
          this.isClinicData = true;
          this.clinicData = response.data.entityResponse;
          if (this.clinicData.stateId) {
            this.getDistrict(this.clinicData.stateId);
          }
          this.stateId = response.data.entityResponse.stateId;
          this.myForm.patchValue({
            entityName: this.clinicData.entityName,
            description: this.clinicData.description,
            email: this.clinicData.email,
            phone: this.clinicData.phone,
            streetName: this.clinicData.streetName,
            cityName: this.clinicData.cityName,
            stateId: this.clinicData.stateId,
            pincode: this.clinicData.pincode,
            files: this.clinicData.entityImage,
            gst: this.clinicData.gstNo,
            districtId: this.myForm.value.districtId,
          });
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

  onFileChange(event: Event) {
    if (!this.myForm.valid) {
      this.logValidationErrors(this.myForm);
    }
    this.isFileChanged = true;
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

  getStates() {
    this.service.post({}, "/api/v1/admin/list-state").subscribe(
      (response) => {
        console.log("list-state Res==>", response.data);

        if (response.statusCode == "200") {
          this.states = response.data;
          console.log("STATES==>", this.states);
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
  getDistrict(stId: any) {
    console.log("EVENT==>", stId);
    this.service
      .post({ stateId: stId }, "/api/v1/admin/list-district")
      .subscribe(
        (response) => {
          console.log("list-district Res==>", response.data);
          if (response.statusCode == "200") {
            this.districts = response.data;
            const matchingDistrict = response.data.find(
              (district) => district.districtName === this.clinicData.district
            );
            if (matchingDistrict) {
              this.myForm.patchValue({
                districtId: matchingDistrict.districtId,
              });
            }
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

  onBack() {
    this.router.navigate(["clinic-list"]);
  }
}
