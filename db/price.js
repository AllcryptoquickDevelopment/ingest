'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const db = require('./db');
const logger = require('../util/logger');
const config = require('../config');

/**
 * Insert prices into the Prices attr of each coin
 * @param {Price[]} prices
 */
function insertPrices(prices) {
  return Promise.map(prices, (price) => {
    const priceList = db.db.collection('coins').findOne({ "id": price['id'] })
      .then(coin => coin.price_list)
      .catch(e => {
        logger.warn('Cannot find coin in database: ', price['id']);
        logger.warn(e.stack);
      });

    return priceList
      .then(list => list || [])
      .then(list => [price].concat(list)) // TODO don't append if the update time are same
      .then(newList => {
        return db.db.collection('coins').updateOne(
          { 'id': price['id'] },
          { $set: { price_list: newList } });
      })
      .catch(e => {
        logger.error('Failed to update price for coin:', price['id']);
        logger.error(e.stack);
        return null;
      });
  }, { concurrency: config.db.concurrency });
}

const result = {
  insertPrices
};

module.exports = result;
