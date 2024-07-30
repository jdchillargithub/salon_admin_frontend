import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { ClinicLoginComponent } from '../../pages/clinic-login/clinic-login.component';


export const AuthLayoutRoutes: Routes = [
    { path: 'login',      component: LoginComponent },
    { path: 'clinic-login',      component: ClinicLoginComponent },
   
];
