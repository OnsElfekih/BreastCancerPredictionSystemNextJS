import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import {
  applyPdfStyles,
  addPatientInfo,
  addClinicalTable,
  addFooter,
} from "./pdfstyle";

export async function buildMedicalReport(user: any, donnee: any) {
  const fontPath = path.join(process.cwd(), "public/fonts/times.ttf");

  if (!fs.existsSync(fontPath)) {
    throw new Error("Police introuvable");
  }

  return await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      font: fontPath,
      margin: 50,
      size: "A4",
    });

    doc.font(fontPath);
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    applyPdfStyles(doc);

    addPatientInfo(
      doc,
      user.nom,
      user.prenom,
      user.email,
      String(donnee.age)
    );

    const rows: [string, string][] = [
      ["BMI", String(donnee.BMI)],
      ["Glucose", String(donnee.glucose)],
      ["Insulin", String(donnee.insulin)],
      ["HOMA", String(donnee.HOMA)],
      ["Leptin", String(donnee.leptin)],
      ["Adiponectin", String(donnee.adiponectin)],
      ["Resistin", String(donnee.resistin)],
      ["MCP1", String(donnee.MCP1)],
    ];

    addClinicalTable(doc, rows);

    addFooter(doc);

    doc.end();
  });
}
