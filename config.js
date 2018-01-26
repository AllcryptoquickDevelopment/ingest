'use strict';

module.exports = {
  limit: {
    maxPriceFullBatch: 50,
    batchDelay: 500 // ms
  },
  db: {
    url: 'mongodb://localhost:27017',
    concurrency: 30
  }
};
