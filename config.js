'use strict';

const env = process.env.NODE_ENV;

const dockerConfig = require('./config/docker');
const localConfig = require('./config/local');

if (env === 'docker') {
  module.exports = dockerConfig;
} else {
  module.exports = localConfig;
}
