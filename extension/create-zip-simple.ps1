# Script simple pour créer le ZIP de l'extension

$extensionPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$zipPath = Join-Path (Split-Path -Parent $extensionPath) "snappix-extension.zip"

# Supprimer l'ancien ZIP s'il existe
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Ancien ZIP supprime"
}

# Créer un dossier temporaire pour les fichiers à zipper
$tempDir = Join-Path $env:TEMP "snappix-extension-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copier les fichiers nécessaires
$filesToCopy = @(
    "manifest.json",
    "popup.html",
    "popup.js",
    "popup.css",
    "content.js",
    "background.js",
    "logo.png"
)

foreach ($file in $filesToCopy) {
    $source = Join-Path $extensionPath $file
    $dest = Join-Path $tempDir $file
    if (Test-Path $source) {
        Copy-Item $source $dest -Force
        Write-Host "Copie: $file"
    }
}

# Copier le dossier styles
$stylesSource = Join-Path $extensionPath "styles"
$stylesDest = Join-Path $tempDir "styles"
if (Test-Path $stylesSource) {
    New-Item -ItemType Directory -Path $stylesDest | Out-Null
    Copy-Item (Join-Path $stylesSource "*.jpg") $stylesDest -Force
    Write-Host "Copie: styles/*.jpg"
}

# Créer le ZIP
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Nettoyer le dossier temporaire
Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "ZIP cree avec succes: $zipPath"
$size = (Get-Item $zipPath).Length / 1KB
Write-Host "Taille: $([math]::Round($size, 2)) KB"
Write-Host ""
Write-Host "Vous pouvez maintenant televerser ce fichier sur Chrome Web Store!"




