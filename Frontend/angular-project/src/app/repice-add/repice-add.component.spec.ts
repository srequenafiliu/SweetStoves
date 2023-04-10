import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepiceAddComponent } from './repice-add.component';

describe('RepiceAddComponent', () => {
  let component: RepiceAddComponent;
  let fixture: ComponentFixture<RepiceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepiceAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepiceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
