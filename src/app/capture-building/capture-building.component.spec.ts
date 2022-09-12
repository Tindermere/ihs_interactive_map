import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureBuildingComponent } from './capture-building.component';

describe('CaptureBuildingComponent', () => {
  let component: CaptureBuildingComponent;
  let fixture: ComponentFixture<CaptureBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureBuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
