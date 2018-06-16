import { Component, OnInit } from '@angular/core';
import { Match } from 'models/match';

import {
  Web3Service,
  SolobetService,
  JhelperService
} from 'service/service';

import { Fixture } from 'models/fixture';
import * as groupBy from 'lodash/groupBy';
import * as map from 'lodash/map';
import * as includes from 'lodash/includes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public account: any;
  public accounts: any;
  public match: Match = new Match();
  public upcommingMatches: any;
  public bettings: any;
  public amount: 0;

  private _fixtures: Fixture[] = [];
  public matchFixtures = [];
  public matchName: string = '';

  constructor(
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _helper: JhelperService
  ) {}

  ngOnInit() {
    this.fetch();
  }

  public loadMatches() {
    this._solobetService.loadMatches('0x123').subscribe(
      match => {
        this.match = match;
      },
      e => {
        console.log(e);
      }
    );
  }

  public loadBettings(match) {
    this._solobetService.loadBettings(match.id).subscribe(
      bettings => {
        match.bettings = bettings;
      },
      e => {
        console.log(e);
      }
    );
  }

  public deal(matchId) {
    this._solobetService.deal(this.account, matchId, 0).subscribe(
      result => {
        this.loadBettings(matchId);
      },
      e => {
        console.log(e);
      }
    );
  }

  public fetch(): any {
    this._fixtures = [];

    this._helper.fetchFixtures().subscribe(

      res => {
        console.log(res)
        res.fixtures.map(fixture => {
          if (fixture.homeTeamName && fixture.awayTeamName && fixture.status !== 'FINISHED') {
            // if (fixture.homeTeamName && fixture.awayTeamName) {
             let fixtureId = this._helper.hashId(fixture.homeTeamName, fixture.awayTeamName, fixture.date);
             let _fixture = new Fixture(fixture);
             _fixture.id = fixtureId;
            this._fixtures.push(_fixture);
          }
        });
        this.fetchFlag();
        this.matchFixtures = map(
          groupBy(this._fixtures, 'date_string', ['asc']),
          (value, key) => ({
            key,
            value: [...value]
          })
        );
      },
      errors => {
        console.log(errors);
      }
    );
  }

  private fetchFlag(): any {
    this._helper.fetchTeam().subscribe(resp => {
      resp.teams.map(team => {
        this._fixtures.forEach(item => {
          if (item.homeTeamName === team.name) {
            item.homeFlag = team.crestUrl;
          }
          if (item.awayTeamName === team.name) {
            item.awayFlag = team.crestUrl;
          }
        });
      });
    });
  }

  public searchMatch() {
    let _term;
    if (this.matchName.length > 1) {
      _term = this.matchFixtures.filter(item => {
        return  item.value.find(val => {
          return includes(
            val.homeTeamName.toLowerCase() || val.awayTeamName.toLowerCase(),
            this.matchName.toLowerCase()
          );
        });
      });
    } else {
      _term = this.matchFixtures;
    }
    return _term;
  }


}
