# eslint-plugin-no-call

TODO: add leter

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

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "no-call/no-call": ["warn", ["_.set", "setInterval"]]
  }
}
```

## Supported Rules

* Fill in provided rules here
