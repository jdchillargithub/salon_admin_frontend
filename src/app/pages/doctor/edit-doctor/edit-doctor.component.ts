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
  selector: "app-edit-doctor",
  templateUrl: "./edit-doctor.component.html",
  styleUrls: ["./edit-doctor.component.css"],
})
export class EditDoctorComponent implements OnInit {
  faCheckCircle = faCheckCircle;

  selectedOption: any;
  btntext: string = "Create";
  myForm!: FormGroup;
  originalData: any[];
  docData: any;
  clinId: number;
  docId: number;
  isDepartments: boolean = false;

  dataSource: PeriodicElement[] = ELEMENT_DATA;

  departments: any[] = [];
  selectedFiles: File[] = [];
  File: any;
  clinicName: any;
  isGSTRegistered: boolean = false;
  isCheck: boolean = false;
  isFromClinic: boolean = false;
  isDocdata: boolean = false;
  isFileChanged: boolean = false;

  onRadioChange(option: any) {
    this.selectedOption = option;
    console.log("Selected option:", this.selectedOption);
    if (this.selectedOption === "individual") {
      this.myForm.patchValue({ clinic: "no clinic" });
      this.btntext = "Next >";
    } else {
      this.btntext = "Create";
    }
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private toast: HotToastService,
    private docRegStepOne: DocRegStepOne,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.clinId = parseInt(localStorage.getItem("clinicId"));
    this.docId = parseInt(localStorage.getItem("docId"));
  }

  ngOnInit() {
    this.getDepartments();
    this.getDoctorData(this.docId, this.clinId);
    this.initializeForm();
    this.checkNavigationState();
    // this.route.data.subscribe((data: { departments: any[] }) => {
    //   this.originalData = data.departments;
    // });
  }

  checkNavigationState() {
    const source = localStorage.getItem("source");
    if (source === "clinic") {
      this.onRadioChange("staff");
      this.isFromClinic = true;
    }
  }

  // onKeyPress(event: KeyboardEvent) {
  //   if (event.key === "Enter") {
  //     this.getDoctorData((event.target as HTMLInputElement).value);
  //   }
  // }

  initializeForm(): void {
    this.myForm = this.fb.group({
      businessType: ["", Validators.required],
      clinic: ["", Validators.required],
      doctorName: ["", Validators.required],
      entityName: [""],
      doctorQualification: ["", Validators.required],
      department: ["", Validators.required],
      // doctorDescription: ['', Validators.required],
      phone: [
        "",
        [
          Validators.required,
          Validators.maxLength(10), // Maximum length of 10 digits
          Validators.minLength(10),
        ],
      ],
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
      consultationDuration: ["", Validators.required],
      consultationCharge: ["", Validators.required],
      description: ["", Validators.required],
      files: ["", Validators.required],
    });
  }

