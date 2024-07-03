import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  name: string;
  description: string;
  publishDate: Date;
  price: number;
}

const bookSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  publishDate: { type: Date, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model<IBook>("Book", bookSchema);
