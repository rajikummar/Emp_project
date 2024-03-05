import { TestBed } from '@angular/core/testing';

import { DisplayContactUsService } from './display-contact-us.service';

describe('DisplayContactUsService', () => {
  let service: DisplayContactUsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayContactUsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
