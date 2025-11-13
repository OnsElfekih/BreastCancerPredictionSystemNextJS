import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatiente extends Document {
  userId: mongoose.Types.ObjectId; // référence vers l'utilisateur dans User
  dateDeNaissance: Date;
  idDossierMedical: string;
}

const PatienteSchema: Schema<IPatiente> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  dateDeNaissance: { type: Date, required: true },
  idDossierMedical: { type: String, required: true, unique: true },
});

const Patiente: Model<IPatiente> =
  mongoose.models.Patiente || mongoose.model<IPatiente>("Patiente", PatienteSchema);

export default Patiente;
