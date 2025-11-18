import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatiente extends Document {
  userId: mongoose.Types.ObjectId;
  dateDeNaissance: Date;
  idDossierMedical: string;
  gynecoId: mongoose.Types.ObjectId;
  visites: number;
}

const PatienteSchema: Schema<IPatiente> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dateDeNaissance: { type: Date, required: true },
  idDossierMedical: { type: String, required: true, unique: true },
  gynecoId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  visites: { type: Number, default: 1 }
});

const Patiente: Model<IPatiente> = mongoose.models.Patiente || mongoose.model<IPatiente>("Patiente", PatienteSchema);
export default Patiente;
