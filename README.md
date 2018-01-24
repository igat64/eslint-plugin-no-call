# eslint-plugin-no-call

Eslint plugin with a rule that restricts of use particular functions and/or methods to call.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-no-call`:

```
$ npm install eslint-plugin-no-call --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-no-call` globally.

## Usage

Add `no-call` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["no-call"]
}
```

Then configure the rule.

```json
{
  "rules": {
    "no-call/no-call": [1, ["_.set", "setInterval"]]
  }
}
```

## Supported Rules

See the `docs` directory.
