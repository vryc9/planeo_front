import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordGraphComponent } from './dashbord-graph-component';

describe('DashbordGraphComponent', () => {
  let component: DashbordGraphComponent;
  let fixture: ComponentFixture<DashbordGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbordGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordGraphComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
