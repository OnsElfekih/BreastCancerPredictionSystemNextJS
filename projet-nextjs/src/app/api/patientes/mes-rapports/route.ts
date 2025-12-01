// patientes/mes-rapports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patiente from "@/models/IPatiente";
import DonneesCliniques from "@/models/IClinicalData";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authUser = verifyToken(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patiente = await Patiente.findOne({ userId: authUser.userId });
    if (!patiente) return NextResponse.json({ message: "Patiente introuvable" }, { status: 404 });

    const rapports = await DonneesCliniques.find({ patienteId: patiente._id }).sort({ dateSaisie: -1 });

    const result = rapports.map((d) => ({
      _id: d._id.toString(),
      dateSaisie: d.dateSaisie,
      url: `/api/rapports/${d._id}/pdf`,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur récupération rapports", error: e.message }, { status: 500 });
  }
}
