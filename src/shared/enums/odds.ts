export enum USER_TYPE_OPEN {
  ODDS_ALL = 'all bet',
  ODDS_SETTLED = 'settled',
  ODDS_OPEN = 'open',
  ODDS_CANCELLED = 'cancelled'
}

export enum USER_TYPE_FINISHED {
  ODDS_ALL = 'all bet',
  ODDS_WON = 'won',
  ODDS_LOST = 'lost',
  ODDS_REFUNDED = 'refunded'
}

export enum ODDS_STATUS {
  ODDS_OPEN = 0,
  ODDS_SETTLED = 1,
  ODDS_CANCELLED = 2,
  ODDS_REFUNDED = 3,
  ODDS_DONE = 4
}

export enum ODDS_TYPE {
  ZERO = "0",
  UNDER_QUARTER = "+0.25",
  UNDER_THREE_A_FOURTHS = "+0.75",
  UNDER_HALF = "+0.5",
  UNDER_ONE = "+1",
  UNDER_ONE_AND_QUARTER = "+1.25",
  UNDER_ONE_AND_THREE_A_FOURTHS = "+1.75",
  UNDER_ONE_AND_HALF = "+1.5",
  UNDER_TWO = "+2",
  OVER_QUARTER = "-0.25",
  OVER_THREE_A_FOURTHS = "-0.75",
  OVER_HALF = "-0.5",
  OVER_ONE = "-1",
  OVER_ONE_AND_QUARTER = "-1.25",
  OVER_ONE_AND_THREE_A_FOURTHS = "-1.75",
  OVER_ONE_AND_HALF = "-1.5",
  OVER_TWO = "-2"
}