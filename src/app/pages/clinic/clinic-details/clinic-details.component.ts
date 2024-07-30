import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Location } from "@angular/common";

@Component({
  selector: "app-clinic-details",
  templateUrl: "./clinic-details.component.html",
  styleUrls: ["./clinic-details.component.css"],
})
export class ClinicDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: AuthService,
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  dataSource = new MatTableDataSource<any>();
  Tcount: number = 0;
  isResp: boolean = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  searchQuery: string = "";
  clinicId: number;
  clinicData: any;
  departData: any;
  clinicDoctors: any;
  docAvailable: boolean = true;
  clinId: number;

  displayedColumns: string[] = [
    "doctor_id",
    "doctor_name",
    "qualification",
    "doctor_phone",
    "consultation_time",
    "consultation_charge",
    // "description",
    "department_name",
    "status",
    // "entity_name",
    // "actions",
  ];

  ngOnInit() {
    this.clinId = parseInt(localStorage.getItem("clinicId"));
    if (this.clinId) {
      this.getClinicDetails(this.clinId);
      this.getClinicDoctors(this.clinId, "");
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.getClinicDoctors(this.clinId, "");
  }

  onBack() {
    // this.router.navigate(["clinic-list"]);
    this.location.back();
  }

  addDoc() {
    this.router.navigate(["create-doctor"]);
    localStorage.setItem("source", "clinic");
  }

  redirectToDoctorDetails(id: number) {
    localStorage.setItem("docId", id.toString());
    this.router.navigate(["doctor-details"]);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.getClinicDoctors(
        this.clinId,
        (event.target as HTMLInputElement).value
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
          this.clinicData = response.data.entityResponse;
          this.departData = response.data.departmentList;
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

  getClinicDoctors(clinic: number, query: string) {
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    const payload = {
      entityId: clinic,
      searchQuery: query ? query : "",
      limit: pageSize,
      page: pageIndex + 1,
    };
    this.service.post(payload, "/api/v1/admin/list-doctor-by-clinic").subscribe(
      (response) => {
        console.log("list-doctor-by-clinic Res==>", response.data.response);

        if (response.statusCode == "200") {
          if (response.data.response.length == 0) {
            this.docAvailable = false;
          }
          if (this.Tcount === 0) {
            this.Tcount = response.data.totalCount;
          } else if (
            this.Tcount !== 0 &&
            this.Tcount !== response.data.totalCount
          ) {
            this.Tcount = response.data.totalCount;
          }
          this.clinicDoctors = response.data.response;
          this.dataSource.data = response.data.response;
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

  handleStatusChange(id: number, statusUpdate: number) {
    let payload = {
      doctorId: id,
      entityId: this.clinId,
      updatedData: {
        newStatus: statusUpdate,
      },
    };
    this.service.post(payload, "/api/v1/admin/update-doctor").subscribe(
      (response) => {
        console.log("EntityList Res==>", response);

        if (response.statusCode == "200") {
          this.toast.success(response.message);
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
}
