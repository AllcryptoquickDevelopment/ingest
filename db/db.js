'use strict';

const mongodb = require('mongodb');
const Promise = require('bluebird');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

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
      .tap(() => console.log('DB Connection closed'));
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
    .tap(() => console.log('Connected to db', config.db.url))
    .catch(e => {
      console.log('Failed to connect to db', config.db.url);
      throw e;
    });
}

setupConnection();

module.exports = result;
