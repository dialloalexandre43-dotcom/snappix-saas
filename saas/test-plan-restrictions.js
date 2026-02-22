// Script pour tester les restrictions de plan
// Exécutez avec: node test-plan-restrictions.js

const plans = ['FREE', 'STARTER', 'PRO'];

// Simuler les formats et styles selon le plan
const expectedFormats = {
  FREE: ['jpg-1024'], // 1 format
  STARTER: ['jpg-1024', '1080x1080', '1080x1920', '1600x1600', 'jpg-2048'], // 5 formats
  PRO: [
    'jpg-1024', '1080x1080', '1080x1920', '1600x1600', 'jpg-2048',
    'amazon-3000', 'shopify-hero-2048x682', 'pinterest-1000x1500',
    'rectangle-1920x1080', 'png-transparent-2048', 'square-4096',
    'etsy-2000', 'stories-1080x1920'
  ], // 13+ formats
};

const expectedStyles = {
  FREE: 2, // 2 styles seulement
  STARTER: 8, // 8 styles
  PRO: 8, // Tous les styles (8 au total)
};

console.log('🧪 Test des restrictions de plan\n');

plans.forEach(plan => {
  console.log(`\n📋 Plan: ${plan}`);
  console.log(`   Formats attendus: ${expectedFormats[plan].length}`);
  console.log(`   Styles attendus: ${expectedStyles[plan]}`);
  console.log(`   Formats: ${expectedFormats[plan].join(', ')}`);
});

console.log('\n✅ Pour tester en réel:');
console.log('1. Allez sur http://localhost:3001/api/user/plan');
console.log('2. Vérifiez que les formats/styles correspondent au plan');
console.log('3. Testez avec l\'extension Chrome');
console.log('4. Vérifiez que seuls les formats/styles du plan sont disponibles');








