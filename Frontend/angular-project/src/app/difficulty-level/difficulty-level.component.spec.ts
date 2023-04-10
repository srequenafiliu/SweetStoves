import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultyLevelComponent } from './difficulty-level.component';

describe('DifficultyLevelComponent', () => {
  let component: DifficultyLevelComponent;
  let fixture: ComponentFixture<DifficultyLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifficultyLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifficultyLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
