const path = require("path");
const { createMacro } = require("babel-plugin-macros");

const IS_DEV = (process.env.NODE_ENV === "debug");
const PREFIX_COLOR = "color: #bada53";

function log({ references, babel, state }) {
  const { types } = babel;
  const { log } = references;

  log.forEach((reference) => {
    if (types.isMemberExpression(reference.parentPath)) {
      const expression = reference.parentPath.parentPath;

      // Handle logging only in dev mode.
      if (IS_DEV) {
        const method = reference.parent.property.name;
        const args = expression.node.arguments;

        // Handle custom methods keys.
        if (method === "pushSeparator") {
          const logStatement = types.expressionStatement(
            types.callExpression(
              types.memberExpression(types.identifier("console"), types.identifier("info")),
              [
                types.stringLiteral("%c=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="),
                types.stringLiteral(PREFIX_COLOR),
              ],
            )
          );

          expression.replaceWith(logStatement);

          return;
        }

        const timeExpression = types.callExpression(
          types.memberExpression(
            types.newExpression(types.identifier("Date"), []),
            types.identifier("toLocaleTimeString")
          ),
          [ types.stringLiteral("en-GB") ]
        );

        const millisStringExpression = types.callExpression(
          types.memberExpression(
            types.callExpression(
              types.memberExpression(
                types.newExpression(types.identifier("Date"), []),
                types.identifier("getMilliseconds")
              ),
              []
            ),
            types.identifier("toString")
          ),
          []
        );

        const millisPaddedExpression = types.callExpression(
          types.memberExpression(millisStringExpression, types.identifier("padStart")),
          [ types.numericLiteral(3), types.stringLiteral("0") ]
        );

        const prefixExpression = types.templateLiteral(
          [
            types.templateElement({ raw: "%c", cooked: "%c" }),
            types.templateElement({ raw: ":", cooked: ":" }),
            types.templateElement({ raw: " [DS]", cooked: " [DS]" }),
          ],
          [
            timeExpression,
            millisPaddedExpression
          ]
        );

        const logStatement = types.expressionStatement(
          types.callExpression(
            types.memberExpression(types.identifier("console"), types.identifier(method)),
            [
              prefixExpression,
              types.stringLiteral(PREFIX_COLOR),
              ...args
            ],
          )
        );

        expression.replaceWith(logStatement);
      } else {
        expression.remove();
      }
    } else {
      throw new Error(
        "Logging macro call is not member expression, you should access console methods from logging object."
      );
    }
  });
}

module.exports = createMacro(log);
