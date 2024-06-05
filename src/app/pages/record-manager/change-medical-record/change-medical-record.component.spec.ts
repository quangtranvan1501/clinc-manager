import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMedicalRecordComponent } from './change-medical-record.component';

describe('ChangeMedicalRecordComponent', () => {
  let component: ChangeMedicalRecordComponent;
  let fixture: ComponentFixture<ChangeMedicalRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeMedicalRecordComponent]
    });
    fixture = TestBed.createComponent(ChangeMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
