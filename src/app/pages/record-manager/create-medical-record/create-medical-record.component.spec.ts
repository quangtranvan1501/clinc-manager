import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicalRecordComponent } from './create-medical-record.component';

describe('CreateMedicalRecordComponent', () => {
  let component: CreateMedicalRecordComponent;
  let fixture: ComponentFixture<CreateMedicalRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMedicalRecordComponent]
    });
    fixture = TestBed.createComponent(CreateMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
