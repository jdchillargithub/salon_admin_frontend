import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { DoctorsComponent } from "../../pages/doctor/doctor.component";
import { CreateDoctorComponent } from "../../pages/doctor/CreateDoctor/create-doctor.component";
import { AddBankComponent } from "../../pages/doctor/CreateDoctor/AddbankDetails/add-bank.component";
import { ListBookingComponent } from "../../pages/clinic/list-booking/list-booking.component";
import { ClinicListComponent } from "../../pages/clinic/clinic-list/clinic-list.component";
import { AddClinicComponent } from "../../pages/clinic/add-clinic/add-clinic.component";
import { ClinicDetailsComponent } from "../../pages/clinic/clinic-details/clinic-details.component";
import { DepartmentListComponent } from "../../pages/departments/department-list/department-list.component";
import { AddDepartmentComponent } from "../../pages/departments/add-department/add-department.component";
import { BookingReportComponent } from "../../pages/clinic/booking-report/booking-report.component";
import { BookingReportAdminComponent } from "../../pages/booking/booking-report-admin/booking-report-admin.component";
import { DoctorDetailsComponent } from "../../pages/doctor/doctor-details/doctor-details.component";
import { EditDoctorComponent } from "../../pages/doctor/edit-doctor/edit-doctor.component";
import { componentResolver } from "../../services/dataResolver";
import { TimeSlotComponent } from "../../pages/time-slot/time-slot.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "doctors", component: DoctorsComponent },
  { path: "create-doctor", component: CreateDoctorComponent },
  { path: "add-bank", component: AddBankComponent },
  { path: "typography", component: TypographyComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "upgrade", component: UpgradeComponent },
  { path: "admin-dashboard", component: DashboardComponent },
  { path: "booking-list", component: ListBookingComponent },
  { path: "booking-reports", component: BookingReportComponent },
  { path: "clinic-list", component: ClinicListComponent },
  { path: "create-clinic", component: AddClinicComponent },
  { path: "edit-clinic", component: AddClinicComponent },
  { path: "clinic-details", component: ClinicDetailsComponent },
  { path: "list-department", component: DepartmentListComponent },
  { path: "add-department", component: AddDepartmentComponent },
  { path: "edit-department", component: AddDepartmentComponent },
  { path: "booking-reports-admin", component: BookingReportAdminComponent },
  { path: "doctor-details", component: DoctorDetailsComponent },
  { path: "time-slot", component: TimeSlotComponent },
  {
    path: "doctor-edit",
    component: EditDoctorComponent,
    resolve: { departments: componentResolver },
  },
];
