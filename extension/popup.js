// Configuration
const API_BASE_URL_KEY = 'api_base_url';
const DEFAULT_API_URL = 'http://localhost:3001';

// Styles disponibles avec images de preview (sera filtré selon le plan)
const ALL_STYLES = [
  { id: 'studio-blanc', label: 'Studio Blanc', desc: 'Amazon pro', recommended: false, previewImage: 'styles/style1.jpg.jpg' },
  { id: 'lifestyle-maison', label: 'Lifestyle Maison', desc: 'Instagram ready', recommended: true, previewImage: 'styles/style2.jpg.jpg' },
  { id: 'minimal-gradient', label: 'Minimal Gradient', desc: 'Clean moderne', recommended: false, previewImage: 'styles/style3.jpg.jpg' },
  { id: 'social-ads', label: 'Social Ads', desc: 'Meta + TikTok', recommended: false, previewImage: 'styles/style4.jpg.jpg' },
  { id: 'luxury-black', label: 'Luxury Black', desc: 'High-ticket', recommended: false, previewImage: 'styles/style5.jpg.jpg' },
  { id: 'packshot-3d', label: 'Packshot 3D', desc: 'Premium 3D', recommended: false, previewImage: 'styles/style6.jpg.jpg' },
  { id: 'color-block', label: 'Color Block', desc: 'Fun Gen Z', recommended: false, previewImage: 'styles/style7.jpg.jpg' },
  { id: 'mockup-scene', label: 'Mockup Scene', desc: 'Storytelling', recommended: false, previewImage: 'styles/style8.jpg.jpg' },
];

// Styles disponibles selon le plan (sera mis à jour depuis l'API)
// Par défaut, on commence avec FREE (2 styles seulement)
let STYLES = ALL_STYLES.slice(0, 2);

// Formats disponibles (sera chargé depuis l'API selon le plan)
// Formats par défaut (sera remplacé par les formats chargés depuis l'API)
// Les formats sont des tailles, la qualité (JPG/PNG/WEBP) est automatique selon le plan
let FORMATS = [
  // Formats de base - tailles différentes
  { id: '1024x1024', label: '1024x1024', icon: 'square', ratio: '1:1', width: 1024, height: 1024, available: true },
  { id: '1920x1080', label: '1920x1080', icon: 'horizontal', ratio: '16:9', width: 1920, height: 1080, available: false },
  { id: '2048x2048', label: '2048x2048', icon: 'square', ratio: '1:1', width: 2048, height: 2048, available: false },
  // Formats PRO essentiels
  { id: '1080x1080', label: '1080x1080', icon: 'square', ratio: '1:1', width: 1080, height: 1080, available: false },
  { id: '1080x1920', label: '1080x1920', icon: 'vertical', ratio: '9:16', width: 1080, height: 1920, available: false },
];

// Plan utilisateur (sera chargé depuis l'API)
let userPlan = 'FREE';

// État de l'application
let currentState = 'normal'; // 'normal', 'loading', 'success'
let selectedStyle = 'lifestyle-maison';
let selectedFormat = '1024x1024'; // Format par défaut
let currentImageUrl = null;
let allProductImages = []; // Toutes les images détectées
let selectedImageIndices = new Set([0]); // Indices des images sélectionnées (par défaut, la première)

// Éléments DOM
const normalStateEl = document.getElementById('normal-state');
const loadingStateEl = document.getElementById('loading-state');
const successStateEl = document.getElementById('success-state');
const errorMessageEl = document.getElementById('error-message');
const imagePreviewBox = document.getElementById('image-preview-box');
const imageSourceText = document.getElementById('image-source-text');
const btnCopyUrl = document.getElementById('btn-copy-url');
const quickPreviewsEl = document.getElementById('quick-previews');
const styleGridEl = document.getElementById('style-grid');
const formatButtonsEl = document.getElementById('format-buttons');
const btnGenerate = document.getElementById('btn-generate');
const btnOpenVisuals = document.getElementById('btn-open-visuals');
const btnVisuals = document.getElementById('btn-visuals');
const apiUrlInput = document.getElementById('api-url');
const apiTokenInput = document.getElementById('api-token');
const creditsBadge = document.getElementById('credits-badge');

