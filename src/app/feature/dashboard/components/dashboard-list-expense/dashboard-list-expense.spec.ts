import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardListExpense } from './dashboard-list-expense';

describe('DashboardListExpense', () => {
  let component: DashboardListExpense;
  let fixture: ComponentFixture<DashboardListExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardListExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardListExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
