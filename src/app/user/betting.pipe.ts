import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'bettingPipe'})
export class BettingPipe implements PipeTransform {
  transform(bettings: any, condition: any): any {
    if (condition == null) return bettings;
    return bettings.filter(function (item) {
      return ((item.status === 0 && condition.open)
        || (item.status === 1 && condition.deal)
        || (item.status === 2 && condition.canceled)
        || (item.status === 3 && condition.refunded)
        || (item.status === 4 && condition.done));
    });
  }
}
