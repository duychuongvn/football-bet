import { SumaryInterface } from '@/shared/interfaces/fixture'

export class Sumary {

  private _open!: number;
  get open(): number {
    return this._open;
  }
  set open(v: number) {
    this._open = v;
  }

  private _canceled!: number;
  get canceled(): number {
    return this._canceled;
  }
  set canceled(v: number) {
    this._canceled = v;
  }

  private _portionSettled!: number;
  get portionSettled(): number {
    return this._portionSettled;
  }
  set portionSettled(v: number) {
    this._portionSettled = v;
  }

  private _refuned!: number;
  get refuned(): number {
    return this._refuned;
  }
  set refuned(v: number) {
    this._refuned = v;
  }

  private _settledOrDone!: number;
  get settledOrDone(): number {
    return this._settledOrDone;
  }
  set settledOrDone(v: number) {
    this._settledOrDone = v;
  }

  get totalCurrentBets(): number {
    return this.open + this.portionSettled  + this.settledOrDone;
  }

  get totalOpen(): number {
    return this.open + this.portionSettled;
  }

  constructor(d?: SumaryInterface) {
    if (d) {
      this.open = d.open;
      this.canceled = d.canceled;
      this.settledOrDone = d.settledOrDone;
      this.refuned = d.refuned;
      this.portionSettled = d.portionSettled;
    }
  }
}
