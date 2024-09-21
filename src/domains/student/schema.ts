import mongoose, { Model, Schema } from 'mongoose';
import { baseSchema } from '../../libraries/db/base-schema';

// Define an interface for the Product document
export interface IStudent extends Document {
  name: string;
}

const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true }
  // other properties
});

studentSchema.add(baseSchema);

// Create and export the model
const StudentModel: Model<IStudent> = mongoose.model<IStudent>(
  'Student',
  studentSchema
);

export default StudentModel;
