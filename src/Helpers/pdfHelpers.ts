import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart } from 'chart.js';

interface TriadData {
    triadLabels: string[];
    triad1Values: number[];
    triad2Values: number[];
    triad3Values: number[];
    typeLabels: string[];
    type1Values: number[];
    type2Values: number[];
    type3Values: number[];
  }

export const generatePDF = (triadData: TriadData) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Enneagram Report', 10, 10);

  // Prepare the canvas for radar charts
  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');

  // Check if context for first canvas is available
  const ctx1 = canvas1.getContext('2d');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'radar',
      data: {
        labels: triadData.triadLabels,
        datasets: [
          {
            label: 'Triad 1',
            data: triadData.triad1Values,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Triad 2',
            data: triadData.triad2Values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Triad 3',
            data: triadData.triad3Values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          r: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Check if context for second canvas is available
  const ctx2 = canvas2.getContext('2d');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'radar',
      data: {
        labels: triadData.typeLabels,
        datasets: [
          {
            label: 'Type 1',
            data: triadData.type1Values,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
          },
          {
            label: 'Type 2',
            data: triadData.type2Values,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          {
            label: 'Type 3',
            data: triadData.type3Values,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          r: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Add charts to PDF
  doc.addImage(canvas1.toDataURL('image/png'), 'PNG', 10, 30, 180, 100);
  doc.addImage(canvas2.toDataURL('image/png'), 'PNG', 10, 140, 180, 100);

  // Add a table below the charts
  const tableColumn = ['Question', 'Rate', 'Enneagram Type', 'Triad'];
  const tableRows = [
    ['Question 1', '8', 'Type 5', 'Thinking'],
    ['Question 2', '6', 'Type 3', 'Feeling'],
    ['Question 3', '7', 'Type 1', 'Instinctive'],
    // Add more rows based on your data
  ];

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 260, // Adjust according to your layout
  });

  // Save the generated PDF
  doc.save('enneagram_report.pdf');
};
