import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { dbConnect } from "@/lib/mongodb";
import DonneeClinique from "@/models/IClinicalData";

// Typage correct pour Next App Router
interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "id manquant" },
        { status: 400 }
      );
    }

    await dbConnect();

    const donnee = await DonneeClinique.findById(id);

    if (!donnee) {
      return NextResponse.json(
        { error: "Donnée introuvable" },
        { status: 404 }
      );
    }

    const doc = new PDFDocument();

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {});

    doc.fontSize(18).text("Rapport PDF");
    doc.moveDown();

    doc.fontSize(12).text(`ID Donnée: ${donnee._id}`);
    doc.text(`Patiente: ${donnee.patienteId}`);

    doc.end();

    const buffer = Buffer.concat(chunks);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="rapport-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur PDF:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
