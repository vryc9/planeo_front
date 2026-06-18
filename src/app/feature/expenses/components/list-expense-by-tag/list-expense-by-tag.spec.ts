import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExpenseByTag } from './list-expense-by-tag';

describe('ListExpenseByTag', () => {
  let component: ListExpenseByTag;
  let fixture: ComponentFixture<ListExpenseByTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListExpenseByTag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListExpenseByTag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
