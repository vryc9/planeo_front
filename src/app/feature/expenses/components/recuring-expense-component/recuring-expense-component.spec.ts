import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuringExpenseComponent } from './recuring-expense-component';

describe('RecuringExpenseComponent', () => {
  let component: RecuringExpenseComponent;
  let fixture: ComponentFixture<RecuringExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuringExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuringExpenseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
