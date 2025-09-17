import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevaManagement } from './seva-management';

describe('SevaManagement', () => {
  let component: SevaManagement;
  let fixture: ComponentFixture<SevaManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SevaManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SevaManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
