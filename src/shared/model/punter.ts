import { PunterInterface } from '@/shared/interfaces/punter'

export class Punter {

  // 0: None, 1: Win, 2: WinAHalf, 3: Draw, 4:LoseAHalf, 5:Lose
  private _punterResult: number = 0;
  public get punterResult(): number {
    return this._punterResult;
  }
  public set punterResult(value: number) {
    this._punterResult = value;
  }
  public  get punterResultString(): string {
    return this.punterResult !== 0 ? 'Waiting payment' : 'Paid';
  }

  protected _no: number = 0;
  public get no(): number {
    return this._no;
  }
  public set no(v: number) {
    this._no = v;
  }

  protected _settledAmount: number = 0;
  public get settledAmount(): number{
    return this._settledAmount;
  }
  public get settledAmountString(): string {
    return `${this.settledAmount.toFloatString(3)} ETH`;
  }
  public set settledAmount(v: number ) {
    this._settledAmount = v;
  }

  protected _wallet: string = '';
  public get wallet(): string {
    return this._wallet;
  }
  public set wallet(v: string) {
    this._wallet = v;
  }

  constructor(punter: PunterInterface) {
    if (punter) {
      this.no            = punter.no;
      this.settledAmount = +punter.settledAmount;
      this.wallet        = punter.wallet;
      this.punterResult  = +punter.punterResult;
    }
  }
}
