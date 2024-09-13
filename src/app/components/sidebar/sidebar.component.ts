import { Component, OnInit, OnDestroy } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[];
}
export let ROUTES: RouteInfo[];

const ADMIN_ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "design_app", class: "" },
  // { path: '/icons', title: 'User Profile',  icon:'users_circle-08', class: '' },
  {
    path: "/doctors",
    title: "Stylists",
    icon: "design_bullet-list-67",
    class: "",
  },
  {
    path: "/clinic-list",
    title: "Salons",
    icon: "design_bullet-list-67",
    class: "",
  },
  {
    path: "/list-department",
    title: "Departments",
    icon: "design_bullet-list-67",
    class: "",
  },
  {
    path: "/booking-reports-admin",
    title: "Booking Report",
    icon: "design_bullet-list-67",
    class: "",
  },
  // { path: '/notifications', title: 'Departments',  icon:'business_bank', class: '' },
  // { path: '/user-profile', title: 'Customer',  icon:'users_single-02', class: '' },
  // { path: '/table-list', title: 'Report',  icon:'design_bullet-list-67', class: '' },
];

const CLINIC_ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "design_app", class: "" },
  {
    path: "/booking-list",
    title: "Booking List",
    icon: "design_bullet-list-67",
    class: "",
  },
  {
    path: "/booking-reports",
    title: "Booking Report",
    icon: "files_paper",
    class: "",
  },
];

const CHILD_ROUTES: RouteInfo[] = [
  {
    path: "/success-booking",
    title: "Success Booking",
    icon: "design_bullet-list-67",
    class: "submenu",
  },
  {
    path: "/consulted-booking",
    title: "Consulted Booking",
    icon: "design_bullet-list-67",
    class: "submenu",
  },
  {
    path: "/non-consulted-booking",
    title: "Non Consulted Booking",
    icon: "design_bullet-list-67",
    class: "submenu",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: RouteInfo[];
  clinicName: string;

  constructor() {}

  ngOnInit() {
    const userType = localStorage.getItem("userType");
    this.clinicName = localStorage.getItem("clinicName");

    if (userType == "3") {
      ROUTES = CLINIC_ROUTES;
    } else if (userType == "0") {
      ROUTES = ADMIN_ROUTES;
    }
    this.menuItems = ROUTES;
  }

  ngOnDestroy() {}
 
 
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
