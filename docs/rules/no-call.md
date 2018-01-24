# Forbid the use of particular functions and/or methods to call

This rule was born in an attempt to forbid the use of the Lodash's `_.set` function, which mutates the passed object. But you can use it for your own reasons.

## Rule Details

It tries to find all functions/methods calls in your code and check rule options to figure out is that call forbidden or not.

> Note: Without options this rule actually useless it would not forbid any calls and do nothig.

Examples of **incorrect** code for this rule:

```js
{
  "rules": {
    "no-call/no-call": [1, ["_.set", "eval", "fn"]]
  }
}
```

```js
// For instance you want to forbit calls of `_.set`, `eval` and some `fn`
_.set({}, "k", "v");
eval("console.log('ping')");
const fn = () => {};
fn();
// or
function fn() {}
fn();
```

Examples of **correct** code for this rule:

```js
{
  "rules": {
    "no-call/no-call": [1, ["console.log", "fn", "F"]]
  }
}
```

```js
console.log.call(console, 42);
new Function("console.log(6)")();
Reflect.apply(console.log, null, [7]);
setTimeout(console.log, 0, 15)(function fn() {})();

new F();
```

## When Not To Use It

Probably not the best choice to use this rule, when assumed, that in some part of the application a function/method call, you want to forbid, may have a different name or call is not explicit like in examples above. But it still up to your needs.
Also, do not use this rule without options.

## Further Reading

* [Forbid the use of mutating methods](https://github.com/jfmengels/eslint-plugin-fp/blob/master/docs/rules/no-mutating-methods.md)
