import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'matchPipe' })
export class MatchPipe implements PipeTransform {
  transform(matches: any, searchText: any): any {
    if(searchText == null) return matches;

    return matches.filter(function(item){
      return (item.match.homeTeam.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        || (item.match.awayTeam.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    });
  }
}
