import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export function applyPdfStyles(doc: InstanceType<typeof PDFDocument>) {
  doc.fontSize(22).fillColor("#d63384").text("Rapport Médical", {
    align: "center",
  });

  doc.moveDown(0.3)
    .fontSize(12)
    .fillColor("#6c6c6c")
    .text(`Généré le : ${new Date().toLocaleDateString("fr-FR")}`, {
      align: "center",
    });

  doc.moveDown(0.5)
    .strokeColor("#D90479")
    .lineWidth(2)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown(1.3);
}

export function addPatientInfo(
  doc: InstanceType<typeof PDFDocument>,
  nom: string,
  prenom: string,
  email: string,
  age: string
) {
    const logoPath = path.join(process.cwd(), "src", "app", "logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, doc.y, { width: 50, height: 50 }); // placer le logo
  }

  doc.fontSize(20).fillColor("#d63384").text("BreastPredict", 110, doc.y + 15); // texte à côté du logo

  doc.moveDown(2); // espacement après logo + titre
  doc.fontSize(16).fillColor("#D90479").text("Informations de la patiente");

  doc.moveDown(0.5)
    .fontSize(12)
    .fillColor("#000")
    .text(`Nom : ${nom} ${prenom}`)
    .text(`Email : ${email}`)
    .text(`Âge : ${age}`);

  doc.moveDown(1);
}

export function addClinicalTable(
  doc: InstanceType<typeof PDFDocument>,
  rows: [string, string][]
) {
  doc.fontSize(16).fillColor("#D90479").text("Données Cliniques");
  doc.moveDown(0.7);

  const startX = 60;
  let y = doc.y + 10;

  rows.forEach(([label, value]) => {
    doc.fontSize(12).fillColor("#000").text(label, startX, y, { width: 200 });

    doc.fontSize(12)
      .fillColor("#444")
      .text(value, startX + 200, y, { width: 200 });

    y += 22;

    doc.strokeColor("#ef78c1")
      .lineWidth(0.5)
      .moveTo(50, y)
      .lineTo(545, y)
      .stroke();

    y += 8;
  });

  doc.moveDown(3);
}

export function addFooter(doc: InstanceType<typeof PDFDocument>) {
  doc.fontSize(10)
    .fillColor("#a1a1a1")
    .text("Document généré automatiquement. Confidentiel.", 50, 780, {
      align: "center",
    });
}