// Gérer l'erreur du logo
function handleLogoError() {
  const logoImg = document.getElementById('logo-img');
  const logoFallback = document.getElementById('logo-fallback');
  if (logoImg) logoImg.style.display = 'none';
  if (logoFallback) logoFallback.style.display = 'flex';
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Snappix Extension - Popup initialisé');
  
  // Gérer le logo
  const logoImg = document.getElementById('logo-img');
  if (logoImg) {
    // Essayer d'abord avec chrome.runtime.getURL
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        const logoUrl = chrome.runtime.getURL('logo.png');
        logoImg.src = logoUrl;
        // Si le logo ne charge pas, onerror sera appelé automatiquement
        logoImg.addEventListener('error', handleLogoError);
      } catch (e) {
        console.log('Erreur lors du chargement du logo:', e);
        handleLogoError();
      }
    } else {
      // Fallback : utiliser le chemin relatif
      logoImg.addEventListener('error', handleLogoError);
    }
  }
  
  // Initialiser les composants UI avec les valeurs par défaut (FREE)
  // Les styles et formats seront mis à jour après le chargement du plan
  initializeStyles();
  initializeFormats();
  await loadUserPlanAndFormats(); // Charger le plan et les formats depuis l'API (cela mettra à jour STYLES et FORMATS)
  initializeEventListeners();
  
  // Charger l'URL API sauvegardée
  try {
    const saved = await chrome.storage.local.get(API_BASE_URL_KEY);
    let apiUrl = saved[API_BASE_URL_KEY] || DEFAULT_API_URL;
    
    // Corriger automatiquement l'ancienne URL (localhost:3000 -> localhost:3001)
    if (apiUrl.includes('localhost:3000')) {
      apiUrl = apiUrl.replace('localhost:3000', 'localhost:3001');
      // Sauvegarder la correction
      await chrome.storage.local.set({ [API_BASE_URL_KEY]: apiUrl });
      console.log('✅ URL corrigée automatiquement:', apiUrl);
    }
    
    apiUrlInput.value = apiUrl;
  } catch (e) {
    console.error('Erreur lors du chargement de l\'URL:', e);
    apiUrlInput.value = DEFAULT_API_URL;
  }

  // Récupérer l'image depuis le content script
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Onglet actif:', tab.url);
    
    if (!tab.url) {
      showError('Unable to detect current page');
      return;
    }

    // Vérifier si l'utilisateur est revenu sur la page sans la recharger
    try {
      const stored = await chrome.storage.local.get(['lastProductUrl', 'lastProductUrlTimestamp']);
      const lastUrl = stored.lastProductUrl;
      const lastTimestamp = stored.lastProductUrlTimestamp;
      const currentTimestamp = Date.now();
      
      // Si l'URL est la même mais que le timestamp est ancien (plus de 5 secondes), 
      // cela signifie que l'utilisateur a quitté et est revenu sans recharger
      if (lastUrl === tab.url && lastTimestamp && (currentTimestamp - lastTimestamp) > 5000) {
        // Afficher un message pour recharger la page
        showReloadPageMessage(tab.id);
        return;
      }
      
      // Enregistrer l'URL de la page dans le storage
      await chrome.storage.local.set({ 
        lastProductUrl: tab.url,
        lastProductUrlTimestamp: currentTimestamp
      });
      console.log('✅ URL enregistrée:', tab.url);
      
      // Afficher l'URL dans l'interface
      if (imageSourceText) {
        const urlDisplay = tab.url.length > 60 ? tab.url.substring(0, 60) + '...' : tab.url;
        imageSourceText.textContent = `📎 ${urlDisplay}`;
        imageSourceText.title = tab.url; // Tooltip avec l'URL complète
      }
    } catch (e) {
      console.error('Erreur lors de l\'enregistrement de l\'URL:', e);
    }

    // Vérifier si on est sur Amazon ou AliExpress
    if (!isSupportedSite(tab.url)) {
      showError('This extension only works on Amazon and AliExpress');
      return;
    }


    // Injecter le content script si nécessaire et récupérer TOUTES les images
    console.log('🔍 Popup - Début de la détection d\'images...');
    let images = await getAllProductImages(tab.id);
    console.log('📊 Popup - Images détectées (tentative 1):', images);
    console.log('📊 Popup - Nombre d\'images:', images?.length || 0);
    
    if (!images || images.length === 0) {
      // Pour AliExpress, attendre plus longtemps (les images chargent souvent de manière asynchrone)
      const waitTime = isAliExpress ? 3000 : 500;
      
      console.log(`Première tentative échouée, nouvelle tentative après ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      images = await getAllProductImages(tab.id);
      console.log('Images détectées (tentative 2):', images);
    }
    
    if ((!images || images.length === 0) && isAliExpress) {
      // Deuxième tentative pour AliExpress après un délai supplémentaire
      console.log('Deuxième tentative pour AliExpress (attente 3s)...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      images = await getAllProductImages(tab.id);
      console.log('Images détectées (tentative 3):', images);
    }
    
    if ((!images || images.length === 0) && isAliExpress) {
      // Dernière tentative pour AliExpress après un délai encore plus long
      console.log('Dernière tentative pour AliExpress (attente 4s)...');
      await new Promise(resolve => setTimeout(resolve, 4000));
      images = await getAllProductImages(tab.id);
      console.log('Images détectées (tentative 4):', images);
    }
    
    if (images && images.length > 0) {
      allProductImages = images;
      selectedImageIndices = new Set([0]); // Sélectionner la première image par défaut
      currentImageUrl = images[0];
      showImagePreview(images[0], images);
      
      // Charger automatiquement les images dans le dashboard
      await autoSaveImagesToDashboard(tab.url, images);
    } else {
      // Afficher un message simple au premier chargement (pas de bouton)
      showNoImagesMessage(tab.id, isAliExpress);
    }
  } catch (error) {
    console.error('Erreur:', error);
    showError('Error detecting image: ' + error.message);
  }
});

// Helper pour générer un gradient de fallback
function generateFallbackGradient(index) {
  const colors = [
    ['667eea', '764ba2'], // Violet
    ['f093fb', 'f5576c'], // Rose
    ['4facfe', '00f2fe'], // Bleu
    ['43e97b', '38f9d7'], // Vert
    ['fa709a', 'fee140'], // Rose-jaune
    ['30cfd0', '330867'], // Cyan-violet
    ['a8edea', 'fed6e3'], // Pastel
    ['ff9a9e', 'fecfef'], // Rose pastel
  ];
  const colorPair = colors[index % colors.length];
  return `linear-gradient(135deg, #${colorPair[0]}, #${colorPair[1]})`;
}

// Initialiser les styles
function initializeStyles() {
  // Quick previews avec vraies images
  // Utiliser STYLES directement (déjà filtré selon le plan)
  quickPreviewsEl.innerHTML = STYLES.map((style, index) => {
    const imageUrl = style.previewImage ? chrome.runtime.getURL(style.previewImage) : null;
    const fallbackGradient = generateFallbackGradient(index);
    return `
    <div class="preview-item">
      <button 
        type="button" 
        class="preview-btn ${selectedStyle === style.id ? 'selected' : ''}"
        data-style-id="${style.id}"
        title="${style.label}"
      >
        <div class="preview-fallback" style="width: 100%; height: 100%; background: ${fallbackGradient}; position: absolute; top: 0; left: 0; z-index: 0;"></div>
        ${imageUrl ? `
          <img 
            src="${imageUrl}" 
            alt="${style.label}" 
            class="preview-image"
            data-image-url="${imageUrl}"
            style="position: relative; z-index: 1; display: block; width: 100%; height: 100%; object-fit: cover;"
          >
        ` : ''}
      </button>
      <div class="preview-tooltip">${style.label}</div>
    </div>
  `;
  }).join('');

  // Style grid
  styleGridEl.innerHTML = STYLES.map(style => `
    <button 
      type="button" 
      class="style-btn ${selectedStyle === style.id ? 'selected' : ''}"
      data-style-id="${style.id}"
    >
      <span class="style-label">${style.label}</span>
      ${style.recommended ? '<span class="style-badge">Recommended</span>' : ''}
    </button>
  `).join('');

  // Event listeners pour les styles
  document.querySelectorAll('.preview-btn, .style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const styleId = btn.dataset.styleId;
      selectStyle(styleId);
    });
  });
  
  // Event listeners pour les images de preview (gérer les erreurs de chargement)
  document.querySelectorAll('.preview-image').forEach(img => {
    img.addEventListener('error', function() {
      const imageUrl = this.dataset.imageUrl || this.src;
      console.error('Image failed to load:', imageUrl);
      this.style.display = 'none';
    });
    img.addEventListener('load', function() {
      const imageUrl = this.dataset.imageUrl || this.src;
      console.log('Image loaded:', imageUrl);
      this.style.display = 'block';
    });
  });
}

