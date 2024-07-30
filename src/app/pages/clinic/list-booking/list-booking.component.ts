import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { HotToastService } from "@ngneat/hot-toast";
import { AuthService } from "../../../services/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-list-booking",
  templateUrl: "./list-booking.component.html",
  styleUrls: ["./list-booking.component.css"],
})
export class ListBookingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    "slno",
    "bookingId",
    "timeSlot",
    "doctorName",
    "customerName",
    "customerPhone",
    "bookingStatus",
  ];
  Tcount: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  pageSizeOptions: number[] = [5, 10, 20];
  bookingList: any;
  selectedDate: string = "";
  dateIndicator: boolean = false;
  bookingsEmpty: boolean;
  isCompletedStatus: boolean = false;
  initialDoctorsList: string[] = [];

  constructor(private service: AuthService, private toast: HotToastService) {}

  ngOnInit() {
    const today = new Date();
    this.selectedDate = this.formatDate(today);
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
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
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
    let apiUrl = `/api/v1/clinic/list-booking`;
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
        console.log("ListBookingRES==>", response);
        if (response.statusCode == "200") {
          if (response.data.bookingList.length == 0) {
            this.bookingsEmpty = true;
          } else {
            this.bookingsEmpty = false;

            this.bookingList = response.data.bookingList.map(
              (booking, index) => ({
                ...booking,
                slno: index + 1,
              })
            );
            this.initialDoctorsList = Array.from(
              new Set(this.bookingList.map((booking) => booking.doctorName))
            );
            console.log("LIST==>", this.bookingList);
            if (this.Tcount === 0) {
              this.Tcount = response.data.totalCount;
            } else if (
              this.Tcount !== 0 &&
              this.Tcount !== response.data.totalCount
            ) {
              this.Tcount = response.data.totalCount;
            }
            // this.Tcount = response.data.bookingList.length;
            console.log("TCount==>", this.Tcount);

            this.dataSource.data = this.bookingList;
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

  onSelectChange(status: any, bookId: any) {
    if (status === "1") {
      this.isCompletedStatus = true;
      this.service
        .post({ bookingId: bookId }, "/api/v1/booking/updateBooking")
        .subscribe(
          (response: any) => {
            console.log("updateBookingRES==>", response);
            if (response.statusCode == "200") {
              this.toast.success("Booking status updated");
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
  }

  filterByDoctor(doctorName: string) {
    if (!doctorName || doctorName === "View All") {
      this.dataSource.data = this.bookingList;
      return;
    }
    const filteredData = this.bookingList.filter(
      (booking) => booking.doctorName === doctorName
    );
    this.dataSource.data = filteredData;
  }

  // fetchInitialDoctorsList() {

  //   return this.initialDoctorsList;
  // }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
