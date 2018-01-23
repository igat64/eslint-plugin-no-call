/**
 * @fileoverview The rule that restricts of use particular functions and/or methods to call.
 * @author Igor Atroshkin <igor.atroshkin@gmail.com>
 */
"use strict";

//-------------------------------------------------------------------------
// Helpers
//-------------------------------------------------------------------------
function splitByDot(str) {
  return str.split(".");
}

function isFunctionOption(option) {
  var parts = splitByDot(option);
  return parts.length === 1;
}
function isMethodOption(option) {
  var parts = splitByDot(option);
  return parts.length > 1;
}

function isFunctionCall(node) {
  return node.callee.type === "Identifier";
}
function isMethodCall(node) {
  return node.callee.type === "MemberExpression";
}

function getFunctionName(collee) {
  return collee.name;
}
function getMethodName(callee) {
  return callee.property.name;
}

function isMemberExpression(obj) {
  return obj && obj.type === "MemberExpression";
}
function isIdentifier(obj) {
  return obj && obj.type === "Identifier";
}
function gatherObjectsNamesChain(callee) {
  var chain = [];
  var currObj = callee.object;

  while (true) {
    if (!isMemberExpression(currObj) && !isIdentifier(currObj)) {
      return chain;
    }
    if (isMemberExpression(currObj)) {
      chain.unshift(currObj.property.name);
    }
    if (isIdentifier(currObj)) {
      chain.unshift(currObj.name);
      return chain;
    }
    currObj = currObj.object;
  }
}
function getMethodCallChain(callee) {
  var methodName = getMethodName(callee);
  var objectsChain = gatherObjectsNamesChain(callee);
  var methodCallChain = objectsChain.concat(methodName);
  return methodCallChain.join(".");
}

function isRestrictedFunctionCall(restrictions, functionName) {
  return restrictions.indexOf(functionName) !== -1;
}
function isRestrictedMethodCall(restrictions, methodCallChain) {
  return restrictions.indexOf(methodCallChain) !== -1;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: "Restrict to use particular functions and/or methods to call.",
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: "array",
        items: {
          type: "string"
        }
      }
    ]
  },

  create: function(context) {
    var options = context.options[0] || [];
    var restrictedFuncsToCall = options.filter(isFunctionOption);
    var restrictedMethodsToCall = options.filter(isMethodOption);

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      CallExpression: function(node) {
        if (isFunctionCall(node)) {
          var functionName = getFunctionName(node.callee);
          var haveToReportFnCall = isRestrictedFunctionCall(restrictedFuncsToCall, functionName);
          haveToReportFnCall &&
            context.report({
              node,
              message: "The call of function `" + functionName + "` is restricted by configuration."
            });
        }
        if (isMethodCall(node)) {
          var methodCallChain = getMethodCallChain(node.callee);
          var haveToReportMethodCall = isRestrictedMethodCall(
            restrictedMethodsToCall,
            getMethodCallChain(node.callee)
          );
          haveToReportMethodCall &&
            context.report({
              node,
              message:
                "The call of method `" + methodCallChain + "` is restricted by configuration."
            });
        }
        return;
      }
    };
  }
};
