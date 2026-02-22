// Content script pour Amazon et AliExpress
// Ce script s'exécute sur les pages produits pour détecter l'image principale

console.log('Snappix Extension: Content script loaded');

/**
 * Nettoie l'URL pour obtenir la haute résolution
 */
function cleanImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  // Enlever les paramètres de requête
  url = url.split('?')[0];
  url = url.split('#')[0];
  
  // Enlever les suffixes de taille AliExpress (_50x50.jpg, _640x640.jpg, etc.)
  url = url.replace(/_\d+x\d+\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)/gi, '.$1');
  url = url.replace(/\.(\d+x\d+)\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)/gi, '.$2');
  
  // Enlever les autres patterns de taille
  url = url.replace(/[_-]\d{2,4}x\d{2,4}(?=\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP))/gi, '');
  
  // Forcer HTTPS
  url = url.replace(/^http:/, 'https:');
  
  // S'assurer que l'URL se termine par une extension d'image valide
  if (!url.match(/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i)) {
    // Si pas d'extension, ajouter .jpg (AliExpress utilise souvent .jpg)
    if (url.includes('alicdn.com')) {
      url += '.jpg';
    }
  }
  
  return url;
}

/**
 * Vérifie si une image DOM est une vraie image produit
 * Version assouplie : on accepte plus d'images
 */
function isValidProductImage(img) {
  // Si l'image n'est pas encore chargée, on l'accepte (elle sera vérifiée plus tard)
  if (img.naturalWidth === 0 && img.naturalHeight === 0) {
    return true;
  }
  
  // Vérifier taille minimale (très petite = probablement icône)
  if (img.naturalWidth > 0 && img.naturalWidth < 50) return false;
  if (img.naturalHeight > 0 && img.naturalHeight < 50) return false;
  
  // Vérifier classes/IDs très suspects uniquement
  const element = img.closest('[class], [id]');
  if (element) {
    const classId = (element.className + ' ' + element.id).toLowerCase();
    
    // Seulement les termes très suspects
    const verySuspectTerms = [
      'favicon',
      'logo-icon',
      'nav-logo',
      'header-logo',
      'footer-logo'
    ];
    
    if (verySuspectTerms.some(term => classId.includes(term))) {
      return false;
    }
  }
  
  return true;
}

/**
 * Détecte les URLs qui sont probablement des logos/icônes
 * Version améliorée : filtrage plus strict
 */
function isLikelyLogoOrIcon(url) {
  if (!url || typeof url !== 'string') return true;
  
  const lowerUrl = url.toLowerCase();
  
  // Pour AliExpress, être moins strict (les URLs peuvent contenir "thumb" ou "small" mais être de vraies images)
  const isAliExpressUrl = lowerUrl.includes('alicdn.com') || lowerUrl.includes('ae-pic') || lowerUrl.includes('aliexpress');
  
  // Mots-clés pour les logos/icônes (liste étendue)
  const iconKeywords = [
    '/favicon',
    '/logo',
    '/icon',
    '/sprite',
    '/ui/',
    '/assets/',
    '/static/',
    '/images/icon',
    '/images/logo',
    'placeholder',
    'default',
    'no-image',
    'empty',
    'avatar',
    'profile',
    'badge',
    'button',
    'btn',
    'nav',
    'menu',
    'header',
    'footer',
    'seller',
    'store-logo',
    'brand',
    'trademark'
  ];
  
  // Vérifier si l'URL contient un de ces mots-clés
  const hasIconKeyword = iconKeywords.some(keyword => lowerUrl.includes(keyword));
  
  // Si l'URL est très courte, c'est probablement une icône
  if (url.length < 50) return true;
  
  // Patterns d'URL suspects (petites images, icônes)
  // MAIS pour AliExpress, ignorer "thumb" et "small" car ce sont souvent de vraies images produit
  const suspiciousPatterns = [
    /_\d{1,3}x\d{1,3}\./, // _16x16., _32x32., etc. (petites tailles) - seulement si très petite
    /icon/i,
    /logo/i,
  ];
  
  // Pour AliExpress, ne pas considérer "thumb", "small", "mini", "tiny" comme suspects
  // car ce sont souvent des vraies images produit avec des paramètres de taille
  if (!isAliExpressUrl) {
    suspiciousPatterns.push(/thumb/i, /small/i, /mini/i, /tiny/i);
  }
  
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(lowerUrl));
  
  // Pour AliExpress, être plus permissif : seulement exclure si vraiment suspect (logo/icon/favicon)
  if (isAliExpressUrl) {
    return hasIconKeyword || (hasSuspiciousPattern && url.length < 100);
  }
  
  return hasIconKeyword || hasSuspiciousPattern;
}

