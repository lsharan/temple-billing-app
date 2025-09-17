import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevaDialog } from './seva-dialog';

describe('SevaDialog', () => {
  let component: SevaDialog;
  let fixture: ComponentFixture<SevaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SevaDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SevaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
