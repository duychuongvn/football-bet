import { Fixture } from '@/shared/model/fixture';
import { Betting } from '@/shared/model/betting';

export class Profile {
  private _bettings!: Betting[];
  get bettings(): Betting[] {
    return this._bettings;
  }
  set bettings(v: Betting[]) {
    this._bettings = v;
  }

  private _match!: Fixture;
  get match(): Fixture {
    return this._match;
  }
  set match(v: Fixture) {
    this._match = v;
  }

  private _summary: object = {};
  get summary(): object {
    return this._summary;
  }
  set summary(v: object) {
    this._summary = v;
  }

  private _matchId!: string;
  get matchId(): string {
    return this._matchId;
  }
  set matchId(v: string) {
    this._matchId = v;
  }

  constructor(d?: any) {
    if (d) {
      this.match = new Fixture(d.match);
      this.summary = d.summary;
      this.matchId = d.matchId;
      this.bettings = d.bettings.map((betting: any) => new Betting(betting));
    }
  }
}
