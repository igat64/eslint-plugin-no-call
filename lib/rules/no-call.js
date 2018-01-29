/**
 * @fileoverview The rule that forbid the use of particular functions and/or methods to call
 * @author Igor Atroshkin <igor.atroshkin@gmail.com>
 */
"use strict";

//-------------------------------------------------------------------------
// Helpers
//-------------------------------------------------------------------------
function splitByDot(str) {
  return str.split(".");
}
function isMemberExpression(obj) {
  return obj && obj.type === "MemberExpression";
}
function isIdentifier(obj) {
  return obj && obj.type === "Identifier";
}
function isLeteral(obj) {
  return obj && obj.type === "Literal";
}
function isFunctionOption(option) {
  const parts = splitByDot(option);
  return parts.length === 1;
}
function isMethodOption(option) {
  const parts = splitByDot(option);
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
  if (isLeteral(callee.property)) {
    return callee.property.value;
  }
  if (isIdentifier(callee.property)) {
    return callee.property.name;
  }
  return undefined;
}
function gatherObjectsNamesToChain(callee) {
  const chain = [];
  let currObj = callee.object;
  while (true) {
    if (!isMemberExpression(currObj) && !isIdentifier(currObj)) {
      return chain;
    }
    if (isMemberExpression(currObj)) {
      if (isLeteral(currObj.property)) {
        chain.unshift(currObj.property.value);
      }
      if (isIdentifier(currObj.property)) {
        chain.unshift(currObj.property.name);
      }
    }
    if (isIdentifier(currObj)) {
      chain.unshift(currObj.name);
      return chain;
    }
    currObj = currObj.object;
  }
}
function getMethodCallChain(callee) {
  const methodName = getMethodName(callee);
  const objectsChain = gatherObjectsNamesToChain(callee);
  const methodCallChain = objectsChain.concat(methodName);
  return methodCallChain.join(".");
}
function isRestrictedFunctionCall(restrictions, functionName) {
  return restrictions.includes(functionName);
}
function isRestrictedMethodCall(restrictions, methodCallChain) {
  return restrictions.includes(methodCallChain);
}
function reportMessage(calleeStr) {
  return `The call of \`${calleeStr}\` is not allowed.`;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: "Forbid the use particular functions and/or methods to call.",
      recommended: false,
      url: "https://github.com/igat-gh/eslint-plugin-no-call/blob/master/docs/rules/no-call.md"
    },
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
    const options = context.options[0] || [];
    const restrictedFuncsToCall = options.filter(isFunctionOption);
    const restrictedMethodsToCall = options.filter(isMethodOption);

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      CallExpression: function(node) {
        if (isFunctionCall(node)) {
          const functionName = getFunctionName(node.callee);
          const haveToReportFnCall = isRestrictedFunctionCall(restrictedFuncsToCall, functionName);
          haveToReportFnCall && context.report({ node, message: reportMessage(functionName) });
        }
        if (isMethodCall(node)) {
          const methodCallChain = getMethodCallChain(node.callee);
          const haveToReportMethodCall = isRestrictedMethodCall(
            restrictedMethodsToCall,
            methodCallChain
          );
          haveToReportMethodCall &&
            context.report({ node, message: reportMessage(methodCallChain) });
        }
        return;
      }
    };
  }
};
