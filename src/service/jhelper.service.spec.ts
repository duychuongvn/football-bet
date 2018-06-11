import { TestBed, inject } from '@angular/core/testing';

import { JhelperService } from './jhelper.service';

describe('JhelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JhelperService]
    });
  });

  it('should be created', inject([JhelperService], (service: JhelperService) => {
    expect(service).toBeTruthy();
  }));

  it('should be show', inject([JhelperService],(service: JhelperService) =>{
    service.getRatesJson();
  }));
});
