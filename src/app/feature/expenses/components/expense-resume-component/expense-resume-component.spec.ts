import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseResumeComponent } from './expense-resume-component';

describe('ExpenseResumeComponent', () => {
  let component: ExpenseResumeComponent;
  let fixture: ComponentFixture<ExpenseResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseResumeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
