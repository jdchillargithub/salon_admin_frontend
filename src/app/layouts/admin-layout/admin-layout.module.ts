import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { ChartsModule } from "ng2-charts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { DoctorsComponent } from "../../pages/doctor/doctor.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CreateDoctorComponent } from "../../pages/doctor/CreateDoctor/create-doctor.component";
import { MatRadioModule } from "@angular/material/radio";
import { AddBankComponent } from "../../pages/doctor/CreateDoctor/AddbankDetails/add-bank.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ListBookingComponent } from "../../pages/clinic/list-booking/list-booking.component";
import { MatChipsModule } from "@angular/material/chips";
import { ClinicListComponent } from "../../pages/clinic/clinic-list/clinic-list.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AddClinicComponent } from "../../pages/clinic/add-clinic/add-clinic.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ClinicDetailsComponent } from "../../pages/clinic/clinic-details/clinic-details.component";
import { DepartmentListComponent } from "../../pages/departments/department-list/department-list.component";
import { AddDepartmentComponent } from "../../pages/departments/add-department/add-department.component";
import { BookingReportComponent } from "../../pages/clinic/booking-report/booking-report.component";
import { BookingReportAdminComponent } from "../../pages/booking/booking-report-admin/booking-report-admin.component";
import { DoctorDetailsComponent } from "../../pages/doctor/doctor-details/doctor-details.component";
import { EditDoctorComponent } from "../../pages/doctor/edit-doctor/edit-doctor.component";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TimeSlotComponent } from "../../pages/time-slot/time-slot.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    MatRadioModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgbModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
    MatCheckboxModule
  ],
  declarations: [
    DashboardComponent,
    DoctorsComponent,
    CreateDoctorComponent,
    AddBankComponent,
    UserProfileComponent,
    TableListComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    ListBookingComponent,
    BookingReportComponent,
    ClinicListComponent,
    AddClinicComponent,
    ClinicDetailsComponent,
    DepartmentListComponent,
    AddDepartmentComponent,
    BookingReportAdminComponent,
    DoctorDetailsComponent,
    EditDoctorComponent,
    TimeSlotComponent
  ],
})
export class AdminLayoutModule {}
