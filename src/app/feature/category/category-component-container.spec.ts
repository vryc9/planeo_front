import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponentContainer } from './category-component-container';

describe('CategoryComponentContainer', () => {
  let component: CategoryComponentContainer;
  let fixture: ComponentFixture<CategoryComponentContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryComponentContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryComponentContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
