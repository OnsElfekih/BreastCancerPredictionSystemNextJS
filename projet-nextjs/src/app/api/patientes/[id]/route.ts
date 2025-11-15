import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Patiente from "@/models/IPatiente";
import bcrypt from "bcryptjs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id: patienteId } = await params;

    const patiente = await Patiente.findById(patienteId);
    if (!patiente) {
      return NextResponse.json(
        { message: "Patiente introuvable" },
        { status: 404 }
      );
    }

    const userId = patiente.userId;

    await Patiente.findByIdAndDelete(patienteId);
    if (userId) await User.findByIdAndDelete(userId);

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

/* --------------------- PUT UPDATE ----------------------- */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const patiente = await Patiente.findById(id).populate("userId");
    if (!patiente) {
      return NextResponse.json(
        { message: "Patiente introuvable" },
        { status: 404 }
      );
    }

    /* -------- UPDATE USER -------- */

    const userUpdate: any = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
    };

    // garder mot de passe si vide
    if (body.password && body.password.trim() !== "") {
      const hash = await bcrypt.hash(body.password, 10);
      userUpdate.password = hash;
    }

    await User.findByIdAndUpdate(patiente.userId._id, userUpdate);

    /* -------- UPDATE PATIENTE -------- */

    patiente.idDossierMedical = body.idDossierMedical; // modifiable  
    patiente.dateDeNaissance = new Date(body.dateDeNaissance);

    await patiente.save();
    await patiente.populate("userId", "nom prenom email");

    return NextResponse.json(
      { message: "Patiente mise à jour", patiente },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour", error: String(error) },
      { status: 500 }
    );
  }
}
