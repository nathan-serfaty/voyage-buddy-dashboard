
import * as XLSX from 'xlsx';

type ExportFormat = 'csv' | 'xlsx';

interface ConnectionData {
  timestamp: string;
  page: string;
}

export const exportUserData = (data: any, format: ExportFormat = 'csv') => {
  // Get current connection data
  const currentTimestamp = new Date().toLocaleString('fr-FR');
  const currentPage = window.location.pathname;

  // Create worksheet data with all features and connection info
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
    'Exigences spéciales': data.specialRequirements || '',
    'Dernière connexion': currentTimestamp,
    'Page actuelle': currentPage
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
    { wch: 40 }, // Exigences spéciales
    { wch: 25 }, // Dernière connexion
    { wch: 20 }  // Page actuelle
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

