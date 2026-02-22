# Script PowerShell pour lancer le SaaS
# Exécutez : .\LAUNCH.ps1

Write-Host "🚀 Lancement du SaaS Snappix..." -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon dossier
$currentDir = Get-Location
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur : package.json non trouvé" -ForegroundColor Red
    Write-Host "   Assurez-vous d'être dans le dossier 'saas'" -ForegroundColor Yellow
    exit 1
}

# Vérifier que .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Attention : .env.local non trouvé" -ForegroundColor Yellow
    Write-Host "   Créez le fichier .env.local avec les variables nécessaires" -ForegroundColor Yellow
    Write-Host "   Voir .env.example pour un exemple" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continuer quand même ? (o/n)"
    if ($continue -ne "o") {
        exit 1
    }
}

# Vérifier que node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
}

# Générer Prisma Client
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Lancer le serveur
Write-Host ""
Write-Host "✅ Démarrage du serveur sur http://localhost:3001" -ForegroundColor Green
Write-Host "   Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
Write-Host ""

npm run dev




