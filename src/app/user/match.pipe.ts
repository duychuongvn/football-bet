import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'matchPipe' })
export class MatchPipe implements PipeTransform {
  transform(matches: any, condition: any): any {
    if(condition == null || condition.team == null) return matches;

    console.log(matches);
    console.log(condition);
    return matches.filter(function(item){
      return ((item.match.homeTeam.toLowerCase().indexOf(condition.team.toLowerCase()) !== -1)
        || (item.match.awayTeam.toLowerCase().indexOf(condition.team.toLowerCase()) !== -1)
        &&(!condition.matchStatus || (condition.matchStatus && item.match.status == 4 ))

      );
    });
  }
}
