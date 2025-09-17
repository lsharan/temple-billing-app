import { TestBed } from '@angular/core/testing';

import { DevoteeService } from './devotee.service';

describe('Devotee', () => {
  let service: DevoteeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevoteeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
