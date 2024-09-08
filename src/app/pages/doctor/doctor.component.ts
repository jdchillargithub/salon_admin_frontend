import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../../services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { Router } from "@angular/router";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";

// export interface PeriodicElement {
//   ID: number;
//   doctor_id: number;
//   doctor_name: string;
//   doctor_phone: string;
//   entity_name: string;
//   department_name: string;
// }

@Component({
  selector: "app-doctors",
  templateUrl: "./doctor.component.html",
  styleUrls: ["./doctor.component.scss"],
})
export class DoctorsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  faEye = faEye;
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faCalendarDay = faCalendarDay;

  displayedColumns: string[] = [
    "doctorId",
    "doctorName",
    "doctorPhone",
    "entityName",
    "department",
    "status",
    "actions",
  ];

  dataSource = new MatTableDataSource<any>();

  Tcount: number = 0;
  isResp: boolean = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20]; // Define pageSizeOptions here

  constructor(
    private service: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getDoctors("");
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {}

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.getDoctors((event.target as HTMLInputElement).value);
    }
  }

  docView(id: number, entity: number) {
    localStorage.setItem("docId", id.toString());
    localStorage.setItem("source", "doctorList");
    localStorage.setItem("clinicId", entity.toString());
    this.router.navigate(["doctor-details"]);
  }

  timeSlotDirect(id: number, entity: number) {
    localStorage.setItem("docId", id.toString());
    localStorage.setItem("clinicId", entity.toString());
    this.router.navigate(["time-slot"]);
  }

  validateToLettersAndNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  handleStatusChange(docId: number, clinic: number, statusUpdate: number) {
    let formData = new FormData();
    formData.append("newStatus", statusUpdate.toString());
    formData.append("entityId", clinic.toString());
    formData.append("doctorId", docId.toString());

    // let payload = {
    //   doctorId: id,
    //   entityId: clinic,
    //   updatedData: {
    //     newStatus: statusUpdate,
    //   },
    // };
    this.service.post(formData, "/api/v1/admin/update-doctor").subscribe(
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

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.getDoctors("");
  }
  
  getDoctors(query: string) {
    let apiUrl = `/api/v1/admin/list-doctors`;
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    let queryParams = `?limit=${pageSize}&page=${pageIndex + 1}`;
    apiUrl += queryParams;
    this.service.post({ searchQuery: query }, apiUrl).subscribe(
      (response) => {
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
          this.dataSource.data = response.data.doctorList;
        } else if (response.statusCode === "500") {
          this.toast.error(response.servicesList);
        }
      },
      (error) => {
        console.error("API call failed:", error);
        this.toast.error(error);
      }
    );
  }

  addDoc() {
    this.router.navigate(["create-doctor"]);
  }
  editDoc(id: number, clinic: number) {
    localStorage.setItem("docId", id.toString());
    localStorage.setItem("clinicId", clinic.toString());
    this.router.navigate(["doctor-edit"]);
  }
}
