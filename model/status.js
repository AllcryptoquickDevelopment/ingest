'use strict';

function Status(error) {
  this.timestamp = Math.round(Date.now() / 1000);
  this.error = error;
}

module.exports = Status;