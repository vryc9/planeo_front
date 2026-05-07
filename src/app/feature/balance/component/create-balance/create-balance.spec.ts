import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBalance } from './create-balance';

describe('CreateBalance', () => {
  let component: CreateBalance;
  let fixture: ComponentFixture<CreateBalance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBalance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBalance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
