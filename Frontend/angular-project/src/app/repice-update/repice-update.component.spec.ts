import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepiceUpdateComponent } from './repice-update.component';

describe('RepiceUpdateComponent', () => {
  let component: RepiceUpdateComponent;
  let fixture: ComponentFixture<RepiceUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepiceUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepiceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
