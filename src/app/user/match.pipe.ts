import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'matchPipe' })
export class MatchPipe implements PipeTransform {
  transform(matches: any, condition: any): any {
    if(matches == null) return null;
    if(condition == null || condition.team == null) return matches;

    return matches.filter(function(item) {
      if (item == null || item.match == null || item.match.homeTeam == null || item.match.awayTeam == null) {return true; }

      return ((
        item.match.homeTeam.toLowerCase().indexOf(condition.team.toLowerCase()) !== -1
        || item.match.awayTeam.toLowerCase().indexOf(condition.team.toLowerCase()) !== -1)
        && ( condition.matchStatus.finished  && item.match.status === 4
          || condition.matchStatus.playing  && item.match.status === 0
          || condition.matchStatus.upcoming  && item.match.status === 1));

    });
  }
}
