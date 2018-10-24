/**
 * Fetch data from football-data.org
 * Date: 21/10/2018 - 11h00
 * Dependencies:
 *  - axios
 *
 * Bundesliga (BL1): 2002
 * UEFA Europa League (EL): 2146
 * UEFA Champions League (CL): 2001
 * Ligue 1 (FL1): 2015
 * Serie A (SA): 2019
 * Premier League (PL): 2021
 * Primera Division (PD): 2014
 *
 * http://api.football-data.org/v2/competitions/{key}/teams
 * You need to register a account to get the token from this website http://football-data.org
 */
import { apiFootballData } from '@/shared/services/api.service';

export interface TeamFootball {
  id: number,
  name: string,
  crestUrl: string,
  shortName: string
}

export interface TeamInterface {
  id: number,
  name: string,
  flag: string,
  shortName: string
}

export enum COMPETITIONS {
  BUNDESLIGA = 2002,
  UEFA_EUROPA_LEAGUE = 2146,
  UEFA_CHAMPIONS_LEAGUE = 2001,
  LIGUE_1 = 2015,
  SERIE_A = 2019,
  PREMIER_LEAGUE = 2021,
  PRIMERA_DIVISION = 2014
}

class FootballDataService {
  constructor() { }

  getBundesliga(): Promise<TeamInterface[]> {
    return apiFootballData.get(`competitions/${COMPETITIONS.BUNDESLIGA}/teams`)
      .then(this.fetchTeams)
  }

  getUEFAEuropaLeague(): Promise<TeamInterface[]> {
    return apiFootballData.get(`competitions/${COMPETITIONS.UEFA_EUROPA_LEAGUE}/teams`)
      .then(this.fetchTeams)
  }

  getUEFAChampionsLeague(): Promise<TeamInterface[]> {
    return apiFootballData.get(`competitions/${COMPETITIONS.UEFA_CHAMPIONS_LEAGUE}/teams`)
      .then(this.fetchTeams)
  }

  getLigue1(): Promise<TeamInterface[]> {
    return apiFootballData.get(`competitions/${COMPETITIONS.LIGUE_1}/teams`)
      .then(this.fetchTeams)
  }

  getSerieA(): Promise<TeamInterface[]> {
    return apiFootballData.get(`competitions/${COMPETITIONS.SERIE_A}/teams`)
      .then(this.fetchTeams)
  }

  getPremierLeague(): Promise<TeamInterface[]> {
    return apiFootballData.get(`competitions/${COMPETITIONS.PREMIER_LEAGUE}/teams`)
      .then(this.fetchTeams)
  }

  getPrimeraDivision(): Promise<TeamInterface[]> {
    return apiFootballData.get(`competitions/${COMPETITIONS.PRIMERA_DIVISION}/teams`)
      .then(this.fetchTeams)
  }

  private fetchTeams(result: any): TeamInterface[] {
    let _teams: TeamInterface[] = [];
    if (result.data && result.data.teams && result.data.teams.length !== 0) {
      _teams = result.data.teams.map((team: TeamFootball) => {
        return {
          id: team.id,
          name: team.name,
          flag: team.crestUrl,
          shortName: team.shortName
        }
      });
    }

    return _teams;
  }
}

export default new FootballDataService();
