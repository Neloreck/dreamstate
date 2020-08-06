if (process.env.NODE_ENV === "production") {
  module.export = require("./cjs/production/test-utils.js");
} else {
  module.export = require("./cjs/development/test-utils.js");
}
