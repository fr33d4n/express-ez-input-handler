const { expect } = require('chai');

const main = require('../../src/main');

describe('main', () => {
  it('should return a middleware with no validation, sanitization or strictMode', () => {
    const middleware = main();

    const mockRequest = {
      method: 'GET',
      params: {
        userId: 21,
      },
      query: {
        userId: 23,
        clientId: [1, 2, 3, 4],
        saleId: 12,
      },
      body: {
        clientId: [1, 2, 6],
        userId: 13,
        username: 'john',
        password: 'asdf',
        saleId: [40, 41]
      }
    };

    middleware(mockRequest, {}, (err) => {
      expect(err).not.to.be.a('error');
      expect(mockRequest.schema).to.deep.property('userId', [23, 13, 21]);
      expect(mockRequest.schema).to.deep.property('clientId', [1, 2, 3, 4, 6]);
      expect(mockRequest.schema).to.deep.property('username', 'john');
      expect(mockRequest.schema).to.deep.property('password', 'asdf');
      expect(mockRequest.schema).to.deep.property('saleId', [12, 40, 41]);
    });
  });

  it('should return a middleware with validation, sanitization and strictMode on GET method', () => {
    const schema = {
      userId: {
        number: true
      },
      clientId: {
        array: {
          number: true,
          length: { min: 1, max: 4 }
        }
      },
      username: {
        string: {
          length: { min: 3, max: 255 }
        }
      },
      password: {
        string: {
          length: { min: 8, max: 25 }
        }
      },
    };
    const middleware = main({ schema, options: { strict: true } });

    const mockRequest = {
      method: 'GET',
      params: {
        userId: 21,
      },
      query: {
        clientId: [3, 4],
      },
      body: {
        clientId: [1, 2],
        username: 'john',
        password: 'asdfasdf',
      }
    };

    middleware(mockRequest, {}, (err) => {
      expect(err).not.to.be.a('error');
      expect(mockRequest.schema).to.deep.property('userId', 21);
      expect(mockRequest.schema).to.deep.property('clientId', [3, 4]);
      expect(mockRequest.schema).not.to.deep.property('username', 'john');
      expect(mockRequest.schema).not.to.deep.property('password', 'asdfasdf');
    });
  });

  it('should return a middleware with validation, sanitization and strictMode on GET method', () => {
    const schema = {
      userId: {
        number: true
      },
      clientId: {
        array: {
          number: true,
          length: { min: 1, max: 4 }
        }
      },
      username: {
        string: {
          length: { min: 3, max: 255 }
        }
      },
      password: {
        string: {
          length: { min: 8, max: 25 }
        }
      },
    };
    const middleware = main({ schema, options: { strict: true } });

    const mockRequest = {
      method: 'POST',
      params: {
        userId: 21,
      },
      query: {
        clientId: [3, 4],
      },
      body: {
        clientId: [1, 2],
        username: 'john',
        password: 'asdfasdf',
      }
    };

    middleware(mockRequest, {}, (err) => {
      expect(err).not.to.be.a('error');
      expect(Object.keys(mockRequest.schema).length).to.equal(3);
      expect(mockRequest.schema).to.deep.property('clientId', [1, 2]);
      expect(mockRequest.schema).to.deep.property('username', 'john');
      expect(mockRequest.schema).to.deep.property('password', 'asdfasdf');
    });
  });

  it('should return a middleware with validation, sanitization and strictMode on GET method', () => {
    const schema = {
      userId: {
        number: true
      },
      clientId: {
        array: {
          number: true,
          length: { min: 1, max: 4 }
        }
      },
      username: {
        string: {
          length: { min: 3, max: 255 }
        }
      },
      password: {
        string: {
          length: { min: 8, max: 25 }
        }
      },
    };
    const middleware = main({ schema, options: { strict: true } });

    const mockRequest = {
      method: 'PUT',
      params: {
        userId: 21,
      },
      query: {
        clientId: [3, 4],
      },
      body: {
        clientId: [1, 2],
        username: 'john',
        password: 'asdfasdf',
      }
    };

    middleware(mockRequest, {}, (err) => {
      expect(err).not.to.be.a('error');
      expect(Object.keys(mockRequest.schema).length).to.equal(4);
      expect(mockRequest.schema).to.deep.property('userId', 21);
      expect(mockRequest.schema).to.deep.property('clientId', [1, 2]);
      expect(mockRequest.schema).to.deep.property('username', 'john');
      expect(mockRequest.schema).to.deep.property('password', 'asdfasdf');
    });
  });

  it('should return a middleware with validation, sanitization and strictMode on GET method', () => {
    const schema = {
      userId: {
        number: true
      },
      clientId: {
        array: {
          number: true,
          length: { min: 1, max: 4 }
        }
      },
      username: {
        string: {
          length: { min: 3, max: 255 }
        }
      },
      password: {
        string: {
          length: { min: 8, max: 25 }
        }
      },
    };
    const middleware = main({ schema, options: { strict: true } });

    const mockRequest = {
      method: 'DELETE',
      params: {
        userId: 21,
      },
      query: {
        clientId: [3, 4],
      },
      body: {
        clientId: [1, 2],
        username: 'john',
        password: 'asdfasdf',
      }
    };

    middleware(mockRequest, {}, (err) => {
      expect(err).not.to.be.a('error');
      expect(Object.keys(mockRequest.schema).length).to.equal(1);
      expect(mockRequest.schema).to.deep.property('userId', 21);
    });
  });
});
