"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dreamstate.production.js");
} else if (process.env.DREAMSTATE_DEBUG === "true") {
  module.exports = require("./dreamstate.debug.js");
} else {
  module.exports = require("./dreamstate.development.js");
}