// Charger le plan utilisateur et les formats disponibles
async function loadUserPlanAndFormats() {
  try {
    const saved = await chrome.storage.local.get(API_BASE_URL_KEY);
    const apiUrl = saved[API_BASE_URL_KEY] || DEFAULT_API_URL;
    
    const response = await fetch(`${apiUrl}/api/user/plan`, {
      method: 'GET',
      credentials: 'include', // Inclure les cookies pour l'authentification
    });
    
    if (response.ok) {
      const data = await response.json();
      userPlan = data.plan || 'FREE';
      
      // Filtrer les styles selon le plan
      if (data.styles && Array.isArray(data.styles)) {
        const availableStyleIds = data.styles.map(s => s.id);
        console.log('🔍 Styles disponibles depuis l\'API:', { 
          plan: userPlan, 
          availableStyleIds,
          stylesFromAPI: data.styles.map(s => ({ id: s.id, label: s.label }))
        });
        
        STYLES = ALL_STYLES.filter(style => availableStyleIds.includes(style.id));
        console.log('✅ Styles filtrés selon le plan:', { 
          plan: userPlan, 
          stylesCount: STYLES.length,
          filteredStyles: STYLES.map(s => ({ id: s.id, label: s.label }))
        });
        
        // Réinitialiser les styles dans l'UI
        initializeStyles();
        
        // Si le style sélectionné n'est plus disponible, sélectionner le premier style disponible
        if (!STYLES.some(s => s.id === selectedStyle)) {
          selectedStyle = STYLES[0]?.id || 'lifestyle-maison';
        }
      }
      
      // Charger TOUS les formats individuels (pas groupés par ratio)
      const allFormats = [];
      
      // Formats disponibles pour le plan actuel - afficher les tailles (pas les qualités)
      // Grouper par taille (width x height) et ignorer la qualité (JPG/PNG/WEBP)
      // MAIS garder le formatId original de l'API pour la validation
      const formatsBySize = {};
      
      data.formats.forEach(format => {
        // Créer une clé unique basée sur la taille (width x height)
        const sizeKey = `${format.width}x${format.height}`;
        
        if (!formatsBySize[sizeKey]) {
          formatsBySize[sizeKey] = {
            id: sizeKey, // ID pour l'UI (affichage)
            apiFormatId: format.id, // ID original de l'API pour la validation (ex: 'jpg-1024')
            label: sizeKey,
            icon: getFormatIcon(format.ratio),
            ratio: format.ratio,
            width: format.width,
            height: format.height,
            available: true, // Disponible pour le plan actuel
          };
        } else {
          // Si plusieurs formats ont la même taille, utiliser le premier formatId de l'API
          // (pour FREE, on aura 'jpg-1024', pour STARTER/PRO on peut avoir plusieurs options)
          if (!formatsBySize[sizeKey].apiFormatId) {
            formatsBySize[sizeKey].apiFormatId = format.id;
          }
        }
      });
      
      // Convertir en tableau
      Object.values(formatsBySize).forEach(format => {
        allFormats.push(format);
      });
      
      // Trier les formats : disponibles en premier, puis verrouillés
      allFormats.sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        return 0;
      });
      
      FORMATS = allFormats;
      
      // Si le format sélectionné n'est plus disponible, sélectionner le premier format disponible
      if (!FORMATS.some(f => f.id === selectedFormat && f.available)) {
        const firstAvailable = FORMATS.find(f => f.available);
        if (firstAvailable) {
          selectedFormat = firstAvailable.id;
        }
      }
      
      // Mettre à jour le badge du plan
      const creditsBadge = document.getElementById('credits-badge');
      if (creditsBadge) {
        const planLabels = {
          'FREE': 'Free',
          'STARTER': 'Starter',
          'PRO': 'Pro'
        };
        creditsBadge.textContent = `${planLabels[userPlan] || 'Free'} · ${data.formats.length} formats`;
      }
      
      console.log('✅ Plan, formats et styles chargés:', { plan: userPlan, formatsCount: FORMATS.length, stylesCount: STYLES.length });
      
      // Réinitialiser les formats dans l'UI
      initializeFormats();
    } else {
      console.warn('⚠️ Impossible de charger le plan, utilisation des formats par défaut');
      // Mettre à jour les formats disponibles selon le plan par défaut (FREE)
      FORMATS.forEach(format => {
        format.available = ['1024x1024'].includes(format.id);
      });
      // Filtrer les styles pour FREE (2 styles seulement)
      STYLES = ALL_STYLES.slice(0, 2);
      initializeStyles();
      initializeFormats();
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement du plan:', error);
    // Utiliser les formats par défaut en cas d'erreur
    // Mettre à jour les formats disponibles selon le plan par défaut (FREE)
    FORMATS.forEach(format => {
      format.available = ['1024x1024'].includes(format.id);
    });
    // Filtrer les styles pour FREE (2 styles seulement)
    STYLES = ALL_STYLES.slice(0, 2);
    initializeStyles();
    initializeFormats();
  }
}

// Helper pour obtenir le label d'un format
function getFormatLabel(ratio, width, height) {
  const ratioLabels = {
    '1:1': `Carré ${width}x${height}`,
    '4:5': `Vertical ${width}x${height}`,
    '3:4': `Portrait ${width}x${height}`,
    '16:9': `Horizontal ${width}x${height}`,
    '9:16': `Stories ${width}x${height}`,
    '3:1': `Banner ${width}x${height}`,
    '2:3': `Pinterest ${width}x${height}`,
  };
  return ratioLabels[ratio] || `${ratio} ${width}x${height}`;
}

