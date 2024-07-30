import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HotToastService } from "@ngneat/hot-toast";
import { AuthService } from "../../../services/auth.service";
import { noLeadingSpaceValidator } from "../../../services/custom.validator";

@Component({
  selector: "app-add-department",
  templateUrl: "./add-department.component.html",
  styleUrls: ["./add-department.component.css"],
})
export class AddDepartmentComponent implements OnInit {
  myForm!: FormGroup;
  departData: any;
  isEditForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private toast: HotToastService
  ) {}

  ngOnInit() {
    this.initializeForm();
    let departId = parseInt(localStorage.getItem("departId"));
    if (this.router.url.includes("edit-department") && departId) {
      this.isEditForm = true;
      this.getDepartmentData(departId);
    }
  }

  validateToLettersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z\s]*$/;

    // Remove leading spaces using a regular expression
    input.value = input.value.replace(/^\s+/, "");

    // Validate against the pattern
    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z\s]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  initializeForm(): void {
    this.myForm = this.fb.group({
      department_name: ["", [Validators.required, noLeadingSpaceValidator()]],
    });
  }

  getDepartmentData(id: number) {
    const payload = {
      department_id: id,
    };
    this.service.post(payload, "/api/v1/admin/view-dept").subscribe(
      (response) => {
        console.log("view-dept Res==>", response.data);
        if (response.statusCode == "200") {
          this.departData = response.data;
          this.myForm.patchValue({
            department_name: this.departData.department_name,
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

  addDepartment() {
    if (this.myForm.valid) {
      const payload = {
        department_name: this.myForm.value.department_name,
      };
      this.service.post(payload, "/api/v1/admin/add-dept").subscribe(
        (response) => {
          if (response.statusCode == "200") {
            this.toast.success("Department added successfully");
            this.router.navigate(["list-department"]);
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
  }

  submit() {
    if (this.isEditForm) {
      if (this.myForm.valid) {
        let payload = {
          department_name: this.myForm.value.department_name,
          department_id: this.departData.department_id,
        };
        this.service.post(payload, "/api/v1/admin/update-dept").subscribe(
          (response) => {
            if (response.statusCode == "200") {
              this.toast.success("Update successful");
              this.router.navigate(["list-department"]);
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
    } else {
      this.addDepartment();
    }
  }

  onBack() {
    this.router.navigate(["list-department"]);
  }
}
