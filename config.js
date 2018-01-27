'use strict';

module.exports = {
  limit: {
    maxPriceFullBatch: 50,
    batchDelay: 500 // ms
  },
  db: {
    url: 'mongodb://mongo:27017',
    concurrency: 30
  },
  cron: {
    schedule: '10 * * * *'  // run the task each hour when minute is 10 (e.g. 12:10, 13:10, 14:10)
  },
  ssl: {
	caCert: '/etc/cert/ca.crt',
	clientKey: '/etc/cert/ingest.key',
	clientCert: '/etc/cert/ingest.crt'
  }
};
