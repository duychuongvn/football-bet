import { BaseModel } from './base';
import { UserOddsInterface } from 'interfaces/user-odds';

import { USER_STATUS } from 'enums/user';

export class UserOdds extends BaseModel {

  private _odds: string;
  public get odds(): string {
    return this._odds;
  }
  public set odds(v: string) {
    this._odds = v;
  }

  private _stake: number;
  public get stake(): number {
    return this._stake;
  }
  public get stakeString(): string {
    return this.stake ? `${this.stake} ETH` : '-';
  }
  public set stake(v: number) {
    this._stake = v;
  }

  private _return: number;
  public get return(): number {
    return this._return;
  }
  public get returnString(): string {
    return this.return ? `${this.return} ETH` : '-';
  }
  public set return(v: number) {
    this._return = v;
  }

  private _status: string;
  public get status(): string {
    return this._status;
  }
  public set status(v: string) {
    this._status = v;
  }
  public get isOpen(): boolean {
    return this.status === USER_STATUS.OPEN;
  }
  public get isCancelled(): boolean {
    return this.status === USER_STATUS.CANCELLED;
  }
  public get isSettled(): boolean {
    return this.status === USER_STATUS.SETTLED;
  }

  public get oddsCancel(): string {
    return `This odds ${this.odds} with ${this.stakeString} will be cancelled.`
  }

  constructor(data?: UserOddsInterface) {
    super(data);

    if (data) {
      this.odds = data.odds;
      this.stake = data.stake;
      this.return = data.return;
      this.status = data.status;
    }
  }
}