// Helper pour obtenir l'icône d'un format
function getFormatIcon(ratio) {
  if (ratio === '1:1') return 'square';
  if (ratio === '4:5' || ratio === '3:4' || ratio === '9:16' || ratio === '2:3') return 'vertical';
  return 'horizontal';
}

// Initialiser les formats
function initializeFormats() {
  formatButtonsEl.innerHTML = FORMATS.map(format => {
    let iconSvg = '';
    if (format.icon === 'square') {
      iconSvg = '<svg class="format-icon" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="12" height="12" rx="1.5" /></svg>';
    } else if (format.icon === 'vertical') {
      iconSvg = '<svg class="format-icon" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="0.5" width="8" height="13" rx="1.5" /></svg>';
    } else {
      iconSvg = '<svg class="format-icon" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="0.5" y="3" width="13" height="8" rx="1.5" /></svg>';
    }
    
    // Si le format n'est pas disponible pour le plan actuel, l'afficher en grisé
    const isAvailable = format.available !== false;
    const disabledClass = !isAvailable ? 'format-btn-locked' : '';
    const lockIcon = !isAvailable ? '<svg class="format-lock-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V4a3 3 0 0 1 6 0v3"/></svg>' : '';
    
    return `
      <button 
        type="button" 
        class="format-btn ${selectedFormat === format.id ? 'selected' : ''} ${disabledClass}"
        data-format-id="${format.id}"
        ${!isAvailable ? 'disabled title="PRO Format - Upgrade your plan"' : ''}
      >
        ${iconSvg}
        <span class="format-label">${format.label}</span>
        ${lockIcon}
      </button>
    `;
  }).join('');

  // Event listeners pour les formats
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const formatId = btn.dataset.formatId;
      const isLocked = btn.classList.contains('format-btn-locked');
      
      if (isLocked) {
        showError('This format requires PRO plan. Upgrade your plan to access it.');
        return;
      }
      
      selectFormat(formatId);
    });
  });
}

// Initialiser les event listeners
function initializeEventListeners() {
  // Bouton générer
  btnGenerate.addEventListener('click', handleGenerate);
  
  // Bouton copier URL
  btnCopyUrl.addEventListener('click', handleCopyUrl);
  
  // Bouton ouvrir visuels
  btnOpenVisuals.addEventListener('click', handleOpenVisuals);
  
  // Bouton mes visuels (header)
  btnVisuals.addEventListener('click', () => {
    const apiUrl = apiUrlInput.value || DEFAULT_API_URL;
    chrome.tabs.create({ url: `${apiUrl}/dashboard` });
  });
  
  // Bouton upload de fichier
  const btnUpload = document.getElementById('btn-upload');
  if (btnUpload) {
    // Créer un input file caché
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    btnUpload.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file.');
        return;
      }
      
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File is too large. Maximum size: 10MB.');
        return;
      }
      
      try {
        // Convertir le fichier en base64
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target.result;
          
          // Mettre à jour l'image preview
          allProductImages = [base64];
          selectedImageIndices = new Set([0]);
          currentImageUrl = base64;
          showImagePreview(base64, [base64]);
          
          // Sauvegarder automatiquement dans le dashboard
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab?.url) {
            await autoSaveImagesToDashboard(tab.url, [base64]);
          }
        };
        reader.onerror = () => {
          showError('Error reading file.');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        showError('Error uploading file: ' + error.message);
      }
      
      // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
      fileInput.value = '';
    });
  }
  
}

// Sélectionner un style
function selectStyle(styleId) {
  selectedStyle = styleId;
  
  // Mettre à jour les previews
  document.querySelectorAll('.preview-btn').forEach(btn => {
    if (btn.dataset.styleId === styleId) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  
  // Mettre à jour la grille
  document.querySelectorAll('.style-btn').forEach(btn => {
    if (btn.dataset.styleId === styleId) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

// Sélectionner un format
function selectFormat(formatId) {
  selectedFormat = formatId;
  
  document.querySelectorAll('.format-btn').forEach(btn => {
    if (btn.dataset.formatId === formatId) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

// Vérifier si le site est supporté
function isSupportedSite(url) {
  return url.includes('amazon.com') || 
         url.includes('amazon.fr') || 
         url.includes('amazon.co.uk') ||
         url.includes('aliexpress.com') ||
         url.includes('fr.aliexpress.com');
}

// Récupérer toutes les images du produit
async function getAllProductImages(tabId) {
  try {
    // Utiliser la nouvelle fonction qui retourne toutes les images
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (window.extractAllProductImagesForSnappix) {
          return window.extractAllProductImagesForSnappix();
        }
        return null;
      },
    });

    const images = results[0]?.result || null;
    
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`✅ ${images.length} image(s) extraite(s) avec succès:`, images);
      console.log(`📸 Première image:`, images[0]?.substring(0, 100) + '...');
    } else {
      console.log('⚠️ Aucune image trouvée');
      console.log('🔍 Résultat de executeScript:', results);
      console.log('🔍 Type du résultat:', typeof results[0]?.result);
    }
    
    return images;
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction:', error);
    // Fallback : essayer avec l'ancienne fonction
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: extractProductImage,
      });
      const imageUrl = results[0]?.result || null;
      return imageUrl ? [imageUrl] : null;
    } catch (e) {
      return null;
    }
  }
}

// Fonction injectée pour extraire l'image (fallback si content script non chargé)
// Cette fonction utilise les fonctions du content script si disponibles
function extractProductImage() {
  // Essayer d'abord d'utiliser les fonctions du content script
  if (window.extractAllProductImagesForSnappix) {
    const images = window.extractAllProductImagesForSnappix();
    if (images && images.length > 0) {
      return images[0]; // Retourner la première image
    }
  }
  
  // Fallback simple pour Amazon
  const amazonSelectors = [
    '#landingImage',
    '#imgBlkFront',
    '#main-image img',
    '#main-image-container img'
  ];
  
  for (const selector of amazonSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const src = element.src || element.getAttribute('data-src');
      if (src && src.startsWith('http')) {
        return src;
      }
    }
  }
  
  // Fallback simple pour AliExpress
  const metaImage = document.querySelector('meta[property="og:image"]');
  if (metaImage) {
    const src = metaImage.getAttribute('content');
    if (src && src.includes('alicdn.com') && src.startsWith('http')) {
      return src.split('?')[0];
    }
  }
  
  return null;
}

