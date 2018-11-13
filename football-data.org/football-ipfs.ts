const fs = require('fs');
const path = require('path');
const axios = require('axios');
// const ipfs = require('ipfs');
// const buffer = require('buffer').Buffer;
// const node = new ipfs();

const bundesliga = require('./competitions/bundesliga.json');
const uefa_champions_league = require('./competitions/uefa_champions_league.json');
const ligue_1 = require('./competitions/ligue_1.json');
const serie_a = require('./competitions/serie_a.json');
const premier_league = require('./competitions/premier_league.json');
const primera_division = require('./competitions/primera_division.json');
const primeria_liga = require('./competitions/primeria_liga.json');
const eredivisie = require('./competitions/eredivisie.json');
const championship = require('./competitions/championship.json');

const api = axios.create({
  baseURL: 'http://api.football-data.org/v2/',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': 'ac99500aff224f2fa35037e98fb6f8fb'
  }
});

const COMPETITIONS_KEY = {
  BUNDESLIGA: 'BL1',
  // UEFA_EUROPA_LEAGUE: 'CL',
  PRIMEIRA_LIGA: 'PPL',
  EREDIVISIE: 'DED',
  UEFA_CHAMPIONS_LEAGUE: 'EL',
  LIGUE_1: 'FL1',
  SERIE_A: 'SA',
  PREMIER_LEAGUE: 'PL',
  PRIMERA_DIVISION: 'PD',
  CHAMPIONSHIP: 'ELC'
}

// let ipfsData = [];

const DELAY_TIME = 6000;

class FetchData {
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

  renderDate(number) {
    const _date = new Date();
    _date.setDate(_date.getDate() + number);

    const day = _date.getDate() < 10 ? `0${_date.getDate()}` : _date.getDate();
    const month = _date.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : month;

    return `${_date.getFullYear()}-${monthString}-${day}`;
  }

  addParams(obj) {
    let str = [];
    for (let p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  fetchMatches() {
    for (let i in COMPETITIONS_KEY) {
      let index = Object.keys(COMPETITIONS_KEY).indexOf(i);
      setTimeout(() => {
        this.getMatches(COMPETITIONS_KEY[i]);
      }, index * DELAY_TIME);
    }
  }

  async getMatches(match_name) {
    const _opts = await this.addParams({
      competitions: match_name,
      status: 'SCHEDULED',
      dateFrom: this.renderDate(0),
      dateTo: this.renderDate(7)
    });

    api.get(`matches?${_opts}`)
      .then(res => {
        let fileName = '';
        let originData = undefined;
        switch (match_name) {
          case COMPETITIONS_KEY.BUNDESLIGA:
            fileName = 'bundesliga.json';
            originData = bundesliga;
            break;
          // case COMPETITIONS.UEFA_EUROPA_LEAGUE:
          //   fileName = 'uefa_europa_League.json';
          //   originData = bundesliga;
          //   break;
          case COMPETITIONS_KEY.UEFA_CHAMPIONS_LEAGUE:
            fileName = 'uefa_champions_league.json';
            originData = uefa_champions_league;
            break;
          case COMPETITIONS_KEY.LIGUE_1:
            fileName = 'ligue_1.json';
            originData = ligue_1;
            break;
          case COMPETITIONS_KEY.SERIE_A:
            fileName = 'serie_a.json';
            originData = serie_a;
            break;
          case COMPETITIONS_KEY.PREMIER_LEAGUE:
            fileName = 'premier_league.json';
            originData = premier_league;
            break;
          case COMPETITIONS_KEY.PRIMERA_DIVISION:
            fileName = 'primera_division.json';
            originData = primera_division;
            break;
          case COMPETITIONS_KEY.PRIMEIRA_LIGA:
            fileName = 'primeira_liga.json';
            originData = primeria_liga;
            break;
          case COMPETITIONS_KEY.EREDIVISIE:
            fileName = 'eredivisie.json';
            originData = eredivisie;
            break;
          case COMPETITIONS_KEY.CHAMPIONSHIP:
            fileName = 'championship.json';
            originData = championship;
            break;
        }
        this.filterMatches(res, fileName, originData)
      });
  }

  filterMatches(result, fileName, originData) {
    let _matches = [];

    if (result.data && result.data.matches && result.data.matches.length !== 0) {
      _matches = result.data.matches.map(match => {
        match.homeTeam.flag = originData.find(item => +item.id === +match.homeTeam.id).flag;
        match.awayTeam.flag = originData.find(item => +item.id === +match.awayTeam.id).flag;
        return {
          id: match.id,
          date: match.utcDate,
          status: match.status,
          score: match.score,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam
        }
      })
    }

    // node.files.add({
    //   path: fileName,
    //   content: (typeof _matches === "string") ? _matches : buffer.from(JSON.stringify(_matches))
    // }).then(res => {
    //   ipfsData = ipfsData.concat(res);
    //   this.writeFile('matches', fileName, ipfsData);
    // });

    this.writeFile('matches', fileName, _matches);

    return _matches;
  }
}

(function () {
  const fetchFb = new FetchData();

  // node.on('ready', async () => {
  //   ipfsData = [];
  //   await fetchFb.fetchMatches();
  //
  //   node.stop();
  // });

  fetchFb.fetchMatches();
}());
