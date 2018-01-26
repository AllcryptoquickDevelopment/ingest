'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const price = require('./price');
const common = require('./util/common');
const dbMeta = require('./db/meta');
const dbPrice = require('./db/price');

// common.getCoinList()
//   .tap(l => console.log(l.length))
//   .then(list => price.getAllPriceFull(list, ['BTC']))
//   .then(console.log)
//   .tap(() => console.log('Finished'));


common.getCoinMeta()
  // .then(dbMeta.saveMeta)
  // .tap(() => console.log('meta saved'))
  .then(common.getCoinList)
  .then((list) => price.getAllPriceFull(list, ['BTC']))
  .then(dbPrice.insertPrices)
  .tap(() => console.log('price saved'));
