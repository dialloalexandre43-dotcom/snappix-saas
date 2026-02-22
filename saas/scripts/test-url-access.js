/**
 * Test simple pour vérifier l'accessibilité d'une URL AliExpress
 * Usage: node scripts/test-url-access.js [URL]
 */

const url = process.argv[2] || 'https://ae-pic-a1.aliexpress-media.com/kf/S04ce03b21fc644a88aa30e0f92fa24914.jpg_960x960q75.jpg_.avif';

console.log('🧪 Test d\'accessibilité URL');
console.log(`URL: ${url}\n`);

async function testUrl() {
  try {
    console.log('📤 Envoi de la requête...');
    const res = await fetch(url);
    
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Type: ${res.headers.get("content-type")}`);
    console.log(`OK: ${res.ok}`);
    console.log(`Content-Length: ${res.headers.get("content-length") || 'N/A'}`);
    console.log(`\nHeaders:`);
    res.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    if (res.ok) {
      console.log('\n✅ URL accessible');
    } else {
      console.log('\n❌ URL non accessible');
    }
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

testUrl();
