const { Validator, Sanitizer } = require('ez-validator.js');

function mergeProperties(propArray) {
  const schema = { ...propArray.splice(0, 1)[0] };
  propArray.forEach((k) => {
    Object.keys(k).forEach((p) => {
      if (schema[p]) {
        if (Array.isArray(schema[p]) && Array.isArray(k[p])) {
          schema[p].push(...k[p]);
          return;
        }

        if (Array.isArray(schema[p])) {
          schema[p].push(k[p]);
          return;
        }

        if (Array.isArray(k[p])) {
          schema[p] = [schema[p], ...k[p]];
          return;
        }

        schema[p] = [schema[p], k[p]];
        return;
      }

      schema[p] = k[p];
    });
  });

  Object.keys(schema).forEach((k) => {
    if (!Array.isArray(schema[k])) return;
    /* Good way to remove array duppes */
    schema[k] = Array.from(new Set(schema[k]));
  });

  return schema;
}

/* We can get the schema from 3 places, [req.params, req.query, req.body] */
function generateInputObject(req, strictMode) {
  if (!strictMode) {
    return mergeProperties([req.query, req.body, req.params]);
  }

  switch (req.method) {
    case 'GET':
      return mergeProperties([req.query, req.params]);
    case 'POST':
      return mergeProperties([req.body]);
    case 'PUT':
    case 'PATCH':
      return mergeProperties([req.params, req.body]);
    case 'DELETE':
      return mergeProperties([req.params]);
    default:
      // no default
  }
}

module.exports = ({ schema = null, options = {} } = {}) => {
  let shouldValidate = true;
  const strictMode = !!options.strict;

  let validator;
  let sanitizer;
  try {
    validator = Validator.build({ taxonomy: schema });
    sanitizer = Sanitizer.build({ taxonomy: schema });
  } catch (e) {
    /* Schema is not a valid taxonomy for the validator AND sanitizer
     * Provide just the basic functionality
     */
    shouldValidate = false;
  }

  return (req, res, next) => {
    let schema = generateInputObject(req, strictMode);
    if (shouldValidate) {
      try {
        validator.validate(schema);
        schema = sanitizer.sanitize(schema);
      } catch (e) {
        return next(e);
      }
    }

    req.schema = schema;
    return next();
  };
};
