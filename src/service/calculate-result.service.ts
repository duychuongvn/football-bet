import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculateResultService {

  constructor() { }

/**
 * bet: Germany - Sweden
 * odds: Sweden @ 0.75
 * scores: Germany 1 - 0 Sweden
 * goaldifference = 0 - 1
 */

  public calculateAmount(goaldifference : number, odds: number, amount) : number{
    if(odds + goaldifference == 0.25) return amount + amount/2;
    if(odds + goaldifference == -0.25) return amount - amount/2;
    if(odds + goaldifference == 0) return amount;
    if(odds + goaldifference > 0.25) return amount * 2;
    if(odds + goaldifference < -0.25) return 0;
  }

}