  ngOnDestroy() {
    localStorage.setItem("source", "");
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

  getDepartmentName(departmentId: number): string {
    const department = this.originalData.find(
      (dep) => dep.department_id === departmentId
    );
    return department ? department.department_name : "";
  }

  submit() {
    let formData = new FormData();

    for (let file of this.selectedFiles) {
      console.log("=-=-=file=-=-=", file);
      formData.append("file", file);
    }

    formData.append("entityId", this.clinId.toString());
    formData.append("doctorId", this.docId.toString());
    formData.append("doctor_name", this.myForm.value.doctorName);
    formData.append("entityName", this.myForm.value.entityName);
    formData.append("qualification", this.myForm.value.doctorQualification);
    formData.append("department_id", this.myForm.value.department);
    formData.append("email", this.myForm.value.email);
    formData.append("doctorPhone", this.myForm.value.phone);
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

    console.log("=-=-=-formsss=-=-", formData);

    this.service.post(formData, "/api/v1/admin/update-doctor").subscribe(
      (response) => {
        console.log(`login success`, response);
        this.myForm.reset();
        if (response.statusCode === 200) {
          this.toast.success(response.message);
          // this.router.navigate(["doctors"]);
          this.router.navigate(["/add-bank"], {
            state: { bankDataOf: "doctor" },
          });
        } else if (response.statusCode === 400) {
          console.log(response.message);
          this.toast.error(response.message);
          this.selectedFiles = [];
          this.myForm.patchValue({ clinic: "", department: "" });
        } else {
          console.log("Something went wrong!");
          this.toast.error(response.message);
          this.selectedFiles = [];
          this.myForm.patchValue({ clinic: "", department: "" });
        }
      },
      (error) => {
        // Handle the error response
        console.error("Login failed:", error);
      }
    );
  }
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]); // Extracting base64 string
      };
      reader.onerror = (error) => {
        reject("Error converting file to base64: " + error);
      };
    });
  }

  // submit() {
  //   for (let file of this.selectedFiles) {
  //     console.log("=-=-=file=-=-=", file);
  //     this.convertToBase64(file);
  //   }

  //   let formValue = {
  //     doctorName: this.myForm.value.doctorName,
  //     entityName: this.myForm.value.entityName,
  //     qualification: this.myForm.value.doctorQualification,
  //     department: this.getDepartmentName(this.myForm.value.department),
  //     email: this.myForm.value.email,
  //     doctorPhone: this.myForm.value.phone,
  //     consultationTime: this.myForm.value.consultationDuration,
  //     consultationCharge: this.myForm.value.consultationCharge,
  //     file: this.File,
  //     description: this.myForm.value.description,
  //     gstNo: this.myForm.value.gst,
  //   };
  //   console.log("=-=-=-formsss=-=-", formValue);

  //   this.service
  //     .post(
  //       {
  //         entityId: this.clinId,
  //         doctorId: this.docId,
  //         updatedData: formValue,
  //       },
  //       "/api/v1/admin/update-doctor"
  //     )
  //     .subscribe(
  //       (response) => {
  //         console.log(`login success`, response);
  //         this.myForm.reset();
  //         if (response.statusCode === 200) {
  //           this.toast.success(response.message);
  //           this.router.navigate(["doctors"]);
  //         } else if (response.statusCode === 400) {
  //           console.log(response.message);
  //           this.toast.error(response.message);
  //           this.selectedFiles = [];
  //           this.myForm.patchValue({ clinic: "", department: "" });
  //         } else {
  //           console.log("Something went wrong!");
  //           this.toast.error(response.message);
  //           this.selectedFiles = [];
  //           this.myForm.patchValue({ clinic: "", department: "" });
  //         }
  //       },
  //       (error) => {
  //         // Handle the error response
  //         console.error("Login failed:", error);
  //       }
  //     );
  // }

  getDepartments() {
    this.service
      .post({ searchQuery: "" }, "/api/v1/admin/list-departments")
      .subscribe(
        (response) => {
          if (response.statusCode == "200") {
            this.originalData = response.data.data;
            this.isDepartments = true;
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

  getDoctorData(id: number, clinic: number) {
    this.service
      .post({ doctorId: id, entityId: clinic }, "/api/v1/admin/view-doctor")
      .subscribe(
        (response) => {
          if (response.statusCode == "200") {
            this.isDocdata = true;
            this.docData = response.data.formattedResponse;

            // const filteredDepartments = this.originalData?.filter(
            //   (dept) => dept.department_name == this.docData.department
            // );

            // const departmentId =
            //   filteredDepartments.length > 0
            //     ? filteredDepartments[0].department_id
            //     : null;
            // console.log("DEpart==>", departmentId);

            if (this.docData.gstNo != "null") {
              this.isGSTRegistered = true;
              this.isCheck = true;
            }
            this.myForm.patchValue({
              doctorName: this.docData.doctorName,
              entityName: this.docData.entityName,
              department: this.docData.departmentId,
              clinic: this.docData.entityName,
              phone: this.docData.doctorPhone,
              doctorQualification: this.docData.qualification,
              consultationDuration: this.docData.consultationTime,
              consultationCharge: this.docData.consultationCharge,
              description: this.docData.description,
              email: this.docData.email,
              gst: this.docData.gstNo,
              files: this.docData.profileImageUrl,
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
    this.isFileChanged = true;
    console.log("Form values:", this.myForm.value);

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
