import mongoose, { Schema, Document, Model } from "mongoose";

// Interface TypeScript pour le modèle User
export interface IUser extends Document {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role:"gynécologue" | "patiente";
}

// Schéma Mongoose
const UserSchema: Schema<IUser> = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["gynécologue", "patiente"], required: true },
});

// Vérifier si le modèle existe déjà pour éviter l'erreur de recompilation
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
