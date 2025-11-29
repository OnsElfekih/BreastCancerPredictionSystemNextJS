import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import { dbConnect } from "@/lib/mongodb";
import DonneesCliniques from "@/models/IClinicalData";
import Patiente from "@/models/IPatiente";
import fs from "fs";

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

    // Récupérer les données cliniques
    const donnee = await DonneesCliniques.findById(id);
    if (!donnee) {
      return NextResponse.json({ error: "Donnée introuvable" }, { status: 404 });
    }

    // Récupérer la patiente et son userId pour nom/prenom/email
    const patiente = await Patiente.findById(donnee.patienteId).populate("userId", "nom prenom email");
    if (!patiente || !patiente.userId) {
      return NextResponse.json({ error: "Patiente introuvable" }, { status: 404 });
    }
    const user = patiente.userId as any;

    const fontPath = path.join(process.cwd(), "public/fonts/times.ttf");
    if (!fs.existsSync(fontPath)) {
      return NextResponse.json({ error: "Police introuvable" }, { status: 500 });
    }

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ font: fontPath });

      doc.font(fontPath);

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(18).text(`Rapport Médical de la patiente ${user.nom} ${user.prenom}`);
      doc.moveDown();
      doc.text(`Patiente: ${user.nom} ${user.prenom}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Age: ${donnee.age}`);
      doc.text(`BMI: ${donnee.BMI}`);
      doc.text(`Glucose: ${donnee.glucose}`);
      doc.text(`Insulin: ${donnee.insulin}`);
      doc.text(`HOMA: ${donnee.HOMA}`);
      doc.text(`Leptin: ${donnee.leptin}`);
      doc.text(`Adiponectin: ${donnee.adiponectin}`);
      doc.text(`Resistin: ${donnee.resistin}`);
      doc.text(`MCP1: ${donnee.MCP1}`);

      doc.end();
    });

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