/**
 * Extrait les images produit d'AliExpress
 * Solution RADAR - Testée 2026
 * Utilise un Map global pour partager les images détectées entre les appels
 */
// Map global pour stocker les images détectées (partagé entre tous les appels)
if (!window.__ALI_IMAGES_DETECTED__) {
  window.__ALI_IMAGES_DETECTED__ = new Map();
}

function extractAllProductImagesFromAliExpress() {
  // Utiliser le Map global pour accumuler les images
  const detected = window.__ALI_IMAGES_DETECTED__;

  console.log('🔍 Snappix: Détection RADAR AliExpress...');

  /**
   * Extrait la source d'une image (avec tous les attributs possibles)
   */
  function extractSrc(img) {
    return (
      img.src ||
      img.getAttribute("data-src") ||
      img.getAttribute("data-lazy-src") ||
      img.getAttribute("data-zoom-src") ||
      img.getAttribute("data-original") ||
      ""
    );
  }

  /**
   * Vérifie si une image est dans la zone produit (fonction helper)
   */
  function isInProductAreaHelper(img) {
    const productContainers = [
      '[class*="product"]',
      '[class*="gallery"]',
      '[class*="image-view"]',
      '[class*="magnifier"]',
      '.images-view',
      '.product-image',
      '.image-view-item',
      '.magnifier-image',
      '[data-role="main-image"]',
      '[data-pl="main"]'
    ];
    
    for (const selector of productContainers) {
      try {
        if (img.closest(selector)) {
          return true;
        }
      } catch (e) {}
    }
    
    return false;
  }

  /**
   * Scanne les images produit
   */
  function scanImages() {
    let productCount = 0;
    
    // 🔥 ALIEXPRESS - Pattern 100% sûr
    document.querySelectorAll('img').forEach(img => {
      const src = extractSrc(img);
      if (!src) return;
      
      const srcLower = src.toLowerCase();
      const width = img.naturalWidth || img.offsetWidth || img.width || 0;
      const height = img.naturalHeight || img.offsetHeight || img.height || 0;
      
      // TES URLs EXACTES : ae-pic ou alicdn.com
      // Exclusion : local, flag
      // Taille minimale : 100px (réduit pour capturer plus d'images)
      // OU si l'image est dans la zone produit (même si petite)
      const inProductArea = isInProductAreaHelper(img);
      const minSize = inProductArea ? 100 : 200; // Plus flexible si dans zone produit
      
      // Accepter si : URL valide ET (taille OK OU dans zone produit OU pas encore chargée)
      const isImageNotLoaded = (width === 0 && height === 0);
      const isSizeValid = (width > minSize || height > minSize);
      
      if ((srcLower.includes('ae-pic') || srcLower.includes('alicdn.com')) && 
          !srcLower.includes('local') && 
          !srcLower.includes('flag') && 
          (isSizeValid || inProductArea || isImageNotLoaded)) {
        
        // Nettoyer l'URL
        const cleaned = cleanImageUrl(src);
        if (!cleaned || detected.has(cleaned)) return;
        
        // Enregistrer l'image avec score de qualité
        const rect = img.getBoundingClientRect();
        const topPosition = rect.top;
        
        // Calculer un score de qualité pour le tri
        let qualityScore = 0;
        
        // Score basé sur la taille (plus grande = mieux)
        // Si l'image n'est pas encore chargée, donner un score par défaut
        if (width > 0 && height > 0) {
          qualityScore += Math.min((width * height) / 10000, 50); // Max 50 points
        } else {
          // Image pas encore chargée : score par défaut basé sur la zone
          qualityScore += inProductArea ? 40 : 20;
        }
        
        // Score basé sur la position (en haut de page = mieux, zone produit = mieux)
        if (inProductArea) {
          qualityScore += 30; // Bonus zone produit
        } else if (topPosition >= 0 && topPosition < 1000) {
          qualityScore += 20; // Bonus en haut de page
        } else if (topPosition < 0 || topPosition > 2000) {
          qualityScore -= 10; // Pénalité si trop bas ou hors écran
        }
        
        // Pénalité si suspect (logo/icône) - MAIS moins strict pour AliExpress
        // Les URLs AliExpress peuvent contenir "thumb" ou "small" mais être de vraies images produit
        if (isLikelyLogoOrIcon(src)) {
          // Si l'image est dans la zone produit, réduire la pénalité (c'est probablement une vraie image)
          if (inProductArea) {
            qualityScore -= 10; // Pénalité réduite si dans zone produit
          } else {
            qualityScore -= 50; // Forte pénalité si hors zone produit
          }
        }
        
        // Bonus si grande image (>= 500px)
        if (width >= 500 && height >= 500) {
          qualityScore += 20;
        }
        
        // Pénalité si image carrée très petite (probable icône)
        if (width === height && width < 300) {
          qualityScore -= 30;
        }
        
        detected.set(cleaned, {
          src: cleaned,
          originalSrc: src,
          width: width,
          height: height,
          size: width * height,
          qualityScore: qualityScore,
          inProductArea: inProductArea,
          topPosition: topPosition,
          isSuspect: isLikelyLogoOrIcon(src)
        });
        
        productCount++;
        console.log('✅ ALI PRODUIT:', src.slice(-50), `(${width}x${height}) [Score: ${qualityScore.toFixed(1)}]`);
      }
    });
    
    if (productCount > 0) {
      console.log(`🎯 ${productCount} images produit AliExpress détectées`);
    }
  }

  // FAIRE PLUSIEURS SCANS SYNCHRONES avant de retourner (pour capturer toutes les images)
  scanImages(); // Scan immédiat 1
  scanImages(); // Scan immédiat 2 (certaines images peuvent être détectées au 2ème passage)
  scanImages(); // Scan immédiat 3 (pour être sûr)
  
  // LANCE À INTERVALLES RÉGULIERS (AliExpress lazy-load) - en arrière-plan
  // Ne pas bloquer le retour de la fonction
  if (!window.__ALI_SCAN_INTERVAL__) {
    window.__ALI_SCAN_INTERVAL__ = setInterval(() => {
      scanImages();
    }, 2000);
    
    // Arrête après 30s
    setTimeout(() => {
      if (window.__ALI_SCAN_INTERVAL__) {
        clearInterval(window.__ALI_SCAN_INTERVAL__);
        window.__ALI_SCAN_INTERVAL__ = null;
        console.log('⏹️ Scan RADAR arrêté après 30 secondes');
      }
    }, 30000);
  }

  // Observer les nouvelles images ajoutées dynamiquement (une seule fois)
  if (!window.__ALI_MUTATION_OBSERVER__) {
    window.__ALI_MUTATION_OBSERVER__ = new MutationObserver(() => {
      scanImages();
    });

    window.__ALI_MUTATION_OBSERVER__.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Exposer une fonction globale pour le debug
  window.__ALI_IMAGES__ = () => Array.from(detected.values());

  // Retourner les images trouvées IMMÉDIATEMENT (même si le scan continue en arrière-plan)
  const result = Array.from(detected.keys());
  
  // Si aucune image trouvée immédiatement, essayer les données JavaScript
  if (result.length === 0) {
    try {
      if (window.runParams?.data?.imageModule?.imagePathList) {
        window.runParams.data.imageModule.imagePathList.forEach(url => {
          if (url && typeof url === 'string') {
            const urlLower = url.toLowerCase();
            if ((urlLower.includes('ae-pic') || urlLower.includes('alicdn.com')) && 
                !urlLower.includes('local') && !urlLower.includes('flag')) {
              const cleaned = cleanImageUrl(url);
              if (cleaned && !detected.has(cleaned)) {
                // Score par défaut pour images depuis données JS (généralement bonnes)
                const defaultScore = isLikelyLogoOrIcon(url) ? -50 : 40;
                detected.set(cleaned, {
                  src: cleaned,
                  originalSrc: url,
                  width: 0,
                  height: 0,
                  size: 0,
                  qualityScore: defaultScore,
                  inProductArea: true, // Images depuis données = zone produit
                  topPosition: 0,
                  isSuspect: isLikelyLogoOrIcon(url)
                });
              }
            }
          }
        });
      }
    } catch (e) {}
    
    try {
      if (window.__INITIAL_STATE__?.imageModule?.imagePathList) {
        window.__INITIAL_STATE__.imageModule.imagePathList.forEach(url => {
          if (url && typeof url === 'string') {
            const urlLower = url.toLowerCase();
            if ((urlLower.includes('ae-pic') || urlLower.includes('alicdn.com')) && 
                !urlLower.includes('local') && !urlLower.includes('flag')) {
              const cleaned = cleanImageUrl(url);
              if (cleaned && !detected.has(cleaned)) {
                // Score par défaut pour images depuis données JS (généralement bonnes)
                const defaultScore = isLikelyLogoOrIcon(url) ? -50 : 40;
                detected.set(cleaned, {
                  src: cleaned,
                  originalSrc: url,
                  width: 0,
                  height: 0,
                  size: 0,
                  qualityScore: defaultScore,
                  inProductArea: true, // Images depuis données = zone produit
                  topPosition: 0,
                  isSuspect: isLikelyLogoOrIcon(url)
                });
              }
            }
          }
        });
      }
    } catch (e) {}
  }

  // Trier les images par score de qualité (meilleures en premier)
  const imagesArray = Array.from(detected.values());
  
  // Filtrer et trier
  const sortedImages = imagesArray
    .map(img => {
      // Assurer qu'il y a un score (par défaut bas si manquant)
      if (img.qualityScore === undefined || img.qualityScore === null) {
        img.qualityScore = isLikelyLogoOrIcon(img.src) ? -50 : 10;
      }
      return img;
    })
    .filter(img => {
      // Exclure les images avec score très négatif (probables logos/icônes)
      // MAIS garder les images dans la zone produit même avec score négatif (ce sont probablement de vraies images)
      if (img.qualityScore < -20 && !img.inProductArea) {
        console.log(`⏭️ Image exclue (score trop bas et hors zone produit): ${img.src.substring(0, 80)} [Score: ${img.qualityScore.toFixed(1)}]`);
        return false;
      }
      // Si l'image est dans la zone produit, la garder même avec un score négatif
      if (img.inProductArea) {
        console.log(`✅ Image gardée (dans zone produit): ${img.src.substring(0, 60)}... [Score: ${img.qualityScore.toFixed(1)}]`);
      }
      return true;
    })
    .sort((a, b) => {
      // Trier par score décroissant (meilleures en premier)
      return (b.qualityScore || 0) - (a.qualityScore || 0);
    });
  
  const finalResult = sortedImages.map(img => img.src);
  
  console.log(`✅ Snappix: ${finalResult.length} image(s) produit AliExpress trouvée(s) (après tri intelligent)`);
  if (sortedImages.length > 0) {
    console.log(`   Top 3 images:`);
    sortedImages.slice(0, 3).forEach((img, i) => {
      console.log(`   ${i + 1}. Score: ${img.qualityScore.toFixed(1)} | ${img.width}x${img.height} | ${img.src.substring(0, 60)}...`);
    });
  }
  
  return finalResult;
}

// Fonction pour extraire toutes les images (peut être appelée depuis popup.js)
window.extractAllProductImagesForSnappix = function() {
  console.log('🔍 Snappix: Recherche de TOUTES les images produit...');
  const allImages = new Set(); // Utiliser un Set pour éviter les doublons
  
  // Détecter si on est sur Amazon ou AliExpress
  const isAmazon = window.location.hostname.includes('amazon');
  const isAliExpress = window.location.hostname.includes('aliexpress');
  
  // Amazon - Collecter toutes les images
  if (isAmazon) {
    const amazonSelectors = [
      '#landingImage',
      '#imgBlkFront',
      '#main-image img',
      '#main-image-container img',
      '#imageBlock_feature_div img',
      '.a-dynamic-image',
      '[data-a-image-name="landingImage"]',
      '#ivLargeImage img',
      '#main-image-container .a-dynamic-image'
    ];
    
    for (const selector of amazonSelectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        let src = element.src || 
                  element.getAttribute('data-src') || 
                  element.getAttribute('data-a-dynamic-image') ||
                  element.getAttribute('data-old-src') ||
                  element.getAttribute('data-lazy-src');
        
        if (src) {
          if (src.startsWith('{')) {
            try {
              const data = JSON.parse(src);
              src = Object.keys(data)[0];
            } catch (e) {
              // Ignorer
            }
          }
          
          if (src.includes('._')) {
            src = src.split('._')[0] + '.jpg';
          }
          
          const cleaned = cleanImageUrl(src);
          if (cleaned && cleaned.includes('amazon')) {
            allImages.add(cleaned);
          }
        }
      });
    }
  }
  
  // AliExpress - Utiliser la fonction améliorée de Claude
  if (isAliExpress) {
    const aliImages = extractAllProductImagesFromAliExpress();
    if (aliImages && aliImages.length > 0) {
      aliImages.forEach(url => allImages.add(url));
    }
  }

  const imagesArray = Array.from(allImages);
  console.log(`✅ Snappix: ${imagesArray.length} image(s) trouvée(s)`, imagesArray);
  
  if (imagesArray.length === 0) {
    console.log('❌ Snappix: Aucune image trouvée');
    return null;
  }
  
  return imagesArray;
};

// Exposer la fonction améliorée pour le debug
window.extractAllProductImagesFromAliExpress = extractAllProductImagesFromAliExpress;

// Fonction de compatibilité pour retourner seulement la première image
window.extractProductImageForSnappix = function() {
  const allImages = window.extractAllProductImagesForSnappix();
  return allImages && allImages.length > 0 ? allImages[0] : null;
};

// Auto-détection si la page est chargée
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Snappix: DOM chargé, prêt pour la détection');
  });
} else {
  console.log('Snappix: DOM déjà chargé, prêt pour la détection');
}
