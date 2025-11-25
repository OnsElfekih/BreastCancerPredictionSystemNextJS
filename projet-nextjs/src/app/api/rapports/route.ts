import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import DonneesCliniques from "@/models/IClinicalData";
import Patiente from "@/models/IPatiente";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = verifyToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const patientes = await Patiente.find({ gynecoId: user.userId }).populate("userId");

    const rapports = await Promise.all(
      patientes.map(async (p) => {
        const donnees = await DonneesCliniques.find({ patienteId: p._id }).sort({ dateSaisie: -1 });
        return donnees.map((d) => ({
          _id: d._id.toString(),
          patienteNom: `${(p.userId as any).nom} ${(p.userId as any).prenom}`,
          dateSaisie: d.dateSaisie,
          url: `/api/rapports/${d._id}/pdf` // correspond au route PDF
        }));
      })
    );

    return NextResponse.json(rapports.flat(), { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Erreur récupération rapports", error: e.message }, { status: 500 });
  }
}