// Afficher un message pour recharger la page quand l'utilisateur revient sans recharger
function showReloadPageMessage(tabId) {
  if (!imagePreviewBox) return;
  
  imagePreviewBox.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 100%; padding: 8px;">
      <svg class="icon-placeholder" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 32px; height: 32px; color: #CBD5E0; flex-shrink: 0;">
        <rect x="4" y="6" width="32" height="28" rx="3" />
        <circle cx="14" cy="16" r="3" />
        <path d="M4 28l10-8 6 5 6-4 10 7" />
      </svg>
      <span class="image-detected-text" style="color: #718096; text-align: center; font-size: 10px; line-height: 1.3; padding: 0 4px; display: block;">
        Please reload the page to detect images.
      </span>
      <button 
        type="button" 
        id="reload-page-message-btn" 
        class="reload-page-btn"
        style="
          background: linear-gradient(135deg, #F0A830 0%, #D99315 100%);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: auto;
          min-width: 100px;
          transition: transform 0.2s, box-shadow 0.2s;
          flex-shrink: 0;
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reload
      </button>
    </div>
  `;
  
  // Ajouter l'event listener pour le bouton de rechargement
  const reloadBtn = document.getElementById('reload-page-message-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', async () => {
      reloadBtn.disabled = true;
      reloadBtn.style.opacity = '0.6';
      reloadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reloading...
      `;
      
      // Recharger la page dans l'onglet
      try {
        await chrome.tabs.reload(tabId);
        // Attendre un peu puis réessayer de détecter les images
        await new Promise(resolve => setTimeout(resolve, 2000));
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
          await reloadImages(tabId, tab.url.includes('aliexpress.com'));
        }
      } catch (error) {
        console.error('Erreur lors du rechargement de la page:', error);
        showError('Error reloading page: ' + error.message);
        reloadBtn.disabled = false;
        reloadBtn.style.opacity = '1';
        reloadBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Reload la page
        `;
      }
    });
  }
  
  // Mettre à jour le texte source
  if (imageSourceText) {
    imageSourceText.textContent = 'Please reload the page to detect images.';
  }
  
  // Cacher la galerie
  const gallery = document.getElementById('image-gallery');
  if (gallery) {
    gallery.style.display = 'none';
  }
}

// Afficher un message simple quand aucune image n'est détectée (premier chargement)
function showNoImagesMessage(tabId, isAliExpress = false) {
  if (!imagePreviewBox) return;
  
  imagePreviewBox.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 100%; padding: 8px;">
      <svg class="icon-placeholder" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 32px; height: 32px; color: #CBD5E0; flex-shrink: 0;">
        <rect x="4" y="6" width="32" height="28" rx="3" />
        <circle cx="14" cy="16" r="3" />
        <path d="M4 28l10-8 6 5 6-4 10 7" />
      </svg>
      <span class="image-detected-text" style="color: #718096; text-align: center; font-size: 10px; line-height: 1.3; padding: 0 4px; display: block;">
        No images detected on this page.
      </span>
      <button 
        type="button" 
        id="reload-page-btn" 
        class="reload-page-btn"
        style="
          background: linear-gradient(135deg, #F0A830 0%, #D99315 100%);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: auto;
          min-width: 100px;
          transition: transform 0.2s, box-shadow 0.2s;
          flex-shrink: 0;
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reload
      </button>
    </div>
  `;
  
  // Ajouter l'event listener pour le bouton de rechargement
  const reloadBtn = document.getElementById('reload-page-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', async () => {
      reloadBtn.disabled = true;
      reloadBtn.style.opacity = '0.6';
      reloadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reloading...
      `;
      
      // Recharger la page dans l'onglet
      try {
        await chrome.tabs.reload(tabId);
        // Attendre un peu puis réessayer de détecter les images
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reloadImages(tabId, isAliExpress);
      } catch (error) {
        console.error('Erreur lors du rechargement de la page:', error);
        showError('Error reloading page: ' + error.message);
        reloadBtn.disabled = false;
        reloadBtn.style.opacity = '1';
        reloadBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Rechargez la page
        `;
      }
    });
  }
  
  // Mettre à jour le texte source
  if (imageSourceText) {
    imageSourceText.textContent = 'No images detected. Click "Reload page" to reload the tab and detect images.';
  }
  
  // Cacher la galerie
  const gallery = document.getElementById('image-gallery');
  if (gallery) {
    gallery.style.display = 'none';
  }
}

// Afficher un bouton de rechargement après une tentative de rechargement échouée
async function showReloadButton(tabId, isAliExpress = false) {
  if (!imagePreviewBox) return;
  
  imagePreviewBox.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 100%; padding: 8px;">
      <svg class="icon-placeholder" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 32px; height: 32px; color: #CBD5E0; flex-shrink: 0;">
        <rect x="4" y="6" width="32" height="28" rx="3" />
        <circle cx="14" cy="16" r="3" />
        <path d="M4 28l10-8 6 5 6-4 10 7" />
      </svg>
      <span class="image-detected-text" style="color: #E53E3E; text-align: center; font-size: 10px; line-height: 1.3; padding: 0 4px; display: block;">
        No images detected after reload
      </span>
      <button 
        type="button" 
        id="reload-images-btn" 
        class="reload-images-btn"
        style="
          background: linear-gradient(135deg, #F0A830 0%, #D99315 100%);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: auto;
          min-width: 100px;
          transition: transform 0.2s, box-shadow 0.2s;
          flex-shrink: 0;
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reload
      </button>
    </div>
  `;
  
  // Ajouter l'event listener pour le bouton de rechargement
  const reloadBtn = document.getElementById('reload-images-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', async () => {
      reloadBtn.disabled = true;
      reloadBtn.style.opacity = '0.6';
      reloadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reloading...
      `;
      
      // Recharger la page dans l'onglet
      try {
        await chrome.tabs.reload(tabId);
        // Attendre un peu puis réessayer de détecter les images
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reloadImages(tabId, isAliExpress);
      } catch (error) {
        console.error('Erreur lors du rechargement de la page:', error);
        showError('Error reloading page: ' + error.message);
        reloadBtn.disabled = false;
        reloadBtn.style.opacity = '1';
      }
    });
  }
  
  // Mettre à jour le texte source
  if (imageSourceText) {
    imageSourceText.textContent = 'No images detected. Click "Reload page" to reload the tab and detect images.';
  }
  
  // Cacher la galerie
  const gallery = document.getElementById('image-gallery');
  if (gallery) {
    gallery.style.display = 'none';
  }
}

