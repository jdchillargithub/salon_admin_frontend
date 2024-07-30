import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { componentService } from './componentService';

@Injectable({
  providedIn: 'root'
})
export class componentResolver implements Resolve<any> {

  constructor(private componentService: componentService) {}

  resolve() {
    return this.componentService.getDepartments();
  }
}
