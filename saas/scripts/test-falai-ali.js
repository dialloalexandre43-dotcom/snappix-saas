/**
 * Script de test pour vérifier si Fal.ai peut accéder aux URLs AliExpress
 * 
 * Usage: 
 *   npx tsx scripts/test-falai-ali.js
 *   ou
 *   npx ts-node scripts/test-falai-ali.js
 * 
 * Avec des URLs personnalisées:
 *   npx tsx scripts/test-falai-ali.js "URL_ALIEXPRESS" "URL_AMAZON"
 */

// Charger les variables d'environnement depuis .env
const fs = require('fs');
const path = require('path');

// Essayer d'abord avec dotenv
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {
  // Si dotenv n'est pas installé, lire directement le fichier .env
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      // Ignorer les lignes vides et les commentaires
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Enlever les guillemets si présents
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

// Pour TypeScript, on doit utiliser une approche différente
// On va tester directement l'API Fal.ai sans passer par le module

// Fonction pour tester directement l'API Fal.ai
async function testFalAIDirect(imageUrl, testName) {
  const apiKey = process.env.FAL_AI_API_KEY;
  const modelId = process.env.FAL_AI_MODEL_ID || 'fal-ai/flux-pro/kontext';
  
  if (!apiKey) {
    throw new Error('FAL_AI_API_KEY n\'est pas définie dans .env');
  }
  
  // Prompt simple pour le test
  const prompt = `Transform the product image into a professional e-commerce photo with a clean background and better lighting, but keep the exact same product shape, proportions, logo and main colors as in the original photo. Do not change the product itself, only change the background, lighting and scene around it.`;
  
  // Mapper le ratio 4:5 vers 3:4
  const aspectRatio = '3:4';
  
  const requestBody = {
    prompt: prompt,
    image_url: imageUrl,
    aspect_ratio: aspectRatio,
  };
  
  console.log(`📤 Requête Fal.ai:`);
  console.log(`   URL: https://fal.run/${modelId}`);
  console.log(`   Image URL: ${imageUrl.substring(0, 80)}...`);
  console.log(`   Aspect Ratio: ${aspectRatio}`);
  console.log('');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`https://fal.run/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const duration = Date.now() - startTime;
    console.log(`📥 Réponse reçue en ${duration}ms`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   OK: ${response.ok}`);
    console.log('');
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ ERREUR HTTP:');
      console.log(`   ${errorText}`);
      console.log('');
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('   Détails JSON:');
        console.log(JSON.stringify(errorJson, null, 2));
      } catch (e) {
        // Pas du JSON
      }
      
      return { success: false, error: errorText };
    }
    
    const responseText = await response.text();
    console.log(`📦 Réponse brute (premiers 500 caractères):`);
    console.log(`   ${responseText.substring(0, 500)}...`);
    console.log('');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('❌ Erreur de parsing JSON:');
      console.log(`   ${e.message}`);
      console.log(`   Réponse complète: ${responseText}`);
      return { success: false, error: 'Invalid JSON response' };
    }
    
    console.log('📊 Données parsées:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    // Extraire l'URL de l'image
    let imageUrlResult = null;
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      imageUrlResult = data.images[0].url || data.images[0];
    }
    
    if (imageUrlResult) {
      console.log('✅ SUCCÈS:');
      console.log(`   Image générée: ${imageUrlResult}`);
      return { success: true, imageUrl: imageUrlResult, data };
    } else {
      console.log('⚠️  AUCUNE IMAGE DANS LA RÉPONSE');
      console.log(`   Structure: ${JSON.stringify(Object.keys(data))}`);
      return { success: false, error: 'No image in response', data };
    }
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ EXCEPTION après ${duration}ms:`);
    console.log(`   ${error.message}`);
    if (error.stack) {
      console.log(`   Stack: ${error.stack}`);
    }
    return { success: false, error: error.message };
  }
}

async function testFalAIWithAliExpress() {
  console.log('🧪 Test Fal.ai avec URL AliExpress\n');
  
  // URL AliExpress exemple (à remplacer par une vraie URL)
  const aliExpressUrl = process.argv[2] || 'https://ae-pic-a1.aliexpress-media.com/kf/S04ce03b21fc644a88aa30e0f92fa24914.jpg_960x960q75.jpg_.avif';
  
  // URL Amazon exemple (pour comparaison)
  const amazonUrl = process.argv[3] || 'https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg';
  
  console.log('📋 Configuration:');
  console.log(`   FAL_AI_API_KEY: ${process.env.FAL_AI_API_KEY ? '✅ Définie' : '❌ Manquante'}`);
  console.log(`   FAL_AI_MODEL_ID: ${process.env.FAL_AI_MODEL_ID || 'fal-ai/flux-pro/kontext'}`);
  console.log('');
  
  // Test 1: AliExpress
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: URL AliExpress');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`URL: ${aliExpressUrl}`);
  console.log('');
  
  const result1 = await testFalAIDirect(aliExpressUrl, 'AliExpress');
  
  // Test 2: Amazon (pour comparaison)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: URL Amazon (pour comparaison)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`URL: ${amazonUrl}`);
  console.log('');
  
  const result2 = await testFalAIDirect(amazonUrl, 'Amazon');
  
  // Résumé
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RÉSUMÉ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`AliExpress: ${result1.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
  if (result1.error) {
    console.log(`   Erreur: ${result1.error}`);
  }
  console.log(`Amazon: ${result2.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
  if (result2.error) {
    console.log(`   Erreur: ${result2.error}`);
  }
  console.log('');
  
  if (result1.success && result2.success) {
    console.log('✅ Les deux tests ont réussi - Le problème ne vient pas de Fal.ai');
  } else if (!result1.success && result2.success) {
    console.log('⚠️  AliExpress échoue mais Amazon fonctionne - Problème spécifique aux URLs AliExpress');
  } else if (result1.success && !result2.success) {
    console.log('⚠️  Amazon échoue mais AliExpress fonctionne - Problème spécifique aux URLs Amazon');
  } else {
    console.log('❌ Les deux tests ont échoué - Problème général avec Fal.ai');
  }
  console.log('');
}

// Lancer les tests
testFalAIWithAliExpress()
  .then(() => {
    console.log('\n✅ Script terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });

