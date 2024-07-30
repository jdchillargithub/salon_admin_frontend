import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { HotToastService } from "@ngneat/hot-toast";
import { AuthService } from "../../../services/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-booking-report",
  templateUrl: "./booking-report.component.html",
  styleUrls: ["./booking-report.component.css"],
})
export class BookingReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    "slno",
    "bookingId",
    "amount",
    "appointmentDate",
    "doctorName",
    "customerName",
    "customerPhone",
    "bookingStatus",
  ];

  Tcount: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  pageSizeOptions: number[] = [5, 10, 20];
  bookingReport: any;
  selectedDate: string = "";
  dateIndicator: boolean = false;
  bookingsEmpty: boolean;
  initialDoctorsList: string[] = [];

  constructor(private service: AuthService, private toast: HotToastService) {}

  ngOnInit() {
    this.selectedDate = this.formatDate(new Date());
    this.getBooking();
    if (!this.selectedDate) {
      this.dateIndicator = false;
      return;
    } else {
      this.dateIndicator = true;
      return;
    }
  }

  formatDate(date: Date): string {
    const pad = (num: number) => (num < 10 ? '0' + num : num.toString());
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  }

  getBooking(docId?: string) {
    if (docId) {
      console.log("DOC==>", docId);
    }

    this.dateIndicator = true;
    const entity = localStorage.getItem("clinicId");
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    let apiUrl = `/api/v1/clinic/booking-report`;
    let queryParams = `?date=${this.selectedDate}&limit=${pageSize}&page=${
      pageIndex + 1
    }&entityId=${entity}`;

    if (docId) {
      queryParams += `&doctorId=${docId}`;
    }

    apiUrl += queryParams;
    console.log("APIURL==>", apiUrl);

    this.service.post({}, apiUrl).subscribe(
      (response: any) => {
        console.log("BookingReportsResponse==>", response);
        if (response.statusCode == "200") {
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
            this.initialDoctorsList = Array.from(
              new Set(this.bookingReport.map((booking) => booking.doctorName))
            );
            const statusMap = {
              0: "Booked",
              1: "Completed",
              2: "Cancelled",
              3: "Processing",
            };

            this.bookingReport = response.data.bookingReport.map(
              (booking, index) => ({
                ...booking,
                slno: index + 1,
                bookingStatusString:
                  statusMap[booking.bookingStatus] || "Unknown",
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
            console.log("FINAL==>", this.dataSource.data);
          }
        } else if (response.statusCode == "500") {
          this.toast.error(response.servicesList);
        }
      },
      (error) => {
        console.error("API call failed:", error);
        this.toast.error(error);
      }
    );
  }

  onSelectChange(booking: any) {
    // Implement your logic when a booking status is changed
    console.log("Booking status changed:", booking.bookingStatus);
  }

  filterByDoctor(doctorName: string) {
    if (!doctorName || doctorName === "View All") {
      // If no doctor is selected or "View All" is selected, reset the filter and show all data
      this.dataSource.data = this.bookingReport;
      return;
    }
    // Filter the dataSource data based on the selected doctor's name
    const filteredData = this.bookingReport.filter(
      (booking) => booking.doctorName === doctorName
    );
    this.dataSource.data = filteredData;
  }

  // fetchInitialDoctorsList() {
  //   if (this.initialDoctorsList.length === 0) {
  //     // Fetch the list of doctors only if it's not already fetched

  //   }
  //   return this.initialDoctorsList;
  // }

  onPageChange(event: any) {
    console.log("pageEVENT=>", event);
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.getBooking();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
