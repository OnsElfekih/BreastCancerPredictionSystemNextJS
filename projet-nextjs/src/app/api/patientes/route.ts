// src/app/api/patientes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb"; // ta connexion
import User from "@/models/User";
import Patiente from "@/models/IPatiente";

dbConnect();

export async function GET() {
  try {
    const patientes = await Patiente.find().populate("userId", "nom prenom email");
    return NextResponse.json(patientes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la récupération", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nom, prenom, email, password, dateDeNaissance, idDossierMedical } = await req.json();

    const user = new User({ nom, prenom, email, password, role: "patiente" });
    await user.save();

    const patiente = new Patiente({
      userId: user._id,
      dateDeNaissance,
      idDossierMedical,
    });
    await patiente.save();

    return NextResponse.json({ message: "Patiente créée avec succès", patiente }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la création", error }, { status: 500 });
  }
}
