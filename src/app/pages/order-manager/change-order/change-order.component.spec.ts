import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOrderComponent } from './change-order.component';

describe('ChangeOrderComponent', () => {
  let component: ChangeOrderComponent;
  let fixture: ComponentFixture<ChangeOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeOrderComponent]
    });
    fixture = TestBed.createComponent(ChangeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
