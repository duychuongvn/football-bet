import { TeamInterface } from '@/shared/interfaces/fixture';
import { BaseModel } from '@/shared/model/base-model';

export class Team extends BaseModel{
  private _name!: string;
  get name(): string {
    return this._name;
  }
  set name(v: string) {
    this._name = v;
  }

  private _flag!: string;
  get flag(): string {
    return this._flag || require(`@/assets/images/no-images.png`);
  }
  set flag(v: string) {
    this._flag = v;
  }

  get toJson() {
    return {
      id: this.id,
      name: this.name,
      flag: this.flag
    };
  }

  constructor(team: TeamInterface) {
    super(team);

    this.name = team.name;
    this.flag = team.flag;
  }
}
