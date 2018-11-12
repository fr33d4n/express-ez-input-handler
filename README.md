# Express EZ input handler
An elegant input handler for express requests/responses to ease the management of input/ouput data

[![Build Status](https://travis-ci.org/fr33d4n/express-ez-input-handler.svg?branch=master)](https://travis-ci.org/fr33d4n/express-ez-input-handler) [![codecov](https://codecov.io/gh/fr33d4n/express-ez-input-handler/branch/master/graph/badge.svg)](https://codecov.io/gh/fr33d4n/express-ez-input-handler)

## Installation
```sh
npm install express-ez-input-handler --save
```

## Basic usage
This is a basic example on how to define and use the validator.

```js
const express = require('express'); // Works with version 3+ of express
const inputHandler = require('express-ez-input-handler');

const app = express();
app.use(express.json()); // Note that this method is available on express v4.16+

const getSchema = {
  title: true,
  tags: true,
  author: true
};

app.get('/news', inputHandler({ schema: getSchema }), (req, res) => {
  console.log(JSON.stringify(req.schema));
  res.send(200);
});

const postSchema = {
  title: true,
  tags: true,
  author: true
};

app.post('/news', inputHandler({ schema: getSchema }), (req, res) => {
  console.log(JSON.stringify(req.schema));
  res.send(200);
});
```

If we make an GET call to /news?title=%express%&tags=node&tags=express&tags=node.js* **OR** a POST call to /news with a body:

```js
{
  title: '%express%',
  tags: ['node', 'express', 'node.js'],
}
```

The log would return, in both cases:

```js
{
  title: '%express%',
  tags: ['node', 'express', 'node.js'],
}
```

By default, this library does not follow strict REST conventions, where GETs cannot have a data in the request body, and POSTs cannot have data in the URL. This library is greedy by default, so any data on the body of a GET request will be fetched, validated and transformed. If you want to disable this behaviour, you should create the middleware like this:

```js
const getSchema = {
  title: true,
  tags: true,
  author: true
};

const options = {
  strict: true
};

app.get('/news', inputHandler({ schema: getSchema, options }), (req, res) => {
  console.log(JSON.stringify(req.schema));
  res.send(200);
});
```

## Better usage

This may prove usefull to avoid getting request data from the 3 sources of the request: query, params and body. But, the real potential of this library is that you can enable different functionalities to avoid lots of tedious and repetitive work. For instance:

### Enabling validation

```js
const express = require('express'); // Works with version 3+ of express
const inputHandler = require('express-ez-input-handler');

const app = express();
app.use(express.json());

const schema = {
  title: {
    required: true,
    string: {
      length: { min: 5, max: 100 }
    }
  },
  tags: {
    required: true,
    array: {
      length: { min: 1, max: 5 },
      string: {
        length: { min: 1, max: 5 },
      }
    }
  },
  author: {
    object: {
      name: {
        required: true,
        string: {
          length: { min: 5, max: 100 }
        }
      },
      age: {
        number: {
          isInteger: true,
          range: { min: 18 }
        }
      }
    }
  }
};

app.post('/news', inputHandler({ schema }), (req, res) => {
  console.log(JSON.stringify(req.schema));
  res.send(200);
});
```

This schema has validation on it. Using [ez-validate.js](https://github.com/fr33d4n/ez-validator.js "Awesome validation!") this library now validates the input **AND** handles [errors](#errors) for you. So, when the input arrives to the controller, its nice, clean, sanitized and validated. You don't have to care about where on the request is the data, or if its valid. 

## Errors

By default, this library returns http standard errors if it should. You can, however, in future versions it will support custom responses

