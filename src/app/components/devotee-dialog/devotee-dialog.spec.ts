import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoteeDialog } from './devotee-dialog';

describe('DevoteeDialog', () => {
  let component: DevoteeDialog;
  let fixture: ComponentFixture<DevoteeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevoteeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoteeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
