// Script to translate French text to English in popup.js
const fs = require('fs');
const path = require('path');

const translations = {
  // Error messages
  'Erreur': 'Error',
  'erreur': 'error',
  'Erreur lors de': 'Error during',
  'Erreur lors du': 'Error during',
  'Erreur lors de la': 'Error during',
  'Impossible de': 'Unable to',
  'Veuillez': 'Please',
  'Veuillez sélectionner': 'Please select',
  'Veuillez recharger': 'Please reload',
  
  // UI Text
  'Mes visuels': 'My Visuals',
  'Image détectée': 'Image detected',
  'Source détectée automatiquement': 'Source automatically detected',
  'Copier l\'URL': 'Copy URL',
  'Aperçu des styles': 'Style preview',
  'Recommandé': 'Recommended',
  'GÉNÉRER MAINTENANT': 'GENERATE NOW',
  'Envoyer mon propre fichier': 'Upload my own file',
  'images gratuites pour commencer': 'free images to get started',
  'Conditions': 'Terms',
  'Génération en cours...': 'Generating...',
  'Redirection dans 3s...': 'Redirecting in 3s...',
  'Job créé !': 'Job created!',
  'Voir dans ton dashboard': 'View in your dashboard',
  'Ouvrir mes visuels': 'Open my visuals',
  
  // Messages
  'Cette extension fonctionne uniquement sur': 'This extension only works on',
  'Aucune image détectée': 'No images detected',
  'Aucune image sélectionnée': 'No image selected',
  'Le fichier est trop volumineux': 'File is too large',
  'Taille maximale': 'Maximum size',
  'Format PRO - Upgradez votre plan': 'PRO Format - Upgrade your plan',
  'Ce format nécessite le plan PRO': 'This format requires PRO plan',
  'Upgradez votre plan pour y accéder': 'Upgrade your plan to access',
  'Recharger': 'Reload',
  'Rechargement...': 'Reloading...',
  'Rechargez la page': 'Reload page',
  'Recharger la page': 'Reload page',
  'après rechargement': 'after reload',
  'Cliquez sur': 'Click on',
  'pour recharger l\'onglet': 'to reload the tab',
  'et détecter les images': 'and detect images',
  'Erreur de chargement': 'Loading error',
  'Rechargement': 'Reloading',
  
  // Console messages
  'Popup initialisé': 'Popup initialized',
  'Début de la détection': 'Starting detection',
  'Images détectées': 'Images detected',
  'Aucune image trouvée': 'No images found',
  'Impossible de charger le plan': 'Unable to load plan',
  'utilisation des formats par défaut': 'using default formats',
  'Plan, formats et styles chargés': 'Plan, formats and styles loaded',
  'Styles disponibles depuis l\'API': 'Styles available from API',
  'Styles filtrés selon le plan': 'Styles filtered by plan',
  'URL corrigée automatiquement': 'URL automatically corrected',
  'URL enregistrée': 'URL saved',
  'image(s) extraite(s) avec succès': 'image(s) extracted successfully',
  'Première image': 'First image',
  'Job créé avec succès': 'Job created successfully',
  'Erreur complète': 'Complete error',
  'Erreur lors de la génération': 'Error during generation',
  'Impossible de se connecter à l\'API': 'Unable to connect to API',
  'Vérifiez que': 'Check that',
  'Erreur CORS': 'CORS error',
  'Le serveur doit autoriser': 'Server must allow',
  'Erreur d\'authentification': 'Authentication error',
  'Vous devez être connecté': 'You must be logged in',
  'Erreur inconnue': 'Unknown error',
  'Erreur lors de la sauvegarde': 'Error during save',
  'Erreur lors de la copie': 'Error during copy',
  'Erreur lors de l\'extraction': 'Error during extraction',
  'Erreur lors de l\'upload': 'Error during upload',
  'Erreur lors de la lecture du fichier': 'Error reading file',
  'Erreur lors du chargement': 'Error loading',
  'Erreur lors du rechargement': 'Error reloading',
  'Erreur lors de la récupération': 'Error retrieving',
  'Erreur lors de la récupération de l\'URL': 'Error retrieving URL',
  'Erreur lors de la récupération depuis le storage': 'Error retrieving from storage',
  'Erreur lors de l\'enregistrement': 'Error saving',
  'Erreur lors de la sauvegarde automatique': 'Error during auto-save',
  'Erreur HTTP': 'HTTP Error',
  
  // Format labels
  'Carré': 'Square',
  'Vertical': 'Vertical',
  'Portrait': 'Portrait',
  'Horizontal': 'Horizontal',
  'Stories': 'Stories',
  'Banner': 'Banner',
  'Pinterest': 'Pinterest',
};

const filePath = path.join(__dirname, 'popup.js');
let content = fs.readFileSync(filePath, 'utf8');

// Apply translations
Object.keys(translations).forEach(fr => {
  const en = translations[fr];
  // Replace exact matches (case sensitive)
  content = content.replace(new RegExp(fr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), en);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Translation complete!');




