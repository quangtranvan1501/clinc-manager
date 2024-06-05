import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSheduleComponent } from './create-shedule.component';

describe('CreateSheduleComponent', () => {
  let component: CreateSheduleComponent;
  let fixture: ComponentFixture<CreateSheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSheduleComponent]
    });
    fixture = TestBed.createComponent(CreateSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
