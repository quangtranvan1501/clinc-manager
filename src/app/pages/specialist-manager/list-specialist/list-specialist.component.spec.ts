import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpecialistComponent } from './list-specialist.component';

describe('ListSpecialistComponent', () => {
  let component: ListSpecialistComponent;
  let fixture: ComponentFixture<ListSpecialistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSpecialistComponent]
    });
    fixture = TestBed.createComponent(ListSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
