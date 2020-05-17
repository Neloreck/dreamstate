if (process.env.NODE_ENV === "production") {
  module.export = require("./cjs/production/index.js");
} else {
  module.export = require("./cjs/development/index.js");
}
