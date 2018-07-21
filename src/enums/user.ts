export enum USER_TYPE_OPEN {
  MATCH_ALL = 'all bet',
  MATCH_SETTLED = 'settled',
  MATCH_OPEN = 'open',
  MATCH_CANCELLED = 'cancelled'
}

export enum USER_TYPE_FINISHED {
  MATCH_ALL = 'all bet',
  MATCH_WON = 'won',
  MATCH_LOST = 'lost',
  MATCH_REFUNDED = 'refunded'
}

export enum USER_STATUS {
  OPEN = 'open',
  SETTLED = 'settled',
  CANCELLED = 'cancelled',
  WON = 'won',
  LOST = 'lost',
  REFUNDED = 'refunded'
}
