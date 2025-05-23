import { jsPDF } from 'jspdf';
import { GroceryItem } from '../types';

export const generateShoppingListPDF = (groceryList: GroceryItem[]) => {
  const doc = new jsPDF();
  
  // Configuration de la page
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 8;
  let currentY = margin;

  // Titre principal
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Liste de Courses', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(currentDate, pageWidth / 2, currentY, { align: 'center' });
  currentY += 20;

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 15;

  // Fusionne les doublons par nom+unité (même logique que dans HomePage)
  const mergedList = Object.values(
    groceryList.reduce((acc, item) => {
      const key = item.name.trim().toLowerCase() + '|' + item.unit.trim().toLowerCase();
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].quantity += item.quantity;
        acc[key].checked = acc[key].checked && item.checked;
      }
      return acc;
    }, {} as Record<string, typeof groceryList[0]>)
  );

  if (mergedList.length === 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text('Votre liste de courses est vide', pageWidth / 2, currentY, { align: 'center' });
  } else {
    // Séparer les articles cochés et non cochés
    const uncheckedItems = mergedList.filter(item => !item.checked);
    const checkedItems = mergedList.filter(item => item.checked);

    // Articles à acheter
    if (uncheckedItems.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('À acheter:', margin, currentY);
      currentY += 12;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      uncheckedItems.forEach((item, index) => {
        // Vérifier si on a assez de place pour l'article suivant
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = margin;
        }

        const text = `• ${item.quantity} ${item.unit} ${item.name}`;
        doc.text(text, margin + 5, currentY);
        currentY += lineHeight;
      });

      currentY += 10;
    }

    // Articles déjà achetés (si il y en a)
    if (checkedItems.length > 0) {
      // Vérifier si on a assez de place pour la section
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = margin;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Déjà acheté:', margin, currentY);
      currentY += 12;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128); // Gris pour les articles cochés

      checkedItems.forEach((item, index) => {
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = margin;
        }

        const text = `• ${item.quantity} ${item.unit} ${item.name}`;
        doc.text(text, margin + 5, currentY);
        currentY += lineHeight;
      });

      doc.setTextColor(0, 0, 0); // Remettre la couleur noire
    }

    // Résumé en bas de page
    const totalItems = mergedList.length;
    const checkedCount = checkedItems.length;
    
    // Pied de page avec résumé
    const footerY = pageHeight - 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Total: ${totalItems} article${totalItems > 1 ? 's' : ''} - Acheté${checkedCount > 1 ? 's' : ''}: ${checkedCount}/${totalItems}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
  }

  // Génération du nom de fichier avec date
  const filename = `liste-courses-${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Télécharger le PDF
  doc.save(filename);
}; 