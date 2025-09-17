import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevaBooking } from './seva-booking';

describe('SevaBooking', () => {
  let component: SevaBooking;
  let fixture: ComponentFixture<SevaBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SevaBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SevaBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
