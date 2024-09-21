import Joi from 'joi';
import mongoose from 'mongoose';

const createSchema = Joi.object().keys({
  name: Joi.string().required()
  // other properties
});

const updateSchema = Joi.object().keys({
  name: Joi.string()
  // other properties
});

const idSchema = Joi.object().keys({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .required()
});

export { createSchema, updateSchema, idSchema };
