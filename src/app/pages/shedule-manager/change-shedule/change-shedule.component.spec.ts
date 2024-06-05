import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSheduleComponent } from './change-shedule.component';

describe('ChangeSheduleComponent', () => {
  let component: ChangeSheduleComponent;
  let fixture: ComponentFixture<ChangeSheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeSheduleComponent]
    });
    fixture = TestBed.createComponent(ChangeSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
