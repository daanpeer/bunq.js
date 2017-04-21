# bunq.js
This is an API client for the Bunq API.

[![Build Status](https://travis-ci.org/daanpeer/bunq.js.svg?branch=master)](https://travis-ci.org/daanpeer/bunq.js)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Installation
* Run `yarn install`
* Make sure you got an API key from Bunq


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