// Fonction pour recharger les images
async function reloadImages(tabId, isAliExpress = false) {
  console.log('🔄 Rechargement des images...');
  
  try {
    // Réessayer plusieurs fois pour AliExpress
    let images = await getAllProductImages(tabId);
    
    if (!images || images.length === 0) {
      const waitTime = isAliExpress ? 2000 : 500;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      images = await getAllProductImages(tabId);
    }
    
    if ((!images || images.length === 0) && isAliExpress) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      images = await getAllProductImages(tabId);
    }
    
    if (images && images.length > 0) {
      allProductImages = images;
      selectedImageIndices = new Set([0]);
      currentImageUrl = images[0];
      showImagePreview(images[0], images);
      
      // Charger automatiquement les images dans le dashboard
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        await autoSaveImagesToDashboard(tab.url, images);
      }
      
      console.log('✅ Images rechargées avec succès');
    } else {
      // Si toujours pas d'images après rechargement, afficher le bouton de rechargement
      showReloadButton(tabId, isAliExpress);
    }
  } catch (error) {
    console.error('❌ Erreur lors du rechargement:', error);
    showReloadButton(tabId, isAliExpress);
    showError('Error reloading: ' + error.message);
  }
}

function showImagePreview(imageUrl, allImages = []) {
  if (!imagePreviewBox) {
    console.error('imagePreviewBox non trouvé');
    return;
  }
  
  // Créer une image
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.onerror = () => {
    console.error('Erreur lors du chargement de l\'image:', imageUrl);
    // Afficher un message d'erreur dans la preview box
    imagePreviewBox.innerHTML = `
      <svg class="icon-placeholder" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="4" y="6" width="32" height="28" rx="3" />
        <circle cx="14" cy="16" r="3" />
        <path d="M4 28l10-8 6 5 6-4 10 7" />
      </svg>
      <span class="image-detected-text" style="color: #E53E3E;">Erreur de chargement</span>
    `;
  };
  
  // Remplacer le placeholder
  imagePreviewBox.innerHTML = '';
  imagePreviewBox.appendChild(img);
  
  currentImageUrl = imageUrl;
  
  // Mettre à jour le texte source
  if (imageSourceText) {
    const imageCount = allImages.length > 1 ? ` (${allImages.length} images détectées)` : '';
    imageSourceText.textContent = `Source: ${imageUrl.substring(0, 50)}...${imageCount}`;
  }
  
  // Afficher la galerie de miniatures si plusieurs images
  if (allImages.length > 1) {
    showImageGallery(allImages);
  } else {
    // Cacher la galerie si une seule image
    const gallery = document.getElementById('image-gallery');
    if (gallery) {
      gallery.style.display = 'none';
    }
  }
}

// Afficher la galerie de miniatures pour sélectionner l'image
function showImageGallery(images) {
  // Créer ou récupérer le conteneur de la galerie
  let gallery = document.getElementById('image-gallery');
  if (!gallery) {
    gallery = document.createElement('div');
    gallery.id = 'image-gallery';
    gallery.className = 'image-gallery';
    // Insérer après image-preview-section
    const previewSection = document.querySelector('.image-preview-section');
    if (previewSection && previewSection.parentNode) {
      previewSection.parentNode.insertBefore(gallery, previewSection.nextSibling);
    }
  }
  
  gallery.style.display = 'block';
  const selectedCount = selectedImageIndices.size;
  gallery.innerHTML = `
    <p class="section-label" style="margin-bottom: 8px;">
      Images (${selectedCount}/${images.length})
    </p>
    <div class="gallery-thumbnails">
      ${images.map((imgUrl, index) => {
        const isSelected = selectedImageIndices.has(index);
        return `
        <button 
          type="button" 
          class="gallery-thumb ${isSelected ? 'selected' : ''}"
          data-image-index="${index}"
          title="Image ${index + 1} - ${isSelected ? 'Selected' : 'Click to select'}"
        >
          <img src="${imgUrl}" alt="Image ${index + 1}" class="gallery-thumb-img">
          ${isSelected ? '<span class="thumb-check">✓</span>' : ''}
        </button>
      `;
      }).join('')}
    </div>
  `;
  
  // Ajouter les event listeners
  gallery.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      toggleImageSelection(index);
    });
  });
  
  // Event listeners pour les images de la galerie (gérer les erreurs de chargement)
  gallery.querySelectorAll('.gallery-thumb-img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
    });
  });
}

// Basculer la sélection d'une image dans la galerie (sélection multiple)
function toggleImageSelection(index) {
  if (index < 0 || index >= allProductImages.length) return;
  
  // Toggle la sélection
  if (selectedImageIndices.has(index)) {
    // Désélectionner (mais garder au moins une image sélectionnée)
    if (selectedImageIndices.size > 1) {
      selectedImageIndices.delete(index);
    } else {
      // Ne pas permettre de tout désélectionner
      return;
    }
  } else {
    // Sélectionner
    selectedImageIndices.add(index);
  }
  
  // Mettre à jour l'aperçu principal avec la première image sélectionnée
  const firstSelectedIndex = Math.min(...Array.from(selectedImageIndices));
  currentImageUrl = allProductImages[firstSelectedIndex];
  
  const img = document.querySelector('#image-preview-box img');
  if (img) {
    img.src = currentImageUrl;
  }
  
  // Mettre à jour les miniatures
  document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
    const isSelected = selectedImageIndices.has(i);
    if (isSelected) {
      thumb.classList.add('selected');
      if (!thumb.querySelector('.thumb-check')) {
        const check = document.createElement('span');
        check.className = 'thumb-check';
        check.textContent = '✓';
        thumb.appendChild(check);
      }
      thumb.title = `Image ${i + 1} - Selected`;
    } else {
      thumb.classList.remove('selected');
      const check = thumb.querySelector('.thumb-check');
      if (check) check.remove();
      thumb.title = `Image ${i + 1} - Cliquez pour sélectionner`;
    }
  });
  
  // Mettre à jour le texte de la galerie
  const gallery = document.getElementById('image-gallery');
  if (gallery) {
    const label = gallery.querySelector('.section-label');
    if (label) {
      const selectedCount = selectedImageIndices.size;
      label.textContent = `Images (${selectedCount}/${allProductImages.length})`;
    }
  }
  
  // Mettre à jour le texte source
  if (imageSourceText) {
    const selectedCount = selectedImageIndices.size;
    const imageCount = allProductImages.length > 1 ? ` (${selectedCount} image${selectedCount > 1 ? 's' : ''} selected out of ${allProductImages.length})` : '';
    imageSourceText.textContent = `Source: ${currentImageUrl.substring(0, 50)}...${imageCount}`;
  }
}

