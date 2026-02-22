# Script pour pousser le code sur GitHub
# Remplacez VOTRE-USERNAME et VOTRE-REPO par vos valeurs

Write-Host "🚀 Préparation du push vers GitHub..." -ForegroundColor Cyan
Write-Host ""

# Vérifier que Git est initialisé
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git n'est pas initialisé. Exécutez d'abord: git init" -ForegroundColor Red
    exit 1
}

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Ready for Vercel deployment"

# Créer la branche main
Write-Host "🌿 Configuration de la branche main..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "✅ Fichiers prêts pour GitHub !" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Créez un repository sur https://github.com/new" -ForegroundColor White
Write-Host "2. Copiez l'URL du repository (ex: https://github.com/username/repo.git)" -ForegroundColor White
Write-Host "3. Exécutez :" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

