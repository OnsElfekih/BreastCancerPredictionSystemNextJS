// Route API pour GET et POST /api/patientes
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Patiente from "@/models/IPatiente";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();
    const patientes = await Patiente.find().populate("userId", "nom prenom email").lean();
    return NextResponse.json(patientes, { status: 200 });
  } catch (error) {
    console.error("GET /api/patientes error:", error);
    return NextResponse.json({ message: "Erreur lors de la récupération", error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { nom, prenom, email, password, dateDeNaissance, idDossierMedical } = body;

    // validations minimales
    if (!nom || !prenom || !email || !password || !dateDeNaissance || !idDossierMedical) {
      return NextResponse.json({ message: "Tous les champs sont obligatoires" }, { status: 400 });
    }

    // Vérifier unicité email et idDossierMedical
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email déjà utilisé" }, { status: 400 });
    }
    const existingDossier = await Patiente.findOne({ idDossierMedical });
    if (existingDossier) {
      return NextResponse.json({ message: "ID dossier déjà utilisé" }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer user
    const user = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role: "patiente",
    });
    await user.save();

    // Créer patiente (convertir date)
    const date = new Date(dateDeNaissance);
    const patiente = new Patiente({
      userId: user._id,
      dateDeNaissance: date,
      idDossierMedical,
    });
    await patiente.save();

    // peupler le user avant renvoi
    await patiente.populate("userId", "nom prenom email");

    return NextResponse.json({ message: "Patiente créée avec succès", patiente }, { status: 201 });
  } catch (error) {
    console.error("POST /api/patientes error:", error);
    // Si erreur de validation mongoose (duplicate key) -> 400
    const errMsg = (error as any)?.message || String(error);
    return NextResponse.json({ message: "Erreur lors de la création", error: errMsg }, { status: 500 });
  }
}