// Copier l'URL
async function handleCopyUrl() {
  if (!currentImageUrl) return;
  
  try {
    await navigator.clipboard.writeText(currentImageUrl);
    btnCopyUrl.innerHTML = `
      <svg class="icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Copied!
    `;
    btnCopyUrl.classList.add('copied');
    
    setTimeout(() => {
      btnCopyUrl.innerHTML = `
        <svg class="icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        Copy URL
      `;
      btnCopyUrl.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Erreur lors de la copie:', error);
  }
}

// Générer les visuels
/**
 * Sauvegarde automatiquement les images détectées dans le dashboard
 */
async function autoSaveImagesToDashboard(sourceUrl, imageUrls) {
  if (!imageUrls || imageUrls.length === 0) {
    return;
  }

  try {
    // Vérifier si la sauvegarde automatique est activée
    const settings = await chrome.storage.local.get('autoSaveEnabled');
    const autoSaveEnabled = settings.autoSaveEnabled !== false; // Par défaut activé
    
    if (!autoSaveEnabled) {
      console.log('ℹ️ Sauvegarde automatique désactivée');
      return;
    }

    const apiBaseUrl = apiUrlInput.value.trim() || DEFAULT_API_URL;
    
    // Ne pas sauvegarder si l'URL API n'est pas configurée
    if (!apiBaseUrl || !apiBaseUrl.startsWith('http')) {
      console.log('⚠️ URL API non configurée, sauvegarde automatique ignorée');
      return;
    }

    console.log('💾 Sauvegarde automatique des images dans le dashboard...', {
      sourceUrl,
      imagesCount: imageUrls.length
    });

    const headers = {
      'Content-Type': 'application/json',
    };

    const apiToken = apiTokenInput.value.trim();
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    const response = await fetch(`${apiBaseUrl}/api/source-images`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        imageUrls: imageUrls,
        sourceUrl: sourceUrl,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Images sauvegardées automatiquement dans le dashboard:', data);
      
      // Afficher une notification discrète
      if (imageSourceText) {
        const originalText = imageSourceText.textContent;
        imageSourceText.textContent = '✅ Images saved to dashboard';
        imageSourceText.style.color = '#10B981';
        
        // Revenir au texte original après 3 secondes
        setTimeout(() => {
          if (imageSourceText) {
            imageSourceText.textContent = originalText;
            imageSourceText.style.color = '';
          }
        }, 3000);
      }
    } else {
      // Ne pas afficher d'erreur si c'est juste une erreur d'authentification
      // (l'utilisateur n'est peut-être pas connecté)
      if (response.status === 401 || response.status === 403) {
        console.log('⚠️ Non authentifié, sauvegarde automatique ignorée');
      } else {
        console.warn('⚠️ Erreur lors de la sauvegarde automatique:', response.status);
      }
    }
  } catch (error) {
    // Ne pas afficher d'erreur pour la sauvegarde automatique
    // C'est une fonctionnalité optionnelle
    console.log('⚠️ Erreur lors de la sauvegarde automatique (ignorée):', error.message);
  }
}

async function handleGenerate() {
  // Vérifier qu'il y a des images sélectionnées
  if (selectedImageIndices.size === 0 || allProductImages.length === 0) {
    showError('No image selected. Please select at least one image from the gallery.');
    return;
  }
  
  if (!currentImageUrl) {
    showError('No images detected. Reload the page in the tab to detect images.');
    return;
  }

  let apiBaseUrl = apiUrlInput.value.trim() || DEFAULT_API_URL;
  const apiToken = apiTokenInput.value.trim();

  // Corriger automatiquement l'ancienne URL (localhost:3000 -> localhost:3001)
  if (apiBaseUrl.includes('localhost:3000')) {
    apiBaseUrl = apiBaseUrl.replace('localhost:3000', 'localhost:3001');
    apiUrlInput.value = apiBaseUrl;
    console.log('✅ URL corrigée automatiquement dans handleGenerate:', apiBaseUrl);
  }

  // Valider l'URL de l'API
  if (!apiBaseUrl || !apiBaseUrl.startsWith('http')) {
    showError('URL de l\'API invalide. Vérifiez la configuration.');
    return;
  }

  // Sauvegarder l'URL API
  try {
    await chrome.storage.local.set({ [API_BASE_URL_KEY]: apiBaseUrl });
  } catch (e) {
    console.error('Erreur lors de la sauvegarde:', e);
  }

  // Changer d'état
  setState('loading');
  hideError();

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    // Récupérer l'URL de la page actuelle (plus fiable que le storage)
    let sourceUrl = null;
    try {
      // Récupérer l'URL directement depuis l'onglet actif
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url) {
        sourceUrl = tab.url;
        console.log('📎 URL de la page produit (depuis l\'onglet):', sourceUrl);
        
        // Mettre à jour le storage avec l'URL actuelle
        await chrome.storage.local.set({ 
          lastProductUrl: sourceUrl,
          lastProductUrlTimestamp: Date.now()
        });
      } else {
        // Fallback : utiliser le storage
        const stored = await chrome.storage.local.get('lastProductUrl');
        sourceUrl = stored.lastProductUrl || null;
        if (sourceUrl) {
          console.log('📎 URL de la page produit (depuis le storage):', sourceUrl);
        }
      }
    } catch (e) {
      console.error('Erreur lors de la récupération de l\'URL:', e);
      // Dernier recours : essayer le storage
      try {
        const stored = await chrome.storage.local.get('lastProductUrl');
        sourceUrl = stored.lastProductUrl || null;
      } catch (e2) {
        console.error('Erreur lors de la récupération depuis le storage:', e2);
      }
    }

    // Récupérer uniquement les images sélectionnées
    const selectedImageUrls = Array.from(selectedImageIndices)
      .sort((a, b) => a - b) // Trier par index
      .map(index => allProductImages[index])
      .filter(url => url); // Filtrer les URLs invalides
    
    if (selectedImageUrls.length === 0) {
      showError('No image selected. Please select at least one image.');
      setState('normal');
      return;
    }

    // CRITICAL: Log the selected image to verify it's correct
    const primaryImageUrl = selectedImageUrls[0];
    console.log('🖼️ Extension - Image sélectionnée pour génération:', {
      primaryImageUrl: primaryImageUrl,
      primaryImageUrlPreview: primaryImageUrl.substring(0, 100) + '...',
      selectedIndices: Array.from(selectedImageIndices),
      totalSelected: selectedImageUrls.length,
      allSelectedUrls: selectedImageUrls.map(url => url.substring(0, 80) + '...'),
      isHttps: primaryImageUrl.startsWith('https://'),
      containsImage: primaryImageUrl.match(/\.(jpg|jpeg|png|webp|avif)/i) ? 'yes' : 'no',
    });

    // Convertir le format ID en ratio pour l'API
    const selectedFormatObj = FORMATS.find(f => f.id === selectedFormat);
    const ratioForAPI = selectedFormatObj?.ratio || selectedFormat; // Utiliser le ratio du format ou le format lui-même
    // Utiliser l'ID original de l'API (ex: 'jpg-1024') au lieu de l'ID UI (ex: '1024x1024')
    const formatIdForAPI = selectedFormatObj?.apiFormatId || selectedFormat;

    // Trouver le style sélectionné et utiliser son label pour l'API
    const selectedStyleObj = STYLES.find(s => s.id === selectedStyle);
    const styleForAPI = selectedStyleObj?.label || selectedStyle; // Utiliser le label du style

    const requestBody = {
      imageUrl: primaryImageUrl, // Image principale (première sélectionnée) - MUST be the product image
      imageUrls: selectedImageUrls, // Toutes les images sélectionnées
      sourceUrl: sourceUrl, // URL de la page produit
      style: styleForAPI, // Label du style pour l'API (ex: "Studio Blanc")
      ratio: ratioForAPI, // Ratio pour l'API (ex: '1:1', '9:16', etc.)
      formatId: formatIdForAPI, // Format ID original de l'API pour la validation (ex: 'jpg-1024', '1080x1080')
    };

    console.log('📤 Extension - Envoi de la requête:', {
      url: `${apiBaseUrl}/api/jobs`,
      method: 'POST',
      primaryImageUrl: primaryImageUrl.substring(0, 100) + '...',
      style: selectedStyle,
      ratio: selectedFormat,
    });

    const response = await fetch(`${apiBaseUrl}/api/jobs`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Réponse reçue:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Vérifier si la réponse est OK
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Si on ne peut pas parser le JSON, utiliser le texte
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText.substring(0, 200);
          }
        } catch (e2) {
          // Ignorer
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Job créé avec succès:', data);

    // Succès !
    setState('success');
    
    // Stocker le job ID pour le bouton "Ouvrir mes visuels"
    btnOpenVisuals.dataset.jobId = data.jobId || data.id;
    btnOpenVisuals.dataset.apiUrl = apiBaseUrl;

  } catch (error) {
    console.error('❌ Erreur complète:', error);
    setState('normal');
    
    // Messages d'erreur plus détaillés
    let errorMessage = 'Error during generation';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = `Unable to connect to API (${apiBaseUrl}). Check that:
- The server is running (localhost:3001)
- The URL is correct
- CORS is configured on the server`;
    } else if (error.message.includes('CORS')) {
      errorMessage = 'CORS error. The server must allow requests from the Chrome extension.';
    } else if (error.message.includes('404')) {
      errorMessage = 'Endpoint not found. Check that the API is accessible at ' + apiBaseUrl;
    } else if (error.message.includes('401') || error.message.includes('403')) {
      errorMessage = `Authentication error (${error.message.includes('401') ? '401' : '403'}). 
      
You must be logged in to your Snappix account in this browser.

Solution:
1. Open ${apiBaseUrl}/login in a new tab
2. Log in with your account
3. Come back to this page and try again`;
    } else {
      errorMessage = error.message || 'Unknown error';
    }
    
    showError(errorMessage);
  }
}

