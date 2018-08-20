# Bether

### Deploy Solidity With Truffle
<img src="https://avatars2.githubusercontent.com/u/22205159?s=200&v=4" width="200">

[![npm](https://img.shields.io/npm/v/truffle.svg)](https://www.npmjs.com/package/truffle)
[![npm](https://img.shields.io/npm/dm/truffle.svg)](https://www.npmjs.com/package/truffle)
[![Join the chat at https://gitter.im/consensys/truffle](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/consensys/truffle?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/trufflesuite/truffle.svg?branch=develop)](https://travis-ci.org/trufflesuite/truffle)


```sh
$ cd backend
$ truffle compile
$ truffle deploy
```
- copy some one address ex:(``` 0x627306090abab3a6e1400e9345bc60c78a8bef57 ```) from Accounts.

```sh
$ migrate --reset
```
- paste on file ```src/environment/index.ts ``` at ``` CONTRACT_ADDRESS ```

### Copy ABI from this file "BetherContract.json"
```sh
$ cd backend/build/contracts
$ vim BetherContract.json
```
- copy property "abi" on file

```sh
$ cd src/assets/contracts
$ vim BetherContract.json
```
- paste on this file "BetherContract.json"

### Run project Bether

#### VueJs
<p align="center">
  <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">
    <img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
  </a>
</p>

<p align="center">
  <a href="https://circleci.com/gh/vuejs/vue/tree/dev"><img src="https://img.shields.io/circleci/project/vuejs/vue/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/vuejs/vue?branch=dev"><img src="https://img.shields.io/codecov/c/github/vuejs/vue/dev.svg" alt="Coverage Status"></a>
  <a href="https://npmcharts.com/compare/vue?minimal=true"><img src="https://img.shields.io/npm/dm/vue.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/v/vue.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
</p>

```sh
$ cd bether
$ yarn # install node_module
$ yarn serve # run serve localhost
```
- Open browser with address [localhost:8080](localhost:8080)
- Enjoy
