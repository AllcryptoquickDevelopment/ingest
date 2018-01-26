'use strict';

const mongodb = require('mongodb');
const Promise = require('bluebird');
const MongoClient = mongodb.MongoClient;
const config = require('../config');
const logger = require('../util/logger');

let connection;
let result = {
  db: null,
  closeConnection,
  setupConnection
};

function closeConnection() {
  if (connection) {
    return Promise.resolve(connection.close())
      .tap(() => connection = null)
      .tap(() => logger.info('DB Connection closed'));
  }

  return Promise.resolve();
}

function setupConnection() {
  if (connection) {
    return Promise.resolve();
  }

  return Promise.resolve(MongoClient.connect(config.db.url))
    .tap(con => connection = con)
    .then(mongo => result.db = mongo.db('ingest'))
    .tap(() => logger.info('Connected to db', config.db.url))
    .catch(e => {
      logger.error('Failed to connect to db', config.db.url);
      throw e;
    });
}

module.exports = result;
