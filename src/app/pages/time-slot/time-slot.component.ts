import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { HotToastService } from "@ngneat/hot-toast";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-time-slot",
  templateUrl: "./time-slot.component.html",
  styleUrls: ["./time-slot.component.css"],
})
export class TimeSlotComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  daysOfWeek: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  selectedDay: string = this.daysOfWeek[0];
  selectedSession: string = "Morning";
  doc_id: string = "";
  entity_id: string = "";
  startTime: string = "";
  endTime: string = "";
  isResp: boolean = false;
  isNoSlot: boolean = false;
  Tcount: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = [
    "Sl.No",
    "day",
    "startTime",
    "endTime",
    "session",
  ];
  dataSource = new MatTableDataSource<any>();

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private service: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {
    this.doc_id = localStorage.getItem("docId");
    this.entity_id = localStorage.getItem("clinicId");
  }

  ngOnInit() {
    this.listWorkSchedule("");
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.listWorkSchedule("");
  }

  listWorkSchedule(query: string) {
    let apiUrl = `/api/v1/work/list-work-schedule`;
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    let queryParams = `?limit=${pageSize}&page=${pageIndex + 1}`;
    apiUrl += queryParams;
    const payload = {
      search: query,
      doctorId: this.doc_id,
      entityId: this.entity_id,
    };
    this.service.post(payload, apiUrl).subscribe(
      (response) => {
        if (response.statusCode == 200) {
          if (response.data.workScheduleList?.length !== 0) {
            this.isResp = true;
          } else {
            this.isNoSlot = true;
          }
          if (this.Tcount === 0) {
            this.Tcount = response.data.totalCount;
          } else if (
            this.Tcount !== 0 &&
            this.Tcount !== response.data.totalCount
          ) {
            this.Tcount = response.data.totalCount;
          }
          this.dataSource.data = response.data.workScheduleList;
        } else if (response.statusCode === 400) {
          console.log(response.message);
          this.toast.error(response.message);
        } else {
          this.toast.error(response.message);
        }
      },
      (error) => {
        console.error("List-work-schedule ERROR::", error);
      }
    );
  }

  addWorkSchedule() {
    let apiUrl = `/api/v1/work/create-work-schedule-admin`;
    const payload = {
      day: this.selectedDay,
      startTime: this.startTime,
      endTime: this.endTime,
      session: this.selectedSession,
      doctor_id: this.doc_id,
      entityId: this.entity_id,
    };
    console.log({ payload });

    this.service.post(payload, apiUrl).subscribe(
      (response) => {
        if (response.statusCode == 200) {
          this.toast.success(response.message);
          this.listWorkSchedule("");
        } else if (response.statusCode == 400) {
          console.log(response.message);
          this.toast.error(response.message);
        } else {
          this.toast.error(response.message);
        }
      },
      (error) => {
        console.error("List-work-schedule ERROR::", error);
      }
    );
  }
}
