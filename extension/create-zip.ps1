# Script pour créer le ZIP de l'extension pour Chrome Web Store

$extensionPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$zipPath = Join-Path (Split-Path -Parent $extensionPath) "snappix-extension.zip"

# Supprimer l'ancien ZIP s'il existe
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Ancien ZIP supprimé"
}

# Fichiers à inclure
$filesToInclude = @(
    "manifest.json",
    "popup.html",
    "popup.js",
    "popup.css",
    "content.js",
    "background.js",
    "logo.png"
)

# Créer le ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

# Ajouter les fichiers principaux
foreach ($file in $filesToInclude) {
    $filePath = Join-Path $extensionPath $file
    if (Test-Path $filePath) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $filePath, $file) | Out-Null
        Write-Host "Ajoute: $file"
    } else {
        Write-Warning "Fichier non trouve: $file"
    }
}

# Ajouter les images de styles
$stylesPath = Join-Path $extensionPath "styles"
if (Test-Path $stylesPath) {
    Get-ChildItem -Path $stylesPath -Filter "*.jpg" | ForEach-Object {
        $entryName = "styles\$($_.Name)"
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName) | Out-Null
        Write-Host "Ajoute: $entryName"
    }
}

$zip.Dispose()

Write-Host ""
Write-Host "ZIP cree avec succes: $zipPath"
Write-Host "Taille: $([math]::Round((Get-Item $zipPath).Length / 1KB, 2)) KB"
Write-Host ""
Write-Host "Vous pouvez maintenant televerser ce fichier sur Chrome Web Store!"




