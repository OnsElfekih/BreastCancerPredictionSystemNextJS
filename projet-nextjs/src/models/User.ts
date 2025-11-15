// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: "gynécologue" | "patiente";
}

const UserSchema: Schema<IUser> = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["gynécologue", "patiente"], required: true },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
