import { PunterInterface } from '@/shared/interfaces/punter'

export class Punter {

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
    }
  }
}
