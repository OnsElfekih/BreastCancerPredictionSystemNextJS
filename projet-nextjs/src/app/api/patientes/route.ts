import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patiente from "@/models/IPatiente";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

/* ---------- POST : créer une patiente ---------- */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const required = ["nom", "prenom", "email", "password", "idDossierMedical", "dateDeNaissance"];
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ message: `Champ ${f} obligatoire` }, { status: 400 });
    }

    const date = new Date(body.dateDeNaissance);
    if (isNaN(date.getTime()) || date > new Date()) {
      return NextResponse.json({ message: "Date de naissance invalide" }, { status: 400 });
    }

    const hash = await bcrypt.hash(body.password, 10);

    const newUser = await User.create({
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      password: hash,
      role: "patiente"
    });

    const patiente = await Patiente.create({
      idDossierMedical: body.idDossierMedical,
      dateDeNaissance: date,
      userId: newUser._id,
      gynecoId: user.userId
    });

    const full = await patiente.populate("userId", "nom prenom email");

    return NextResponse.json({ message: "Patiente créée", patiente: full }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

/* ---------- GET : liste filtrée par gynéco ---------- */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patientes = await Patiente.find({ gynecoId: user.userId })
      .populate("userId", "nom prenom email")
      .lean();

    return NextResponse.json(patientes, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur récupération" }, { status: 500 });
  }
}
