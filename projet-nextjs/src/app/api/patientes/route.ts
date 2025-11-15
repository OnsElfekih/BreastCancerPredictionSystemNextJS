import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Patiente from "@/models/IPatiente";
import bcrypt from "bcryptjs";

/* ----------------------- POST ---------------------- */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const requiredFields = ["nom", "prenom", "email", "password", "idDossierMedical", "dateDeNaissance"];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return NextResponse.json({ message: `Le champ "${field}" est obligatoire` }, { status: 400 });
      }
    }

    const dateNaissance = new Date(body.dateDeNaissance);
    if (isNaN(dateNaissance.getTime())) {
      return NextResponse.json({ message: "Date de naissance invalide" }, { status: 400 });
    }

    const hash = await bcrypt.hash(body.password, 10);

    const newUser = await User.create({
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      password: hash,
      role: "patiente" // Ajout du rôle pour passer la validation
    });

    const newPatiente = await Patiente.create({
      idDossierMedical: body.idDossierMedical,
      dateDeNaissance: dateNaissance,
      userId: newUser._id
    });

const newPatientePopulated = await newPatiente.populate("userId", "nom prenom email");

return NextResponse.json(
  { message: "Patiente créée", patiente: newPatientePopulated },
  { status: 201 }
);
  } catch (error: any) {
    console.error("POST /api/patientes error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ message: "Email déjà utilisé" }, { status: 400 });
    }
    return NextResponse.json({ message: "Erreur ajout", error: String(error) }, { status: 500 });
  }
}

/* ----------------------- GET ---------------------- */
export async function GET() {
  try {
    await dbConnect();
    const patientes = await Patiente.find()
      .populate("userId", "nom prenom email")
      .lean();

    return NextResponse.json(patientes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur récupération", error: String(error) }, { status: 500 });
  }
}

/* ----------------------- DELETE ---------------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const patiente = await Patiente.findById(id);
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const userId = patiente.userId;

    await Patiente.findByIdAndDelete(id);
    if (userId) await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Patiente et utilisateur supprimés" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur suppression", error: String(error) }, { status: 500 });
  }
}

/* ----------------------- PUT ---------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const patiente = await Patiente.findById(id).populate("userId");
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const userUpdate: any = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email
    };

    if (body.password && body.password.trim() !== "") {
      const hash = await bcrypt.hash(body.password, 10);
      userUpdate.password = hash;
    }

    await User.findByIdAndUpdate(patiente.userId._id, userUpdate);

    patiente.idDossierMedical = body.idDossierMedical;
    patiente.dateDeNaissance = new Date(body.dateDeNaissance);

    await patiente.save();
    await patiente.populate("userId", "nom prenom email");

    return NextResponse.json({ message: "Patiente mise à jour", patiente }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur mise à jour", error: String(error) }, { status: 500 });
  }
}
