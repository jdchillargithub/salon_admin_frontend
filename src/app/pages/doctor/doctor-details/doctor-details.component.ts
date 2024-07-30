import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-doctor-details",
  templateUrl: "./doctor-details.component.html",
  styleUrls: ["./doctor-details.component.css"],
})
export class DoctorDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: AuthService,
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.clinId = parseInt(localStorage.getItem("clinicId"));
    this.docId = parseInt(localStorage.getItem("docId"));
    this.source = localStorage.getItem("source");
  }

  dataSource = new MatTableDataSource<any>();
  Tcount: number = 0;
  source: string;
  isResp: boolean = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  searchQuery: string = "";
  docData: any;
  clinId: any;
  docId: any;
  bookingAvailable: boolean = false;
  isFromDoc: boolean = false;
  selection = new SelectionModel<any>(true, []);

  displayedColumns: string[] = [
    "select",
    "bookingId",
    "timeSlot",
    "customerName",
    "customerPhone",
    // "bookingStatus",
  ];

  ngOnInit(): void {
    this.getDoctorData(this.docId);
    this.getBookings("");
    const source = localStorage.getItem("source");
    if (source == "doctorList") {
      this.isFromDoc = true;
    }
  }

  // Check if all rows are selected
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Select or deselect all rows
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  // Mark selected rows (implementation depends on your requirement)
  markSelected() {
    const selectedBookings = this.selection.selected;
    const bookingIds = selectedBookings.map((booking) => booking.bookingId);
    this.service
      .post({ bookingIds }, "/api/v1/booking/booking-cancel-doctor")
      .subscribe(
        (response) => {
          if (response.statusCode == "200") {
            this.toast.success(response.message);
          } else {
            this.toast.error(response.message);
          }
        },
        (error) => {
          console.error("API call failed:", error);
          this.toast.error("Failed to delete booking.");
        }
      );
  }

  ngOnDestroy() {
    localStorage.setItem("source", "");
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    // this.getDoctorData(this.docId);
    this.getBookings("");
  }

  goToEdit() {
    localStorage.setItem("source", "clinic");
    this.router.navigate(["doctor-edit"]);
  }

  getDoctorData(id: number) {
    this.service
      .post({ doctorId: id }, "/api/v1/admin/find-doctor-by-id")
      .subscribe(
        (response) => {
          if (response.statusCode == "200") {
            this.docData = response.data.doctorData;
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

  getBookings(query: string) {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    let apiUrl = "/api/v1/admin/list-booking";
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    let queryParams = `?businessType=1&limit=${pageSize}&page=${pageIndex + 1}`;
    apiUrl += queryParams;
    this.service
      .post(
        {
          doctorId: this.docId,
          date: formattedDate,
          // date: "2024-06-24",
          entityId: this.clinId,
          searchQuery: query,
        },
        apiUrl
      )
      .subscribe(
        (response) => {
          if (response.statusCode == "200") {
            if (response.data.appointmentList.length !== 0) {
              if (this.Tcount === 0) {
                this.Tcount = response.data.totalCount;
              } else if (
                this.Tcount !== 0 &&
                this.Tcount !== response.data.totalCount
              ) {
                this.Tcount = response.data.totalCount;
              }
              console.log("TCount==>", response.data.totalCount);
              this.dataSource.data = response.data.appointmentList;
              this.bookingAvailable = true;
            }
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
      this.getBookings((event.target as HTMLInputElement).value);
    }
  }

  onBack() {
    this.location.back();
  }
}
