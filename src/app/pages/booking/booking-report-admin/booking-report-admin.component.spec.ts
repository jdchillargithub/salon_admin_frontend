import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingReportAdminComponent } from './booking-report-admin.component';

describe('BookingReportAdminComponent', () => {
  let component: BookingReportAdminComponent;
  let fixture: ComponentFixture<BookingReportAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingReportAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingReportAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
