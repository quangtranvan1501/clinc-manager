import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoucherComponent } from './list-voucher.component';

describe('ListVoucherComponent', () => {
  let component: ListVoucherComponent;
  let fixture: ComponentFixture<ListVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListVoucherComponent]
    });
    fixture = TestBed.createComponent(ListVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
