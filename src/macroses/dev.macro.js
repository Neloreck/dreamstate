// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createMacro } = require("babel-plugin-macros");

const IS_DEV = (process.env.NODE_ENV === "development");

function dev({ references, babel }) {
  const { types } = babel;
  const { dev } = references;

  dev.forEach((reference) => {
    if (types.isMemberExpression(reference.parentPath)) {
      const expression = reference.parentPath.parentPath;

      // Handle logging only in dev mode.
      if (IS_DEV) {
        const method = reference.parent.property.name;
        const args = expression.node.arguments;

        const logStatement = types.expressionStatement(
          types.callExpression(
            types.memberExpression(types.identifier("console"), types.identifier(method)),
            [
              types.stringLiteral("[DS]"),
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

module.exports = createMacro(dev);
