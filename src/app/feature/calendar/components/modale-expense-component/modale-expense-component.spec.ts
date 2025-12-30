import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleExpenseComponent } from './modale-expense-component';

describe('ModaleExpenseComponent', () => {
  let component: ModaleExpenseComponent;
  let fixture: ComponentFixture<ModaleExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaleExpenseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
