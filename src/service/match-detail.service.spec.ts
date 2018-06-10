import { TestBed, inject } from '@angular/core/testing';

import { MatchDetailService } from './match-detail.service';

describe('MatchDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchDetailService]
    });
  });

  it('should be created', inject([MatchDetailService], (service: MatchDetailService) => {
    expect(service).toBeTruthy();
  }));
});
