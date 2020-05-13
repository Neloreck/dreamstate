// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createMacro } = require("babel-plugin-macros");

const IS_DEBUG = (process.env.NODE_ENV === "debug");
const PREFIX_COLOR = "color: #bada53";

function debug({ references, babel, state }) {
  const { types } = babel;
  const { debug } = references;

  debug.forEach((reference) => {
    if (types.isMemberExpression(reference.parentPath)) {
      const expression = reference.parentPath.parentPath;

      // Handle logging only in dev mode.
      if (IS_DEBUG) {
        const method = reference.parent.property.name;
        const args = expression.node.arguments;

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
            types.templateElement({ raw: " [DS]", cooked: " [DS]" })
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
            ]
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

module.exports = createMacro(debug);
