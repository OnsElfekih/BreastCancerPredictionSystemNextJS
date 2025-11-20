import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patiente from "@/models/IPatiente";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authUser = verifyToken(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patientes = await Patiente.find({ gynecoId: authUser.userId }).lean();

    const nouvellesVisites = patientes.filter(p => p.visites === 1).length;
    const visitesRecurrentes = patientes.filter(p => p.visites > 1).length;

    return NextResponse.json({ nouvellesVisites, visitesRecurrentes }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Erreur récupération statistiques", error: e.message },
      { status: 500 }
    );
  }
}
