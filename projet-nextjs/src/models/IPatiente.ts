// models/IPatiente.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatiente extends Document {
  userId: mongoose.Types.ObjectId;       // gynécologue qui ajoute la patiente
  dateDeNaissance: Date;
  idDossierMedical: string;
  gynecoId: mongoose.Types.ObjectId;     // identifiant du gynécologue
}

const PatienteSchema: Schema<IPatiente> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dateDeNaissance: { type: Date, required: true },
  idDossierMedical: { type: String, required: true, unique: true },
  gynecoId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Patiente: Model<IPatiente> = mongoose.models.Patiente || mongoose.model<IPatiente>("Patiente", PatienteSchema);
export default Patiente;
