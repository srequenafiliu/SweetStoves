import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepiceItemComponent } from './repice-item.component';

describe('RepiceItemComponent', () => {
  let component: RepiceItemComponent;
  let fixture: ComponentFixture<RepiceItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepiceItemComponent]
    });
    fixture = TestBed.createComponent(RepiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
