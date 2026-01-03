import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeExpenseCard } from './resume-expense-card';

describe('ResumeExpenseCard', () => {
  let component: ResumeExpenseCard;
  let fixture: ComponentFixture<ResumeExpenseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeExpenseCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeExpenseCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
