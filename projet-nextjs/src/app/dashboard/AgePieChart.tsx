"use client";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Interface définie ici
interface PatienteData {
  visites?: number;
  dateDeNaissance?: string;
}

export default function AgePieChart({ patientes }: { patientes: PatienteData[] }) {
  const generations = { 'Moins de 30': 0, '30-50': 0, '50-70': 0, '70 et plus': 0 };

  patientes.forEach(p => {
    if (p.dateDeNaissance) {
      const age = new Date().getFullYear() - new Date(p.dateDeNaissance).getFullYear();
      if (age < 30) generations['Moins de 30']++;
      else if (age <= 50) generations['30-50']++;
      else if (age <= 70) generations['50-70']++;
      else generations['70 et plus']++;
    }
  });

  const data = {
    labels: Object.keys(generations),
    datasets: [{
      label: 'Répartition par génération',
      data: Object.values(generations),
      backgroundColor: ['#F472B6', '#FB7185', '#F43F5E', '#BE185D'],
      borderWidth: 1,
    }],
  };

  return <Pie data={data} />;
}
