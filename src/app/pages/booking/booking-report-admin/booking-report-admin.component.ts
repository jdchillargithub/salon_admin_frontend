import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HotToastService } from "@ngneat/hot-toast";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-booking-report-admin",
  templateUrl: "./booking-report-admin.component.html",
  styleUrls: ["./booking-report-admin.component.css"],
})
export class BookingReportAdminComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    // "slno",
    "bookingId",
    "appointmentDate",
    "patientName",
    "bookedPhoneNo",
    "doctorName",
    "orderId",
    // "bookingStatus",
  ];

  Tcount: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  pageSizeOptions: number[] = [5, 10, 20];
  bookingReport: any;
  selectedStartDate: string = "";
  selectedEndDate: string = "";
  dateIndicator: boolean = false;
  isResp: boolean = false;
  bookingsEmpty: boolean = false;
  reportType: number = 0;

  constructor(private service: AuthService, private toast: HotToastService) {}

  ngOnInit() {
    const today = new Date();
    this.selectedStartDate = this.formatDate(today);
    this.selectedEndDate = this.formatDate(today);
    this.getReport("");
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.getReport((event.target as HTMLInputElement).value);
    }
  }

  getReport(query: string) {
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    let apiUrl = `/api/v1/admin/booking-report`;
    let queryParams = `?limit=${pageSize}&page=${pageIndex + 1}`;
    apiUrl += queryParams;
    this.service
      .post(
        {
          startDate: this.selectedStartDate,
          endDate: this.selectedEndDate,
          reportStatus: this.reportType,
          searchQuery: query,
        },
        apiUrl
      )
      .subscribe(
        (response: any) => {
          console.log("Bookingreport RES==>", response);
          if (response.statusCode == "200") {
            this.isResp = true;
            if (response.data.bookingReport.length == 0) {
              this.bookingsEmpty = true;
            } else {
              this.bookingsEmpty = false;

              this.bookingReport = response.data.bookingReport.map(
                (booking, index) => ({
                  ...booking,
                  slno: index + 1,
                })
              );
              console.log("LIST==>", this.bookingReport);
              if (this.Tcount === 0) {
                this.Tcount = response.data.totalCount;
              } else if (
                this.Tcount !== 0 &&
                this.Tcount !== response.data.totalCount
              ) {
                this.Tcount = response.data.totalCount;
              }
              // this.Tcount = response.data.bookingReport.length;
              console.log("TCount==>", this.Tcount);

              this.dataSource.data = this.bookingReport;
            }
          } else if (response.statusCode == "500") {
            this.toast.error(response.message);
          }
        },
        (error) => {
          console.error("API call failed:", error);
          this.toast.error(error);
        }
      );
  }

  setType(type: number) {
    this.reportType = type;
    this.getReport("");
  }

  validateToLettersAndNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[A-Za-z0-9]*$/;

    if (!pattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
      input.dispatchEvent(new Event("input"));
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.getReport("");
  }
}
