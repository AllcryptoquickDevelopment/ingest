'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const cron = require('node-cron');

const config = require('./config');
const api = require('./api/coinmarketcap');
const logger = require('./util/logger');

const Status = require('./model/status');

const db = require('./db/db');
const dbMeta = require('./db/meta');
const dbPrice = require('./db/price');
const dbStatus = require('./db/status');

function saveMeta() {
  // we first check if there is already coin data in db
  const lastStatus = dbStatus.getLatestStatus();

  // TODO perform finer grain control of when to update meta data
  return lastStatus.then(s => {
    if (!s) {
      return api.getTickerMeta().then(dbMeta.saveMeta)
        .tap(() => logger.info('Coin meta saved'));
    }

    return Promise.resolve();
  });
}

function updatePrice() {
  return api.getTickerLastPrice()
    .then(dbPrice.insertPrices)
    .tap(() => logger.info('Coin price updated'));
}

function updateStatus(s) {
  return dbStatus.updateStatus(s)
    .tap(() => logger.info('Database status updated'))
    .tap(() => {
      if (!s.error) {
        logger.info('No error');
      } else {
        logger.error(s.error);
        console.log(s);
      }
    })
}

function doIngest() {
  logger.info('======= Running ingest job now! =======');
  return db.setupConnection()
    .then(() => saveMeta())
    .then(() => updatePrice())
    .then(() => updateStatus(new Status()))
    .catch(e => updateStatus(new Status(e)))
    .finally(db.closeConnection);
}

// bring up the cron task
cron.schedule(config.cron.schedule, doIngest);
