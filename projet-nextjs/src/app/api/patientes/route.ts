import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Patiente from "@/models/IPatiente";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();
    const patientes = await Patiente.find()
      .populate("userId", "nom prenom email")
      .lean();

    return NextResponse.json(patientes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { nom, prenom, email, password, dateDeNaissance, idDossierMedical } =
      body;

    if (!nom || !prenom || !email || !password || !dateDeNaissance || !idDossierMedical) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email déjà utilisé" },
        { status: 400 }
      );
    }

    const existingDossier = await Patiente.findOne({ idDossierMedical });
    if (existingDossier) {
      return NextResponse.json(
        { message: "ID dossier déjà utilisé" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      nom,
      prenom,
      email,
      password: hash,
      role: "patiente",
    });

    await user.save();

    const patiente = new Patiente({
      userId: user._id,
      dateDeNaissance: new Date(dateDeNaissance),
      idDossierMedical,
    });

    await patiente.save();
    await patiente.populate("userId", "nom prenom email");

    return NextResponse.json(
      { message: "Patiente créée avec succès", patiente },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création", error: String(error) },
      { status: 500 }
    );
  }
}
