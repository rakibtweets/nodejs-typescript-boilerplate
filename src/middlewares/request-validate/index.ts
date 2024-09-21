import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi'; // Assuming you're using Joi for validation
import logger from '../../libraries/log/logger';

interface ValidateRequestOptions {
  schema: Schema;
  isParam?: boolean;
}

function validateRequest({ schema, isParam = false }: ValidateRequestOptions) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const input = isParam ? req.params : req.body;
    const validationResult = schema.validate(input, { abortEarly: false });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(
        (detail) => detail.message
      );

      logger.error(`${req.method} ${req.originalUrl} Validation failed`, {
        errors: errorMessages
      });

      // Handle validation error
      return res.status(400).json({
        errors: errorMessages
      });
    }

    // Validation successful - proceed
    next();
  };
}

export { validateRequest };
