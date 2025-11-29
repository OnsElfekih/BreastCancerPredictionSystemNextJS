import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import DonneesCliniques from "@/models/IClinicalData";
import Patiente from "@/models/IPatiente";
import { buildMedicalReport } from "@/utils/buildMedicalReport";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "id manquant" }, { status: 400 });
    }

    await dbConnect();

    const donnee = await DonneesCliniques.findById(id);
    if (!donnee) {
      return NextResponse.json({ error: "Donnée introuvable" }, { status: 404 });
    }

    const patiente = await Patiente.findById(donnee.patienteId).populate(
      "userId",
      "nom prenom email"
    );

    if (!patiente || !patiente.userId) {
      return NextResponse.json({ error: "Patiente introuvable" }, { status: 404 });
    }

    const user = patiente.userId as any;

    const pdfBuffer = await buildMedicalReport(user, donnee);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${user.nom}_${user.prenom}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur PDF:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la génération PDF" },
      { status: 500 }
    );
  }
}
