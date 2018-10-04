import { Fixture } from '@/shared/model/fixture';
import { Betting } from '@/shared/model/betting';

export class Profile {
  protected _bettings: Betting[] = [];
  public get bettings(): Betting[] {
    return this._bettings;
  }
  public set bettings(value: Betting[]) {
    this._bettings = value;
  }

  // @ts-ignore
  protected _match: Fixture = undefined;
  public get match(): Fixture {
    return this._match;
  }
  public set match(value: Fixture) {
    this._match = value;
  }

  // @ts-ignore
  protected _summary: Object = undefined;
  public get summary(): Object {
    return this._summary;
  }
  public set summary(value: Object) {
    this._summary = value;
  }

  private _isRequestPayout: boolean = false;
  public get isRequestPayout(): boolean {
    return this._isRequestPayout;
  }
  public set isRequestPayout(value: boolean) {
    this._isRequestPayout = value;
  }

  constructor(profile?: any) {
    if (profile) {
      this.match = new Fixture(profile.match);
      this.summary = profile.summary;

      if (profile.bettings) {
        this._addBettings(profile.bettings);
      }
    }
  }

  protected _addBettings(bettings: any) {
    const _bettings: any = [];
    bettings.map((betting: any) => _bettings.push(new Betting(betting)));

    this.bettings = _bettings;
  }
}
