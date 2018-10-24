/**
 * Promise based HTTP client for the browser and node.js
 * Date: 21/10/2018 - 11:00
 *
 * Package: Axios <https://github.com/axios/axios>
 */

const axios = require('axios');

export const apiFootballData = axios.create({
  baseURL: 'http://api.football-data.org/v2/',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': 'ac99500aff224f2fa35037e98fb6f8fb'
  }
});
