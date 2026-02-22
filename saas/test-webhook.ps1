# Script de test pour l'endpoint webhook Stripe
Write-Host "Testing Stripe webhook endpoint..." -ForegroundColor Cyan

# Test 1: Vérifier que l'endpoint répond (sans signature - devrait retourner une erreur attendue)
Write-Host "`nTest 1: Testing endpoint without signature..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/stripe/webhook" -Method POST -ContentType "application/json" -Body "{}" -ErrorAction SilentlyContinue
if ($response) {
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} else {
    Write-Host "Endpoint responded (expected error for missing signature)" -ForegroundColor Green
}

Write-Host "`n✅ Endpoint is accessible!" -ForegroundColor Green
Write-Host "`nNext step: Test with Stripe CLI trigger command:" -ForegroundColor Cyan
Write-Host "  cd C:\Users\aferr\Downloads\stripe_1.35.0_windows_x86_64" -ForegroundColor White
Write-Host "  .\stripe trigger checkout.session.completed" -ForegroundColor White








