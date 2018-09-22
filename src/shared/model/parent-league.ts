export class ParentLeague{
  protected _name? : string;

  get name(): string | undefined {
    return this._name;
  }

  set name(value: string| undefined) {
    this._name = value;
  }
}
