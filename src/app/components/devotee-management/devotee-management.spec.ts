import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoteeManagement } from './devotee-management';

describe('DevoteeManagement', () => {
  let component: DevoteeManagement;
  let fixture: ComponentFixture<DevoteeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevoteeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoteeManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
