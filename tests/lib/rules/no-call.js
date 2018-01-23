/**
 * @fileoverview TODO: add leter
 * @author Igor Atroshkin <igor.atroshkin@gmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-call");
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function funcError(functionName) {
  return {
    ruleId: "no-call",
    message: `The call of function \`${functionName}\` is restricted by configuration.`
  };
}
function methodError(methodNameWithCalleObj) {
  return {
    ruleId: "no-call",
    message: `The call of method \`${methodNameWithCalleObj}\` is restricted by configuration.`
  };
}
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6
  }
});

const ruleTester = new RuleTester();
ruleTester.run("no-call", rule, {
  valid: [
    //----------------------------------------------------------------------
    // Valid Functions Calls
    //----------------------------------------------------------------------
    "call()",
    {
      code: "anyFunctionCall()",
      options: [["obj.anyFunctionCall"]]
    },
    {
      code: "anyFunctionCall()",
      options: [[]]
    },
    {
      code: "new F()",
      options: [["F", "new F"]]
    },
    {
      code: "(function fn() {})()",
      options: [["fn"]]
    },
    "(() => {})()",
    "(function () {})()",
    //----------------------------------------------------------------------
    // Valid Methods Calls
    //----------------------------------------------------------------------
    {
      code: "_.set.call(_)",
      options: []
    },
    {
      code: "_.set.call(_)",
      options: [["set.call"]]
    },
    {
      code: "const set = _.set; set();",
      options: [["_.set"]]
    }
  ],

  invalid: [
    //----------------------------------------------------------------------
    // Invalid Functions Calls
    //----------------------------------------------------------------------
    {
      code: "setIn()",
      options: [["setIn", "set"]],
      errors: [funcError("setIn")]
    },
    //----------------------------------------------------------------------
    // Invalid Methods Calls
    //----------------------------------------------------------------------
    {
      code: "_.set({}, 'k', 'v')",
      options: [["_.set"]],
      errors: [methodError("_.set")]
    },
    {
      code: "some.deep.set({}, 'k', 'v')",
      options: [["some.deep.set"]],
      errors: [methodError("some.deep.set")]
    },
    {
      code: "_.set.call(_)",
      options: [["_.set.call"]],
      errors: [methodError("_.set.call")]
    }
  ]
});
