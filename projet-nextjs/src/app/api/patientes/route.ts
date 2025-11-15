import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"
import Patiente from "@/models/IPatiente"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()

    const hash = await bcrypt.hash(body.password, 10)

    const newUser = await User.create({
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      password: hash
    })

    const newPatiente = await Patiente.create({
      idDossierMedical: body.idDossierMedical,
      dateDeNaissance: new Date(body.dateDeNaissance),
      userId: newUser._id
    })

    return NextResponse.json(
      { message: "Patiente créée", patiente: newPatiente },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de l'ajout", error: String(error) },
      { status: 500 }
    )
  }
}
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