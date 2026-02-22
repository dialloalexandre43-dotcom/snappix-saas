# Script pour corriger le fichier .env.local
$envPath = ".env.local"
$content = Get-Content $envPath -Raw

# Supprimer les lignes Stripe existantes (même si elles sont cassées)
$content = $content -replace '(?m)^# Stripe Configuration.*\r?\n', ''
$content = $content -replace '(?m)^STRIPE_SECRET_KEY=.*\r?\n', ''
$content = $content -replace '(?m)^STRIPE_PRICE_ID_STARTER=.*\r?\n', ''
$content = $content -replace '(?m)^STRIPE_PRICE_ID_PRO=.*\r?\n', ''
$content = $content -replace '(?m)^STRIPE_WEBHOOK_SECRET=.*\r?\n', ''
$content = $content -replace '(?m)^vZHj4h.*\r?\n', ''

# Ajouter les variables Stripe correctement
$stripeConfig = @"

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_PRICE_ID_STARTER=price_YOUR_STARTER_PRICE_ID
STRIPE_PRICE_ID_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
"@

$content = $content.TrimEnd() + $stripeConfig
$content | Set-Content $envPath

Write-Host "✅ Fichier .env.local corrigé !" -ForegroundColor Green








