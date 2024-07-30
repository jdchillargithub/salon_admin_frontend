import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { AuthService } from "../../../services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { Router } from "@angular/router";
import {
  faCoffee,
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.css"],
})
export class DepartmentListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  faEye = faEye;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = ["department_id", "department_name", "actions"];

  isResp: boolean = false;
  Tcount: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  searchQuery: string = "";
  fileteredDepartments: any[] = [];

  constructor(
    private service: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getDepartMent("");
  }

  addDepartment() {
    this.router.navigate(["add-department"]);
  }

  getDepartMent(search: string) {
    let apiUrl = `/api/v1/admin/list-departments`;
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    let queryParams = `?limit=${pageSize}&page=${pageIndex + 1}`;

    apiUrl += queryParams;
    this.service.post({ searchQuery: search }, apiUrl).subscribe(
      (response) => {
        if (response.statusCode == "200") {
          console.log("list-departments Res==>", response.data.data);

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
          console.log("DATA==>", this.dataSource.data);
          console.log("isResp==>", this.isResp);
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

  deleteConfirm(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete department!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, I'm sure!",
      cancelButtonText: "No, cancel",
      focusCancel: true,
      cancelButtonColor: "green",
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteDepartment(id);
      }
      //  else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire("Cancelled", "You are still here :)", "error");
      // }
    });
  }

  validateToLettersAndNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
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

  deleteDepartment(id: number) {
    const payload = {
      department_id: id,
      status: 0,
    };
    this.service.post(payload, "/api/v1/admin/update-dept").subscribe(
      (response) => {
        if (response.statusCode == "200") {
          this.toast.success("Department deleted successfully");
          window.location.reload();
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

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.getDepartMent((event.target as HTMLInputElement).value);
    }
  }

  editDepartment(id: number) {
    this.router.navigate(["edit-department"]);
    localStorage.setItem("departId", id.toString());
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.getDepartMent("");
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
