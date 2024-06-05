import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSheduleComponent } from './list-shedule.component';

describe('ListSheduleComponent', () => {
  let component: ListSheduleComponent;
  let fixture: ComponentFixture<ListSheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSheduleComponent]
    });
    fixture = TestBed.createComponent(ListSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
