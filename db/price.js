'use strict';

const mongodb = require('mongodb');
const Promise = require('bluebird');
const _ = require('lodash');

const MongoClient = mongodb.MongoClient;

const config = require('../config');

let db;

Promise.resolve(MongoClient.connect(config.db.url))
  .then(mongo => db = mongo.db('ingest'))
  .tap(() => console.log('Connected to db', config.db.url))
  .catch(e => {
    console.log('Failed to connect to db', config.db.url);
    throw e;
  });

/**
 * Insert prices into the Prices attr of each coin
 * @param {Price[]} prices
 */
function insertPrices(prices) {
  return Promise.map(prices, (price) => {
    const priceList = db.collection('coins').findOne({ "Symbol": price['FROMSYMBOL'] })
      .then(coin => coin.priceList);

    return priceList
      .then(list => list || [])
      .then(list => [price].concat(list)) // TODO don't append if the update time are same
      .then(newList => {
        return db.collection('coins').updateOne(
          { 'Symbol': price['FROMSYMBOL'] },
          { $set: { priceList: newList } });
      })
      .catch(e => {
        console.log('Failed to update price for coin:', price['FROMSYMBOL']);
        console.log(e.stack);
        return null;
      });
  }, { concurrency: config.db.concurrency });
}

const result = {
  insertPrices
};

module.exports = result;