import mongoose, { Schema, Document, Model } from 'mongoose';
import { baseSchema } from '../../libraries/db/base-schema';

// Define an interface for the Product document
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
}

// Create the schema with TypeScript
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true }
});

// Add the base schema properties
productSchema.add(baseSchema);

// Create and export the model
const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
  'Product',
  productSchema
);

export default ProductModel;
