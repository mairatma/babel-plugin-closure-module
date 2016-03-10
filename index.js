'use strict';

module.exports = function(babel) {
  var t = babel.types;

  /**
   * Checks if the given member expression is accessing `goog.module`.
   * @param {!MemberExpression} member
   * @return boolean
   */
  function isGoogModuleCall(member) {
    return member.object.name === 'goog' && member.property.name === 'module';
  }

  return {
    visitor: {
      /**
       * Checks if the call expression is `goog.module`.
       * @param {!NodePath} path
       * @param {!Object} state
       */
      CallExpression: function(path, state) {
        var callee = path.node.callee;
        if (t.isMemberExpression(callee) && isGoogModuleCall(callee)) {
          state.foundGoogModuleCall = true;
        }
      },

      MemberExpression: function(path, state) {
        if (!state.foundGoogModuleCall) {
          return;
        }

        if (path.node.object.name === 'exports') {
          path.replaceWith(
            t.memberExpression(
              t.identifier('closureExports'),
              path.node.property,
              path.node.computed
            )
          );
        }
      },

      Program: {
        /**
         * Wraps the program body in a `goog.loadModule` call, if a
         * `goog.module` call was detected inside it.
         * @param {!NodePath} path
         * @param {!Object} state
         */
        exit: function(path, state) {
          if (!state.foundGoogModuleCall) {
            return;
          }

          var contents = path.node.body;
          contents.push(
            t.returnStatement(t.identifier('closureExports'))
          );
          path.node.body = [t.expressionStatement(t.callExpression(
            t.memberExpression(
              t.identifier('goog'),
              t.identifier('loadModule'),
              false
            ),
            [t.functionExpression(
              null,
              [t.identifier('closureExports')],
              t.blockStatement(contents)
            )]
          ))];
        }
      }
    }
  };
};
