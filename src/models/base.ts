export class BaseModel {

  private _id : number | string;
  public get id() : number | string {
    return this._id;
  }
  public set id(v : number | string) {
    this._id = v;
  }


  constructor(data?: any) {

    if (data) {
      this.id = data.id;
    }
  }
}
