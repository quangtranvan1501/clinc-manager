import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedicalRecordComponent } from './list-medical-record.component';

describe('ListMedicalRecordComponent', () => {
  let component: ListMedicalRecordComponent;
  let fixture: ComponentFixture<ListMedicalRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListMedicalRecordComponent]
    });
    fixture = TestBed.createComponent(ListMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
