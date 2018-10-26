export class BaseModel {
  private _id!: any;
  get id(): any {
    return this._id;
  }
  set id(v: any) {
    this._id = v;
  }

  constructor(data: any) {
    this.id = data.id;
  }
}
