import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocRegStepOne {
  private storageKey = 'docRegStepOne';

  get docRegStepOne(): any {
    const storedValue = localStorage.getItem(this.storageKey);
    return storedValue !== null ? JSON.parse(storedValue) : {}; // Provide a default value
  }

  set docRegStepOne(value: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(value));
  }

  cleardocRegStepOne() {
    localStorage.removeItem(this.storageKey);
  }

  constructor() { }
}
