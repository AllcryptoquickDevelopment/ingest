'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const url = require('url');
const NodeCache = require('node-cache');
const _ = require('lodash');

const metaFields = ['id', 'name', 'symbol', 'max_supply'];
const priceFields = ['symbol', 'price_usd', 'price_btc',
  '24h_volume_usd', 'market_cap_usd',
  'available_supply', 'total_supply',
  'percent_change_1h', 'percent_change_24h', 'percent_change_7d',
  'last_updated'];

const cache = new NodeCache({stdTTL: 60});    // cache for 1 min

/**
 * Get a list of all tickers that coinmarketcap supports at the time being with latest prices.
 * @param {Number} [limit] max number of tickers returned. 0 returns all.
 * @returns {*|PromiseLike<void>|Promise<void>}
 */
function getTickers(limit) {
  if (!limit) {
    limit = 0;  // all tickers
  }

  let cached = cache.get(limit);
  if (cached) {
    return Promise.resolve(cached);
  }

  const path = url.format({
    host: 'https://api.coinmarketcap.com/v1/ticker/',
    query: {
      limit
    }
  });

  return Promise.resolve(request({
    uri: path,
    json: true
  }))
    .tap(result => cache.set(limit, result));
}

function getTickerSymbols(limit) {
  return getTickers(limit)
    .then(tickers => _.map(tickers, 'symbol'));
}

/**
 * Get Meta of tickers
 * @param {Array} [tickers] List of tickers, return all if missed
 */
function getTickerMeta(tickers) {
  return getTickers()
    .then(results => tickers ? results.filter(t => _.includes(tickers, t.symbol)) : results)
    .map(ticker => _.pick(ticker, metaFields));
}

/**
 * Return the latest prices for coins
 * @param {Array} [tickers] List of tickers, return all if missed
 */
function getTickerLastPrice(tickers) {
  return getTickers()
    .then(results => tickers ? results.filter(t => _.includes(tickers, t.symbol)) : results)
    .map(ticker => _.pick(ticker, priceFields));  //TODO deal with tickers without price data yet
}

const result = {
  getTickerSymbols,
  getTickerMeta,
  getTickerLastPrice
};

module.exports = result;
