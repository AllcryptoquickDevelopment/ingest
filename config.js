'use strict';

module.exports = {
  limit: {
    maxPriceFullBatch: 50,
    batchDelay: 500 // ms
  },
  db: {
    url: 'mongodb://mongo:27017',
    concurrency: 30
  }
};
