## NOTE: The library is far from complete not all API endpoints are implemented
If you want to help feel free to do so :)

# bunq.js
This is an API client for the [Bunq API](https://doc.bunq.com/).

[![Build Status](https://travis-ci.org/daanpeer/bunq.js.svg?branch=master)](https://travis-ci.org/daanpeer/bunq.js)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Project set-up
* Firstly run `yarn` in the root of the project
* Then run `yarn build`
* To run the example go to that directory and run `yarn` there
* Then you can run this project by using `yarn start`

## Other usefull commands
* `yarn watch` This will watch the project for file changes and rebuilds the project
* `yarn test` This will run the unit tests
* `yarn test:watch` This will run the tests in watch mode


## Usage
* Firstly import the library

`import Bunq from 'bunq.js'`

Or

`const Bunq = require('bunq.js').default`


* Then you can use the Bunq client. The Bunq client accepts some options

```
{
  apiKey: '',
  ipAddreses: [
  ]
}
```

## Example
An example implementation can be found in `/example`:

* [example](example)
