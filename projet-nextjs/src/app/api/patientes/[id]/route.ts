import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patiente from "@/models/IPatiente";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { Types } from "mongoose";

/* ---------- PUT ---------- */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const resolvedParams = await params; // Déballer la promesse
    const id = resolvedParams.id;

    const user = verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!Types.ObjectId.isValid(id))
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });

    const body = await req.json();

    const patiente = await Patiente.findOne({ _id: new Types.ObjectId(id), gynecoId: user.userId }).populate("userId");
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const updates: any = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email
    };

    if (body.password && body.password.trim() !== "") {
      updates.password = await bcrypt.hash(body.password, 10);
    }

    await User.findByIdAndUpdate(patiente.userId._id, updates);

    patiente.idDossierMedical = body.idDossierMedical;
    patiente.dateDeNaissance = new Date(body.dateDeNaissance);

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
    await dbConnect();

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const user = verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!Types.ObjectId.isValid(id))
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });

    const patiente = await Patiente.findOne({ _id: new Types.ObjectId(id), gynecoId: user.userId });
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const userId = patiente.userId;

    await Patiente.findByIdAndDelete(patiente._id);
    if (userId) await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Patiente supprimée" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur suppression", error: e.message }, { status: 500 });
  }
}

