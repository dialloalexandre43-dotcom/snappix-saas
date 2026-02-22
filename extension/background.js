// Background service worker pour l'extension
// Pour l'instant, pas de logique spécifique nécessaire

console.log('SaaS Image Generator: Background service worker chargé');

// Écouter les messages depuis le content script ou popup si nécessaire
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProductImage') {
    // Logique si nécessaire
    sendResponse({ success: true });
  }
  return true;
});






















