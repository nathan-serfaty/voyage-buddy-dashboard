
import * as XLSX from 'xlsx';

type ExportFormat = 'csv' | 'xlsx';

export const exportUserData = (data: any, format: ExportFormat = 'csv') => {
  // Create worksheet data with all features
  const worksheet = XLSX.utils.json_to_sheet([{
    'Nom': data.name,
    'Email': data.email,
    'Ville sélectionnée': data.selectedCity,
    'Types d\'activités': data.activityTypes.join(', '),
    'Budget': data.budget,
    'Taille du groupe': data.groupSize,
    'Date de début': data.dateRange.from ? new Date(data.dateRange.from).toLocaleDateString('fr-FR') : '',
    'Date de fin': data.dateRange.to ? new Date(data.dateRange.to).toLocaleDateString('fr-FR') : '',
    'Activités sélectionnées': data.selectedActivities.length,
    'Exigences spéciales': data.specialRequirements || ''
  }]);

  // Set column widths for better readability
  const wscols = [
    { wch: 20 }, // Nom
    { wch: 25 }, // Email
    { wch: 20 }, // Ville
    { wch: 30 }, // Types d'activités
    { wch: 15 }, // Budget
    { wch: 15 }, // Taille du groupe
    { wch: 15 }, // Date début
    { wch: 15 }, // Date fin
    { wch: 20 }, // Activités sélectionnées
    { wch: 40 }  // Exigences spéciales
  ];

  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Informations Utilisateur");

  if (format === 'csv') {
    XLSX.writeFile(workbook, "informations-voyage.csv");
  } else {
    XLSX.writeFile(workbook, "informations-voyage.xlsx");
  }
};
