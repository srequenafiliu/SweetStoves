import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepiceManagementComponent } from './repice-management.component';

describe('RepiceManagementComponent', () => {
  let component: RepiceManagementComponent;
  let fixture: ComponentFixture<RepiceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepiceManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepiceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
