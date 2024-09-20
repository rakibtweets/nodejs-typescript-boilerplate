import { Schema, Document } from 'mongoose';

// Define an interface for the base schema (if needed)
interface IBaseSchema extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// Create the base schema with TypeScript
const baseSchema = new Schema<IBaseSchema>({
  createdAt: {
    type: Date,
    default: () => new Date(),
    index: true
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
    index: true
  }
});

// Export the baseSchema using TypeScript's module syntax
export { baseSchema };
