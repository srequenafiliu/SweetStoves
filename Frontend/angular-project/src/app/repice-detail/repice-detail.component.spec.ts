import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepiceDetailComponent } from './repice-detail.component';

describe('RepiceDetailComponent', () => {
  let component: RepiceDetailComponent;
  let fixture: ComponentFixture<RepiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepiceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
