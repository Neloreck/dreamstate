'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dreamstate.production.js');
} else {
  module.exports = require('./dreamstate.development.js');
}