// Ouvrir les visuels
function handleOpenVisuals() {
  const apiUrl = btnOpenVisuals.dataset.apiUrl || apiUrlInput.value || DEFAULT_API_URL;
  const jobId = btnOpenVisuals.dataset.jobId;
  
  if (jobId) {
    chrome.tabs.create({ url: `${apiUrl}/job/${jobId}` });
  } else {
    chrome.tabs.create({ url: `${apiUrl}/dashboard` });
  }
  
  // Réinitialiser
  setTimeout(() => {
    setState('normal');
  }, 500);
}

// Changer d'état
function setState(state) {
  currentState = state;
  
  normalStateEl.style.display = state === 'normal' ? 'flex' : 'none';
  loadingStateEl.style.display = state === 'loading' ? 'flex' : 'none';
  successStateEl.style.display = state === 'success' ? 'flex' : 'none';
}

// Afficher une erreur
function showError(message) {
  // Remplacer les retours à la ligne par des <br> pour l'affichage
  const formattedMessage = message.replace(/\n/g, '<br>');
  
  // Si le message contient "Solution :", créer un lien vers login
  if (message.includes('Solution :')) {
    const apiUrl = apiUrlInput.value || DEFAULT_API_URL;
    const loginLink = `<a href="${apiUrl}/login" style="color: #F0A830; text-decoration: underline; font-weight: 600;">Log in</a>`;
    errorMessageEl.innerHTML = formattedMessage.replace('Solution:', `Solution: ${loginLink}<br>`);
  } else {
    errorMessageEl.innerHTML = formattedMessage;
  }
  
  errorMessageEl.style.display = 'block';
  
  setTimeout(() => {
    hideError();
  }, 10000); // 10 secondes pour les messages d'erreur détaillés
}

// Cacher l'erreur
function hideError() {
  errorMessageEl.style.display = 'none';
}

