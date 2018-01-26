'use strict';

const db = require('./db');
const Promise = require('bluebird');
const _ = require('lodash');

function updateStatus(status) {
  return Promise.resolve(db.db.collection('status').insertOne(status))
    .tap(() => db.db.collection('status').ensureIndex({ "timestamp": 1 }));
}

function getLatestStatus() {
  return Promise.resolve(db.db.collection('status').find().sort({ timestamp: -1 }).limit(1).toArray())
    .then(_.head);
}

const result = {
  updateStatus,
  getLatestStatus
};

module.exports = result;
