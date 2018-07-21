export const MATCHES = [
  {
    id: 1,
    name: 'Denmark - Autralia',
    date: '2018/06/20',
    odds: [
      {
        id: 1,
        odds: 'denmark +1',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'open'
      },
      {
        id: 2,
        odds: 'autralia +1',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'settled'
      },
      {
        id: 3,
        odds: 'denmark +3',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'cancelled'
      },
      {
        id: 4,
        odds: 'autralia +2',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'open'
      }
    ]
  },
  {
    id: 2,
    name: 'Denmark - Autralia',
    date: '2018/06/20',
    odds: [
      {
        id: 1,
        odds: 'denmark +1',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'open'
      },
      {
        id: 2,
        odds: 'autralia +1',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'settled'
      },
      {
        id: 3,
        odds: 'denmark +3',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'settled'
      },
      {
        id: 4,
        odds: 'autralia +2',
        stake: Math.floor(Math.random() * 10) + 1,
        return: 0,
        status: 'open'
      }
    ]
  }
]

export const SORTODDS_OPTS = [
  {
    id: 1,
    name: 'Date'
  },
  {
    id: 2,
    name: 'Stake'
  }
];

export const SORTODDS_CHILD_OPTS = {
  date: [
    {
      id: 1,
      name: 'Most recent'
    },
    {
      id: 2,
      name: 'Latest to newest'
    }
  ],
  stake: [
    {
      id: 1,
      name: 'high to low'
    },
    {
      id: 2,
      name: 'low to high'
    }
  ]
}
