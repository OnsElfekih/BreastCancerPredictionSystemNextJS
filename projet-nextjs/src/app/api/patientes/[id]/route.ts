import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patiente from "@/models/IPatiente";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { Types } from "mongoose";

// Helper pour extraire l'id
async function resolveId(params: Promise<{ id: string }>): Promise<string> {
  const p = await params;
  const id = p.id;
  if (!id) throw new Error("ID manquant dans params");
  return id;
}

/* ---------- PUT ---------- */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await resolveId(params);

    await dbConnect();

    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ message: "ID invalide" }, { status: 400 });

    const body = await req.json();
    const patiente = await Patiente.findOne({ _id: id, gynecoId: user.userId }).populate("userId");
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const updates: Partial<{ nom: string; prenom: string; email: string; password: string }> = {};
    if (body.nom) updates.nom = body.nom;
    if (body.prenom) updates.prenom = body.prenom;
    if (body.email) updates.email = body.email;
    if (body.password?.trim()) updates.password = await bcrypt.hash(body.password, 10);

    await User.findByIdAndUpdate(patiente.userId._id, updates);

    if (body.idDossierMedical) patiente.idDossierMedical = body.idDossierMedical;
    if (body.dateDeNaissance) patiente.dateDeNaissance = new Date(body.dateDeNaissance);
    if (body.visites !== undefined) patiente.visites = body.visites;
    if (body.incrementVisite) patiente.visites += 1;

    await patiente.save();
    const full = await patiente.populate("userId", "nom prenom email");

    return NextResponse.json({ message: "Patiente mise à jour", patiente: full }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur mise à jour", error: e.message }, { status: 500 });
  }
}

/* ---------- DELETE ---------- */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await resolveId(params);

    await dbConnect();

    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ message: "ID invalide" }, { status: 400 });

    const patiente = await Patiente.findOne({ _id: id, gynecoId: user.userId });
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const userId = patiente.userId;

    await Patiente.findByIdAndDelete(id);
    if (userId) await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Patiente supprimée" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur suppression", error: e.message }, { status: 500 });
  }
}
