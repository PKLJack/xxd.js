# `xxd.js`

An exercise of writing `xxd` in JavaScript.


## Install

```sh
npm -g install https://github.com/PKLJack/xxd.js

## Development branch
npm -g install https://github.com/PKLJack/xxd.js#dev
```

Uninstall
```sh
npm -g uninstall xxd.js
```


## Usage

Hexdump (default) mode
```sh
cat stuff.txt | xxd.js
```

Revert mode
```sh
cat stuff.txt | xxd.js -r
```

> Passing files as input and output is not supported yet


## Development

Install
```sh
npm ci --ignore-scripts --include=dev

## When changes are made in package.json
npm i --ignore-scripts --include=dev

## NOTE:
## `--include=dev` matters only when `NODE_ENV` is set to `production`
## See: https://docs.npmjs.com/cli/v11/commands/npm-install#omit
```

Testing
```sh
npm run test
npm run testWatch
```


## Future

- Handle file input and output
- Add more options
