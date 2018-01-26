'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const cryptocompare = require('cryptocompare');

global.fetch = require('node-fetch');

let coins;

/**
 * Retrieve all the coins and return a list of them.
 * if will first look at data store, then the web API.
 */
function getCoinList() {
  // TODO look up local data store first
  return Promise.resolve(cryptocompare.coinList())
    .then(res => res['Data'])
    .tap((data) => coins = data)
    .then(data => _.map(data, 'Symbol'));
}

function getCoinMeta() {
  let result;
  // reuse previous result to save traffic
  if (coins) {
    result = Promise.resolve(coins);
  } else {
    result = Promise.resolve(cryptocompare.coinList())
      .then(res => res['Data']);
  }

  return result
    .then(obj => _.map(obj, v => v));
}

const result = {
  getCoinList,
  getCoinMeta
};

module.exports = result;