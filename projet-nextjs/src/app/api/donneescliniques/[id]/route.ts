import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import DonneesCliniques from "@/models/IClinicalData";
import Patiente from "@/models/IPatiente";
import { dbConnect } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { IDonneesCliniques } from "@/models/IClinicalData";

// POST : Ajouter données cliniques
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: patienteId } = await params;

    if (!Types.ObjectId.isValid(patienteId))
      return NextResponse.json({ message: "ID Patiente invalide" }, { status: 400 });

    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patiente = await Patiente.findOne({ _id: patienteId, gynecoId: user.userId });
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const body = await req.json();
    const donnee = new DonneesCliniques({ patienteId, dateSaisie: new Date(), ...body });
    await donnee.save();

    return NextResponse.json(donnee, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur ajout données", error: e.message }, { status: 500 });
  }
}

// GET : Liste des données cliniques
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: patienteId } = await params;

    if (!Types.ObjectId.isValid(patienteId))
      return NextResponse.json({ message: "ID Patiente invalide" }, { status: 400 });

    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patiente = await Patiente.findOne({ _id: patienteId, gynecoId: user.userId });
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const donnees = await DonneesCliniques.find({ patienteId }).sort({ dateSaisie: -1 });
    return NextResponse.json(donnees, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur récupération données", error: e.message }, { status: 500 });
  }
}

// PUT : Mettre à jour une donnée clinique
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: donneeId } = await params;

    if (!Types.ObjectId.isValid(donneeId))
      return NextResponse.json({ message: "ID Donnée invalide" }, { status: 400 });

    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const donnee = await DonneesCliniques.findById(donneeId);
    if (!donnee) return NextResponse.json({ message: "Donnée introuvable" }, { status: 404 });

    const body = await req.json();
    const champs: (keyof IDonneesCliniques)[] = ["age","BMI","glucose","insulin","HOMA","leptin","adiponectin","resistin","MCP1"];
    champs.forEach(c => { if (body[c] !== undefined) (donnee as any)[c] = body[c]; });

    await donnee.save();
    return NextResponse.json(donnee, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur mise à jour donnée", error: e.message }, { status: 500 });
  }
}
