import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Patiente from "@/models/IPatiente";
import bcrypt from "bcryptjs"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    await dbConnect();

    const { id: patienteId } = await params; // unwrap the promise

    const patiente = await Patiente.findById(patienteId);

    if (!patiente) {
      return NextResponse.json(
        { message: "Patiente introuvable" },
        { status: 404 }
      );
    }

    const userId = patiente.userId;

    await Patiente.findByIdAndDelete(patienteId);

    if (userId) {
      await User.findByIdAndDelete(userId);
    }

    return NextResponse.json(
      { message: "Patiente et utilisateur supprimés avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la suppression", error: String(error) },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await req.json()

    const patiente = await Patiente.findById(id).populate("userId")
    if (!patiente) {
      return NextResponse.json(
        { message: "Patiente introuvable" },
        { status: 404 }
      )
    }

    const userUpdate = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email
    }

    await User.findByIdAndUpdate(patiente.userId._id, userUpdate)

    // ID dossier NON modifié
    // patiente.idDossierMedical reste comme il est

    patiente.dateDeNaissance = new Date(body.dateDeNaissance)
    await patiente.save()
    await patiente.populate("userId", "nom prenom email email")

    return NextResponse.json(
      { message: "Patiente mise à jour", patiente },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour", error: String(error) },
      { status: 500 }
    )
  }
}





