import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patiente from "@/models/IPatiente";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { Types } from "mongoose";

/* ---------- GET ---------- */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authUser = verifyToken(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patientes = await Patiente.find({ gynecoId: authUser.userId })
      .populate("userId", "nom prenom email")
      .lean();

    return NextResponse.json(patientes, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur récupération", error: e.message }, { status: 500 });
  }
}

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const requiredFields = ["nom", "prenom", "email", "password", "idDossierMedical", "dateDeNaissance"];
    for (const field of requiredFields) {
      if (!body[field]) return NextResponse.json({ message: `Le champ ${field} est obligatoire` }, { status: 400 });
    }

    let user = await User.findOne({ email: body.email });
    if (!user) {
      user = new User({
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        role: "patiente"
      });
      await user.save();
    }

    const authUser = verifyToken(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patiente = new Patiente({
      idDossierMedical: body.idDossierMedical,
      dateDeNaissance: new Date(body.dateDeNaissance),
      visites: body.visites || 1,
      userId: user._id,
      gynecoId: authUser.userId
    });

    await patiente.save();
    const fullPatiente = await patiente.populate("userId", "nom prenom email");

    return NextResponse.json({ patiente: fullPatiente }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Erreur serveur", error: err.message }, { status: 500 });
  }
}

/* ---------- PUT ---------- */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const authUser = verifyToken(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ message: "ID invalide" }, { status: 400 });

    const body = await req.json();
    const patiente = await Patiente.findOne({ _id: id, gynecoId: authUser.userId }).populate("userId", "nom prenom email");
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const updates: any = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email
    };
    if (body.password?.trim()) updates.password = await bcrypt.hash(body.password, 10);

    await User.findByIdAndUpdate(patiente.userId._id, updates, { new: true });

    patiente.idDossierMedical = body.idDossierMedical;
    patiente.dateDeNaissance = new Date(body.dateDeNaissance);
    if (body.visites !== undefined) patiente.visites = body.visites;
    if (body.incrementVisite) patiente.visites += 1;

    await patiente.save();
    const fullPatiente = await patiente.populate("userId", "nom prenom email");

    return NextResponse.json({ message: "Patiente mise à jour", patiente: fullPatiente }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur mise à jour", error: e.message }, { status: 500 });
  }
}

/* ---------- DELETE ---------- */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const authUser = verifyToken(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ message: "ID invalide" }, { status: 400 });

    const patiente = await Patiente.findOne({ _id: id, gynecoId: authUser.userId });
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const userId = patiente.userId;

    await Patiente.findByIdAndDelete(id);
    if (userId) await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Patiente supprimée" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur suppression", error: e.message }, { status: 500 });
  }
}
