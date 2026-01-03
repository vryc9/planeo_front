import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseItemsComponent } from './expense-items-component';

describe('ExpenseItemsComponent', () => {
  let component: ExpenseItemsComponent;
  let fixture: ComponentFixture<ExpenseItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseItemsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
