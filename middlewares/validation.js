const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "Minimum of 2 characters required",
      "string.max": "30 character maximum",
      "string.empty": 'The "name" field must be filled',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be valid',
      "string.empty": 'The "avatar" field must be filled',
    }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "Minimum of 2 characters required",
      "string.max": "30 character maximum",
      "string.empty": 'The "name" field must be filled',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be valid',
      "string.empty": 'The "avatar" field must be filled',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be valid',
      "string.empty": 'The "email" field must be filled',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be valid',
      "string.empty": 'The "email" field must be filled',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled',
    }),
  }),
});

const validatecreateItems = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "Minimum of 2 characters required",
      "string.max": "30 character maximum",
      "string.empty": 'The "name" field must be filled',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'The "imageUrl" field must be valid',
      "string.empty": 'The "imageUrl" field must be filled',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string()
      .length(24)
      .regex(/^[A-Fa-f0-9]{24}$/)
      .messages({
        "string.length": 'The "id" field does not have a vaild length',
      }),
  }),
});

module.exports = {
  validateUpdateUser,
  validateCreateUser,
  validateLogin,
  validatecreateItems,
  validateId,
};
