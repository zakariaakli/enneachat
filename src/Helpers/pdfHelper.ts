import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this is imported correctly
import { string } from 'zod';

export const generatePDF = (name: string) => {
  const doc = new jsPDF();

  // Add a title or heading to the PDF
  doc.text('Enneagram Report ' + name, 10, 10);

  // Define table structure (Columns and Rows)
  const tableColumn = ['Question', 'Rate', 'Enneagram Type', 'Triad'];
  const tableRows = [
    ['Question 1', '8', 'Type 5', 'Thinking'],
    ['Question 2', '6', 'Type 3', 'Feeling'],
    ['Question 3', '7', 'Type 1', 'Instinctive'],
    // Add more rows based on your data
  ];

  // Generate the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,  // Starting position for the table
  });

  // Use type assertion for lastAutoTable
  const finalY = (doc as any).lastAutoTable.finalY || 30;  // Get the final Y position after the table

  // Add text below the table
  doc.text(`Enneagram likely type: 5`, 10, finalY + 10);

  // Save the generated PDF
  doc.save('enneagram_report.pdf');
};
