import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheduleDoctorComponent } from './shedule-doctor.component';

describe('SheduleDoctorComponent', () => {
  let component: SheduleDoctorComponent;
  let fixture: ComponentFixture<SheduleDoctorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SheduleDoctorComponent]
    });
    fixture = TestBed.createComponent(SheduleDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
