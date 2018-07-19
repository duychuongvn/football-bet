import { UserOddsInterface } from './user-odds';

export interface UserInterface {
  id: number,
  name: string,
  date: string,
  odds: UserOddsInterface[]
}
