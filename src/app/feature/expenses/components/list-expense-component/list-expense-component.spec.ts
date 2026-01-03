import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExpenseComponent } from './list-expense-component';

describe('ListExpenseComponent', () => {
  let component: ListExpenseComponent;
  let fixture: ComponentFixture<ListExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListExpenseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
