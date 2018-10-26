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

  private _summary!: Object;
  get summary(): Object {
    return this._summary;
  }
  set summary(v: Object) {
    this._summary = v;
  }

  private _isRequestPayout!: boolean;
  get isRequestPayout(): boolean {
    return this._isRequestPayout;
  }
  set isRequestPayout(v: boolean) {
    this._isRequestPayout = v;
  }

  private _matchId!: string;
  get matchId(): string {
    return this._matchId;
  }
  set matchId(v: string) {
    this._matchId = v;
  }

  constructor(profile?: any) {
    if (profile) {
      this.match = new Fixture(profile.match);
      this.summary = profile.summary;
      this.matchId = profile.matchId;
      this.bettings = profile.bettings.map((betting: any) => new Betting(betting));
    }
  }
}
