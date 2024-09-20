import Joi, { ObjectSchema } from 'joi';
import mongoose from 'mongoose';

// Create a Joi schema for creating a product
const createSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  inStock: Joi.boolean().optional()
});

// Create a Joi schema for updating a product
const updateSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  inStock: Joi.boolean()
});

// Create a Joi schema for validating MongoDB ObjectIds
const idSchema: ObjectSchema = Joi.object().keys({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .required()
});

// Export the schemas
export { createSchema, updateSchema, idSchema };
