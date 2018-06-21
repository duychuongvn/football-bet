import { TestBed, inject } from '@angular/core/testing';

import { CalculateResultService } from './calculate-result.service';
import { when } from 'q';

describe('CalculateResultService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculateResultService]
    });
  });

  it('should be created', inject([CalculateResultService], (service: CalculateResultService) => {
    expect(service).toBeTruthy();
  }));

  it('should be return 0 when amount for bet is 100 and odds is Brazil @ 0.25, scores is Brazil 0 : 1 Japan',
   inject([CalculateResultService], (service: CalculateResultService) => {
      console.log(service.calculateAmount(-1,0.25,100))
     expect(service.calculateAmount(-1,0.25,100)).toEqual(0);
   })
  );

  it('should be return 50 when amount for bet is 100 and odds is Brazil @ -0.25, scores is Brazil 0 : 0 Japan',
  inject([CalculateResultService], (service: CalculateResultService) => {
     console.log(service.calculateAmount(0,-0.25,100))
    expect(service.calculateAmount(0,-0.25,100)).toEqual(50);
  })
 );


 it('should be return 100 when amount for bet is 100 and odds is Brazil @ 0, scores is Brazil 0 : 0 Japan',
  inject([CalculateResultService], (service: CalculateResultService) => {
     console.log(service.calculateAmount(0,0,100))
    expect(service.calculateAmount(0,0,100)).toEqual(100);
  })
 );

 it('should be return 200 when amount for bet is 100 and odds is Brazil @ 0.75, scores is Brazil 0 : 0 Japan',
  inject([CalculateResultService], (service: CalculateResultService) => {
     console.log(service.calculateAmount(0,0.75,100))
    expect(service.calculateAmount(0,0.75,100)).toEqual(200);
  })
 );

 it('germany @ 0.25 , bet amount : 0.01 ETH, result : Sweden 1:0 Germany, Germany lose 0.01, return 0',
  inject([CalculateResultService], (service: CalculateResultService) => {
     console.log(service.calculateAmount(-1,0.25,0.01))
    expect(service.calculateAmount(-1,0.25,0.01)).toEqual(0);
  })
 );
 it('sweden @ - 0.25 , bet amount : 0.01 ETH, result : Sweden 1:0 Germany, Sweden win 0.01, return 0.02',
  inject([CalculateResultService], (service: CalculateResultService) => {
     console.log(service.calculateAmount(1,-0.25,0.01))
    expect(service.calculateAmount(1,-0.25,0.01)).toEqual(0.02);
  })
 );

 it('sweden @ -0.25 , bet amount : 0.01 ETH, result : Sweden 0:0 Germany, Sweden lose 0.005, return 0.005',
 inject([CalculateResultService], (service: CalculateResultService) => {
    console.log(service.calculateAmount(0,-0.25,0.01))
   expect(service.calculateAmount(0,-0.25,0.01)).toEqual(0.005);
 })
);

it('germany @ 0.25 , bet amount : 0.01 ETH, result : Sweden 0:0 Germany, Germany win 0.005, return 0.015',
 inject([CalculateResultService], (service: CalculateResultService) => {
    console.log(service.calculateAmount(0,0.25,0.01))
   expect(service.calculateAmount(0,0.25,0.01)).toEqual(0.015);
 })
);




});
