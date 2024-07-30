import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HotToastService } from "@ngneat/hot-toast";
import Chart from "chart.js";
import { AuthService } from "../services/auth.service";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  Gdata: any;
  bookingData: any;

  faFileInvoice = faFileInvoice;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false, // Remove x-axis grid lines
          },
          ticks: {
            fontColor: "white", // Change x-axis label color to white
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false, // Remove y-axis grid lines
          },
          ticks: {
            fontColor: "white", // Change y-axis label color to white
          },
        },
      ],
    },
    legend: {
      labels: {
        fontColor: "white", // Change legend text color to white
      },
    },
  };
  public lineChartColors: Color[] = [
    {
      borderColor: "white",
      backgroundColor: "white",
      borderWidth: 1,
      pointBackgroundColor: "black",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];

  constructor(
    private service: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.graphData();
    this.getBookingCount();
  }

  graphData() {
    this.service.post({}, "/api/v1/admin/graph-data").subscribe(
      (response) => {
        console.log("Graph-data Res==>", response.data.graphData);
        if (response.statusCode == "200") {
          this.Gdata = response.data.graphData;
          this.prepareChartData();
        } else {
          this.toast.error(response.message);
        }
      },
      (error) => {
        console.error("API call failed:", error);
        this.toast.error("Failed to fetch graph data.");
      }
    );
  }

  getBookingCount() {
    this.service.post({}, "/api/v1/admin/total-booking").subscribe(
      (response) => {
        console.log("Total-booking Res==>", response.data);
        if (response.statusCode == "200") {
          this.bookingData = response.data;
        } else {
          this.toast.error(response.message);
        }
      },
      (error) => {
        console.error("API call failed:", error);
        this.toast.error("Failed to fetch  data.");
      }
    );
  }

  prepareChartData() {
    this.lineChartLabels = this.Gdata.map((data) => data.date);
    const counts = this.Gdata.map((data) => data.count);
    this.lineChartData = [{ data: counts, label: "Count" }];
  }
}
