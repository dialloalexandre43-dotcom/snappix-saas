// Script pour vérifier la configuration Stripe
require('dotenv').config({ path: '.env.local' })

const requiredVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_ID_STARTER',
  'STRIPE_PRICE_ID_PRO',
  'STRIPE_WEBHOOK_SECRET',
]

console.log('🔍 Vérification de la configuration Stripe...\n')

let allGood = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (!value) {
    console.log(`❌ ${varName}: MANQUANT`)
    allGood = false
  } else {
    const displayValue = varName.includes('SECRET') || varName.includes('KEY')
      ? `${value.substring(0, 20)}...` 
      : value
    console.log(`✅ ${varName}: ${displayValue}`)
  }
})

if (allGood) {
  console.log('\n✅ Toutes les variables sont configurées!')
} else {
  console.log('\n❌ Certaines variables manquent. Vérifiez votre fichier .env.local')
  console.log('\nVariables nécessaires:')
  requiredVars.forEach(v => console.log(`  - ${v}`))
}








