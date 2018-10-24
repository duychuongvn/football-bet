const fs = require('fs');
const path = require('path');
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://api.football-data.org/v2/',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': 'ac99500aff224f2fa35037e98fb6f8fb'
  }
});
const COMPETITIONS = {
  BUNDESLIGA : 2002,
  // UEFA_EUROPA_LEAGUE : 2146,
  UEFA_CHAMPIONS_LEAGUE : 2001,
  LIGUE_1 : 2015,
  SERIE_A : 2019,
  PREMIER_LEAGUE : 2021,
  PRIMERA_DIVISION : 2014
};

const DELAY_TIME = 5000;

class FetchData {
  fetchData() {
    for (let i in COMPETITIONS) {
      let index = Object.keys(COMPETITIONS).indexOf(i);
      setTimeout(() => {
        this.callApi(COMPETITIONS[i], index);
      }, index * DELAY_TIME);
    }
  }

  callApi(id) {
    api.get(`competitions/${id}/teams`)
      .then(res => {
        let filename;
        switch (id) {
          case COMPETITIONS.BUNDESLIGA:
            filename = 'bundesliga.json';
            break;
          // case COMPETITIONS.UEFA_EUROPA_LEAGUE:
          //   filename = 'uefa_europa_League.json';
          //   break;
          case COMPETITIONS.UEFA_CHAMPIONS_LEAGUE:
            filename = 'uefa_champions_league.json';
            break;
          case COMPETITIONS.LIGUE_1:
            filename = 'ligue_1.json';
            break;
          case COMPETITIONS.SERIE_A:
            filename = 'serie_a.json';
            break;
          case COMPETITIONS.PREMIER_LEAGUE:
            filename = 'premier_league.json';
            break;
          case COMPETITIONS.PRIMERA_DIVISION:
            filename = 'primera_division.json';
            break;
        }

        this.fetchTeams(res, 'competitions', filename);
      })
  }

  fetchTeams(result, folder, filename) {
    let _teams = [];

    if (result.data && result.data.teams && result.data.teams.length !== 0) {
      _teams = result.data.teams.map(team => {
        return {
          id: team.id,
          name: team.name,
          flag: team.crestUrl,
          shortName: team.shortName
        }
      });
    }

    this.writeFile(folder, filename, _teams)
  }

  writeFile (folder, filename, data) {
    const _folder = path.resolve(__dirname, `${folder}`);
    const _file = path.resolve(__dirname, `${folder}/${filename}`);
    if (!fs.existsSync(_folder)) {
      fs.mkdirSync(_folder);
    }

    fs.writeFile(_file, JSON.stringify(data), err => {
      if (err) throw err;
      console.log(`Sync the data of this file ${filename} successfully!`);
    });
  }
}

(function () {
  const fetchFb = new FetchData();
  fetchFb.fetchData();
}());



