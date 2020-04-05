# mocha-dd-reporter

> Mocha test reporter that captures tests output and displays it along with error messages. Output of sucessfull tests is hidden to reduce noise.

[![NPM][npm-icon] ][npm-url]

## Why

Output emitted during a test may carry helpful insights on what went wrong. Default mocha reporter displays test error message at the bottom, while logs emitted during that test end up somewhere in the middle of the report, along with logs emitted during all other tests. This is unfortunate and makes finding specific test output inconvenient, specially if there are a lot of tests and report is long.

This package aims to solve the above problem by capturing stdout and stderr during tests, so that:

- Output emitted during a failed test as well as its before and beforeEach hooks is annotated and displayed just below the error message.
- Output of all sucessfull tests is not displayed at all, making the overall report shorter and less noisy.

## Install

Requires [mocha](https://github.com/mochajs/mocha/) 7.x

```sh
npm install --save-dev mocha-dd-reporter
```

## Use

Add `--reporter mocha-dd-reporter` when running tests with mocha. Eg.

```sh
npx mocha --reporter mocha-dd-reporter **/*.spec.js
```

[npm-icon]: https://nodei.co/npm/mocha-dd-reporter.svg?downloads=true
[npm-url]: https://npmjs.org/package/mocha-dd-reporter
