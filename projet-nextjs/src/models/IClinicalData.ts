import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonneesCliniques extends Document {
  patienteId: mongoose.Types.ObjectId;
  dateSaisie: Date;
  age: number;
  BMI: number;
  glucose: number;
  insulin: number;
  HOMA: number;
  leptin: number;
  adiponectin: number;
  resistin: number;
  MCP1: number;
}

const DonneesCliniquesSchema: Schema<IDonneesCliniques> = new Schema({
  patienteId: { type: Schema.Types.ObjectId, ref: "Patiente", required: true },
  dateSaisie: { type: Date, default: Date.now },
  age: { type: Number, required: true },
  BMI: { type: Number, required: true },
  glucose: { type: Number, required: true },
  insulin: { type: Number, required: true },
  HOMA: { type: Number, required: true },
  leptin: { type: Number, required: true },
  adiponectin: { type: Number, required: true },
  resistin: { type: Number, required: true },
  MCP1: { type: Number, required: true },
});

const DonneesCliniques: Model<IDonneesCliniques> =
  mongoose.models.DonneesCliniques || mongoose.model<IDonneesCliniques>("DonneesCliniques", DonneesCliniquesSchema);

export default DonneesCliniques;
