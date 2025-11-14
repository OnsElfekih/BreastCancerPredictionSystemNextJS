import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Patiente from "@/models/IPatiente";

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
