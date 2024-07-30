import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../../../services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { Router } from "@angular/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCoffee,
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-clinic-list",
  templateUrl: "./clinic-list.component.html",
  styleUrls: ["./clinic-list.component.css"],
})
export class ClinicListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  faCoffee = faCoffee;
  faEye = faEye;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  displayedColumns: string[] = [
    "entity_id",
    "entity_name",
    "phone",
    "streetName",
    "email",
    "status",
    "actions",
  ];
  dataSource = new MatTableDataSource<any>();
  Tcount: number = 0;
  isResp: boolean = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  searchQuery: string = "";
  filteredClinics: any[] = [];

  constructor(
    private service: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getClinics("");
  }

  ngOnDestroy() {}

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.getClinics((event.target as HTMLInputElement).value);
    }
  }
  

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.getClinics("");
  }

  getClinics(search: string) {
    let apiUrl = `/api/v1/admin/list-clinic`;
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    let queryParams = `?businessType=1&limit=${pageSize}&page=${pageIndex + 1}`;
    if (search) {
      queryParams += `&searchQuery=${search}`;
    }
    apiUrl += queryParams;
    this.service.post({}, apiUrl).subscribe(
      (response) => {
        console.log("EntityList Res==>", response.data.data);

        if (response.statusCode == "200") {
          this.isResp = true;
          if (this.Tcount === 0) {
            this.Tcount = response.data.totalCount;
          } else if (
            this.Tcount !== 0 &&
            this.Tcount !== response.data.totalCount
          ) {
            this.Tcount = response.data.totalCount;
          }
          console.log("TCount==>", response.data.totalCount);
          this.dataSource.data = response.data.data;
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

  handleStatusChange(id: number, status: number) {
    let payload = {
      clinicId: id,
      newStatus: status,
    };
    this.service.post(payload, "/api/v1/admin/update-clinic-status").subscribe(
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

  validateToLettersAndNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  editClinic(id:number) {
    this.router.navigate(["edit-clinic"]);
    localStorage.setItem("clinicId", id.toString());
  }

  deleteClinic() {}

  addClinic() {
    this.router.navigate(["create-clinic"]);
  }

  redirectToClinicDetails(clinicId: number) {
    localStorage.setItem("clinicId", clinicId.toString());
    this.router.navigate(["clinic-details"]);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageIndex = this.pageIndex;
    }
  }
}
