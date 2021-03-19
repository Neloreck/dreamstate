if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/production/test-utils.js");
} else {
  module.exports = require("./cjs/development/test-utils.js");
}
