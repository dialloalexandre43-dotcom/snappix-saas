/**
 * Script pour générer le Client Secret Apple (JWT)
 * 
 * Usage:
 * 1. Installez jsonwebtoken: npm install jsonwebtoken
 * 2. Placez votre fichier .p8 dans ce dossier (ex: AuthKey_ABC123.p8)
 * 3. Modifiez les variables ci-dessous avec vos valeurs
 * 4. Exécutez: node scripts/generate-apple-secret.js
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ⚠️ MODIFIEZ CES VALEURS AVEC VOS INFORMATIONS
const TEAM_ID = 'VOTRE_TEAM_ID'; // Ex: ABC123DEF4
const CLIENT_ID = 'com.votredomaine.snappix'; // Votre Service ID
const KEY_ID = 'VOTRE_KEY_ID'; // Ex: XYZ789ABC1
const PRIVATE_KEY_PATH = path.join(__dirname, 'AuthKey_KEYID.p8'); // Chemin vers votre fichier .p8

// Vérifier que le fichier .p8 existe
if (!fs.existsSync(PRIVATE_KEY_PATH)) {
  console.error('❌ Erreur: Le fichier .p8 n\'existe pas à:', PRIVATE_KEY_PATH);
  console.log('\n📝 Instructions:');
  console.log('1. Téléchargez votre clé .p8 depuis Apple Developer Portal');
  console.log('2. Placez-la dans le dossier saas/scripts/');
  console.log('3. Renommez-la si nécessaire (ex: AuthKey_ABC123.p8)');
  console.log('4. Modifiez PRIVATE_KEY_PATH dans ce script');
  process.exit(1);
}

// Vérifier que les valeurs ne sont pas les valeurs par défaut
if (TEAM_ID === 'VOTRE_TEAM_ID' || CLIENT_ID === 'com.votredomaine.snappix' || KEY_ID === 'VOTRE_KEY_ID') {
  console.error('❌ Erreur: Vous devez modifier les variables dans le script avec vos valeurs réelles');
  console.log('\n📝 Variables à modifier:');
  console.log('- TEAM_ID: Votre Team ID depuis Apple Developer Portal');
  console.log('- CLIENT_ID: Votre Service ID (ex: com.votredomaine.snappix)');
  console.log('- KEY_ID: Votre Key ID depuis Apple Developer Portal');
  console.log('- PRIVATE_KEY_PATH: Chemin vers votre fichier .p8');
  process.exit(1);
}

try {
  // Lire la clé privée
  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH);

  // Générer le JWT
  const now = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    {
      iss: TEAM_ID,
      iat: now,
      exp: now + 86400 * 180, // 6 mois (180 jours)
      aud: 'https://appleid.apple.com',
      sub: CLIENT_ID,
    },
    privateKey,
    {
      algorithm: 'ES256',
      keyid: KEY_ID,
    }
  );

  console.log('✅ Secret Apple généré avec succès!\n');
  console.log('📋 Ajoutez cette ligne dans votre fichier .env.local:\n');
  console.log(`APPLE_SECRET=${token}\n`);
  console.log('⚠️  Note: Ce secret expire dans 6 mois. Vous devrez le régénérer.');
  console.log('📅 Date d\'expiration:', new Date((now + 86400 * 180) * 1000).toLocaleDateString());
  
} catch (error) {
  console.error('❌ Erreur lors de la génération du secret:', error.message);
  if (error.message.includes('PEM')) {
    console.log('\n💡 Astuce: Vérifiez que le fichier .p8 est valide et bien formaté.');
  }
  process.exit(1);
}



















