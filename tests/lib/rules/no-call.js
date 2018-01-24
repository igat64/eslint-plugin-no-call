/**
 * @fileoverview Tests for the rule "no-call"
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
function error(callee) {
  return {
    ruleId: "no-call",
    message: `The call of \`${callee}\` is not allowed.`
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
    "(() => {})()",
    "(function () {})()",
    {
      code: "(function fn() {})()",
      options: [["fn"]]
    },
    {
      code: "anyFunctionCall()",
      options: [["obj.anyFunctionCall"]]
    },
    {
      code: "new F()",
      options: [["F", "new F"]]
    },
    {
      code: "setTimeout(console.log, 0, 15)",
      options: [["console.log"]]
    },
    {
      code: "anyFunctionCall()",
      options: [[]]
    },
    //----------------------------------------------------------------------
    // Valid Methods Calls
    //----------------------------------------------------------------------
    "Object.assign({}, { a: 1 })",
    {
      code: "new Function('console.log(6)')()",
      options: [["console.log"]]
    },
    {
      code: "Reflect.apply(console.log, null, [7])",
      options: [["console.log"]]
    },
    {
      code: "const set = _.set; set();",
      options: [["_.set"]]
    },
    {
      code: "({}).set()",
      options: [["({}).set()"]]
    },
    {
      code: "_.set.call(_)",
      options: []
    },
    {
      code: "_.set.call(_)",
      options: [["set.call"]]
    }
  ],

  invalid: [
    //----------------------------------------------------------------------
    // Invalid Functions Calls
    //----------------------------------------------------------------------
    {
      code: "setIn(); setInterval();",
      options: [["setIn", "set", "setInterval"]],
      errors: [error("setIn"), error("setInterval")]
    },
    {
      code: "const fn = () => {}; fn();",
      options: [["fn"]],
      errors: [error("fn")]
    },
    //----------------------------------------------------------------------
    // Invalid Methods Calls
    //----------------------------------------------------------------------
    {
      code: "_.set({}, 'k', 'v')",
      options: [["_.set"]],
      errors: [error("_.set")]
    },
    {
      code: "some.deep.deep.set({}, 'k', 'v')",
      options: [["some.deep.deep.set"]],
      errors: [error("some.deep.deep.set")]
    },
    {
      code: "_.set.call(_)",
      options: [["_.set.call"]],
      errors: [error("_.set.call")]
    }
  ]
});
