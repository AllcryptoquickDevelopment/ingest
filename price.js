'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const cryptocompare = require('cryptocompare');

const config = require('./config');

global.fetch = require('node-fetch');

function getAllPriceFull(fsyms, tsyms) {

  function getPriceFull(startIndex, endIndex) {
    const batch = fsyms.slice(startIndex, endIndex);
    return Promise.resolve(cryptocompare.priceFull(batch, tsyms))
  }

  let i = 0;
  let promises = [];
  while (i < fsyms.length) {

    if (i + config.limit.maxPriceFullBatch > fsyms.length) {
      promises.push(getPriceFull(i, fsyms.length));
    } else {
      promises.push(getPriceFull(i, i + config.limit.maxPriceFullBatch));
    }

    i += config.limit.maxPriceFullBatch;
  }

  return Promise.map(promises,
      p => Promise.delay(config.limit.batchDelay).return(p),
      { concurrency: 1 })
    .then(batchLists => {
      // merge lists
      let result = {};
      batchLists.forEach(o => result = _.assign(result, o));
      return result;
    })
    .then(prices => _.map(prices, 'BTC'));

}

const result = {
  getAllPriceFull
};

module.exports = result;
