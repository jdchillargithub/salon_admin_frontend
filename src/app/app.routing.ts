import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule, Router } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redirect to 'auth' route
    pathMatch: 'full',
  },
  {
    path: '', // Route for AuthLayoutComponent
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: '', // Route for AdminLayoutComponent
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x => x.AdminLayoutModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login' // Redirect to 'auth/login' route if URL doesn't match any defined routes
  }
];


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.checkTokenAndRedirect();
  }

  private checkTokenAndRedirect(): void {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const isAdminLayout = this.router.config.find(route => {
      return route.component === AdminLayoutComponent;
    });

    if (!accessToken && isAdminLayout) {
      this.router.navigate(['/login']);
    }
  }
}