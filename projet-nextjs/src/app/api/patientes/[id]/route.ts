import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"
import Patiente from "@/models/IPatiente"
import bcrypt from "bcryptjs"

/* ----------------------- DELETE ---------------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()

    const { id } = await params

    const patiente = await Patiente.findById(id)
    if (!patiente) {
      return NextResponse.json(
        { message: "Patiente introuvable" },
        { status: 404 }
      )
    }

    const userId = patiente.userId

    await Patiente.findByIdAndDelete(id)
    if (userId) await User.findByIdAndDelete(userId)

    return NextResponse.json(
      { message: "Patiente et utilisateur supprimés" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur suppression", error: String(error) },
      { status: 500 }
    )
  }
}

/* ----------------------- UPDATE PUT ---------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const body = await req.json()

    const patiente = await Patiente.findById(id).populate("userId")
    if (!patiente) {
      return NextResponse.json(
        { message: "Patiente introuvable" },
        { status: 404 }
      )
    }

    const userUpdate: any = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email
    }

    if (body.password && body.password.trim() !== "") {
      const hash = await bcrypt.hash(body.password, 10)
      userUpdate.password = hash
    }

    await User.findByIdAndUpdate(patiente.userId._id, userUpdate)

    patiente.idDossierMedical = body.idDossierMedical
    patiente.dateDeNaissance = new Date(body.dateDeNaissance)

    await patiente.save()
    await patiente.populate("userId", "nom prenom email")

    return NextResponse.json(
      { message: "Patiente mise à jour", patiente },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur mise à jour", error: String(error) },
      { status: 500 }
    )
  }
}
